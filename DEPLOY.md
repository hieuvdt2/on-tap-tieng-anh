# Triển khai: Vercel (web) + Neon (database)

Web build tự động trên Vercel mỗi khi `git push`. Database Neon thì **không tự cập nhật**: mỗi khi sửa
`src/db/schema.ts` (thêm/sửa cột, bảng) phải đẩy schema lên Neon bằng tay.

> **Thứ tự bắt buộc: cập nhật Neon TRƯỚC, `git push` SAU.**
> Code mới truy vấn cột/bảng mới; nếu Vercel chạy code mới trước khi Neon có cột thì trang lỗi.
> Ngược lại (DB mới + code cũ) thì vẫn chạy bình thường vì các thay đổi chỉ thêm.

## 1. Thiết lập một lần: file `.env.neon`

Tạo file `.env.neon` ở thư mục gốc project (đã bị `.gitignore` bỏ qua nhờ mẫu `.env*`, **không bao giờ commit**):

```
NEON_DATABASE_URL="postgresql://USER:PASSWORD@ep-xxxx.region.aws.neon.tech/DBNAME?sslmode=require"
```

Lấy chuỗi này ở Neon Console → Dashboard → **Connection Details**. Khi chạy migrate nên chọn bản
**direct** (tắt công tắc "Connection pooling", host không có `-pooler`). Biến `DATABASE_URL` trên Vercel
thì dùng bản **pooled** (host có `-pooler`). (Khuyến nghị theo cách Neon mô tả pooler; chưa kiểm chứng
được bản pooled có chạy `drizzle-kit push` không, nên dùng direct cho chắc.)

## 2. Mỗi lần có đổi schema

```bash
npm run db:push:neon
```

Lệnh này (`drizzle-kit push --strict --verbose` với `drizzle.neon.config.ts`) làm 3 việc:

1. In dòng `[db:push:neon] DB đích: <host>`: **kiểm tra đúng host Neon, không phải `localhost`.**
2. In ra các câu SQL sẽ chạy.
3. Hỏi xác nhận trước khi thực thi.

Cách đọc SQL trước khi bấm đồng ý:

- Chỉ thấy `ALTER TABLE ... ADD COLUMN` và `CREATE TABLE`/`CREATE INDEX` → an toàn, chọn **Yes**.
- Thấy `DROP COLUMN`, `DROP TABLE`, hoặc `ALTER COLUMN ... TYPE` → **chọn No và dừng lại**, vì có thể mất dữ liệu.
- Nếu báo `No changes detected` thì Neon đã đồng bộ, không cần làm gì.

Đẩy lên DB **local** (máy bạn) thì dùng lệnh cũ: `npm run db:push` (đọc `DATABASE_URL` trong `.env.local`).

### Về `db:seed`

`npm run db:seed` chỉ **thêm hoặc cập nhật** (upsert theo id) phần nội dung soạn tay: chủ đề, câu gốc, Mã đề A/B.
Nó **không xoá gì**, không đụng câu do AI sinh hay dữ liệu người dùng, nên chạy lại bao nhiêu lần cũng an toàn.

- **Đổi schema** (thêm cột/bảng): không cần seed.
- **Sửa nội dung trong `src/db/content`** (bài học, câu gốc, mã đề): cần seed lên Neon thì bản Vercel mới có nội dung mới.

Seed đọc `DATABASE_URL` từ `.env.local` (đang là DB local). Muốn seed lên Neon mà không sửa `.env.local`,
đặt biến ngay trên dòng lệnh (biến đặt sẵn được ưu tiên hơn file `.env.local`):

```bash
DATABASE_URL="<chuỗi Neon direct>" npm run db:seed
```

Cách tương đương cho push, nếu không muốn dùng `db:push:neon`:

```bash
DATABASE_URL="<chuỗi Neon direct>" npm run db:push
```

## 3. Đẩy code

```bash
git add -A
git status        # rà lại: không có file .env*, không có file lạ
git commit -m "mô tả thay đổi"
git push          # Vercel tự build
```

Trước khi push nên chạy thử: `npx tsc --noEmit && npm test && npm run build`.

## 4. Biến môi trường trên Vercel (Project → Settings → Environment Variables)

| Biến                             | Ghi chú                                                                                          |
| -------------------------------- | ------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`                   | Chuỗi Neon bản **pooled**                                                                        |
| `AI_KEY_ENCRYPTION_SECRET`       | **Phải trùng** giá trị đã dùng khi lưu khoá AI vào Neon; khác thì khoá đã lưu không giải mã được |
| `AI_PROVIDER`                    | Không được đặt `mock` hoặc `off` (sẽ tắt Tạo đề AI)                                              |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | Tuỳ chọn; người dùng có thể tự lưu khoá trong Cấu hình AI                                        |
| `OPENAI_API_KEY`                 | Khoá OpenAI **của bạn**, dùng chung cho người chưa có khoá riêng. Chỉ để ở Vercel, không commit  |
| `OPENAI_MODEL`                   | Model OpenAI dùng cho khoá chung (mặc định `gpt-4o-mini`; đổi nếu model đó không còn)            |
| `AI_SHARED_DAILY_LIMIT`          | Số lượt gọi AI tối đa mỗi người trong 24 giờ khi dùng khoá chung (mặc định 60)                   |

**Khoá AI dùng chung:** đặt `AI_PROVIDER=openai` để người dùng mới (chưa chọn nguồn nào) tự dùng khoá chung.
Người đã lưu khoá riêng thì vẫn dùng khoá riêng, không bị giới hạn. Một đề 40 câu tốn khoảng 6–10+ lượt gọi
nên hãy đặt `AI_SHARED_DAILY_LIMIT` theo đó. Đặt thêm hạn mức chi tiêu hàng tháng ở trang billing của OpenAI.

Đổi biến môi trường xong phải **Redeploy** thì mới có hiệu lực.

## 5. Lưu ý riêng của app này

- Tạo đề AI mất 1–3 phút mỗi lượt gọi. Hai trang `ai-generator` và `mock-exam/[sessionId]` đặt
  `export const maxDuration = 300` để Vercel không cắt hàm sớm. Giới hạn thực tế còn phụ thuộc gói Vercel;
  nếu đề AI hay bị ngắt giữa chừng thì kiểm tra giới hạn thời gian hàm của gói đang dùng.
- Job tạo đề mà hàm bị cắt thì tự được nhận lại sau 6 phút (`STALE_RUNNING_MS` trong `src/modules/ai/generator.ts`).
- Lỗi trên bản Vercel: Vercel → Deployments → chọn bản → **Functions/Logs**.

## 6. Các thay đổi schema đã có (để biết Neon cần gì nếu lệch)

| Thay đổi               | Ghi chú                                       |
| ---------------------- | --------------------------------------------- |
| `question.created_by`  | cột mới, rỗng được; câu cũ để trống           |
| bảng `question_report` | báo câu sai                                   |
| `user.guide_seen_at`   | cột mới, rỗng được; đánh dấu đã xem hướng dẫn |
| `ai_request_log.user_id` | cột mới, rỗng được + index; đếm lượt khoá AI chung |

Kiểm tra Neon đã có đủ chưa (chạy trong Neon SQL Editor):

```sql
SELECT table_name, column_name FROM information_schema.columns
 WHERE (table_name = 'user' AND column_name = 'guide_seen_at')
    OR (table_name = 'question' AND column_name = 'created_by');
SELECT count(*) FROM question_report;   -- lỗi "relation does not exist" nghĩa là chưa có bảng
```

<!--
npm run db:push        # 1. cập nhật DB local trước, thử trên máy bạn
npm run db:push:neon   # 2. cập nhật Neon, đọc SQL rồi chọn Yes
git add -A && git commit -m "mô tả" && git push   # 3. rồi mới đẩy code

 -->

## 7. Sao lưu và khôi phục Neon

Làm **trước mỗi thay đổi lớn trên Neon** (đổi schema phức tạp, copy dữ liệu từ local lên).

**Cách 1, có sẵn trong Neon (nhanh nhất):** Neon Console → **Branches** → tạo một branch từ branch chính.
Branch là bản sao tức thì của cả database; làm hỏng thì quay lại bằng **Restore** (khôi phục về một thời điểm
trước đó). Thời gian Neon giữ lịch sử để khôi phục phụ thuộc gói đang dùng, chưa kiểm chứng được con số,
xem ở trang **Restore** của dự án.

**Cách 2, tự lưu ra file bằng `pg_dump`** (máy đã có `pg_dump`). Lưu file **ngoài thư mục project**, vì trong
đó có cả khoá AI (đã mã hoá) và mật khẩu (đã băm) của người dùng:

```bash
mkdir -p ~/neon-backups
set -a; source .env.neon; set +a
pg_dump "$NEON_DATABASE_URL" -Fc -f ~/neon-backups/neon-$(date +%F).dump
ls -lh ~/neon-backups
```

Khôi phục: **đừng chạy đè lên bản đang chạy thật**. Tạo một branch hoặc database trống mới trên Neon, rồi:

```bash
pg_restore -d "<chuỗi kết nối của nơi khôi phục>" --no-owner --clean --if-exists ~/neon-backups/neon-YYYY-MM-DD.dump
```

Kiểm tra dữ liệu ở đó ổn rồi mới đổi `DATABASE_URL` trên Vercel sang nơi đó, hoặc chép lại phần cần thiết.

## 8. Đẩy dữ liệu từ local lên Neon

- `db:push` chỉ đẩy **cấu trúc** (cột, bảng), **không** đẩy dữ liệu.
- **Không dump DB local rồi restore đè lên Neon**: sẽ xoá dữ liệu thật đang có trên Neon.
- Lịch sử trả lời, phiên luyện, phiên thi và job tạo đề trong DB local thuộc về tài khoản local, không nên đẩy lên.
- Phần có thể có ích là câu AI trong kho (bảng `question` và `stimulus`). Nếu muốn copy: chỉ **thêm mới**,
  bỏ qua câu trùng (`ON CONFLICT DO NOTHING`), để `created_by` rỗng (id tài khoản local không có trên Neon),
  và nên bỏ các câu viết bằng tiếng Việt. Luôn sao lưu Neon (mục 7) trước khi làm.
