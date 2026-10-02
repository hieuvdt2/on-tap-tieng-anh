import { StartPracticeButton } from "@/components/start-practice-button";
import { TopicSelect } from "@/components/topic-select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudentId } from "@/lib/student";
import { topicLabel } from "@/lib/topic-names";
import { getTopicProgress } from "@/modules/learning/profile";
import { startPractice } from "@/modules/practice/actions";

const errors: Record<string, string> = {
  empty: "Chưa có câu cho lựa chọn này.",
  invalid: "Chưa chọn được chủ đề. Chọn lại trong danh sách.",
};

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const query = await searchParams;
  const topics = await getTopicProgress(await getStudentId());
  const message = query.error ? errors[query.error] : undefined;

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="font-serif text-4xl font-medium">Luyện câu</h1>
        <p className="max-w-2xl text-muted">
          Mỗi bài tạo thêm câu mới và lưu vào kho. Lần sau những câu đó được trộn lại với câu mới và câu có sẵn. Câu trong một bài không đổi khi tải lại.
        </p>
      </div>
      {message ? <p className="text-sm text-danger">{message}</p> : null}
      <div className="grid gap-3 lg:grid-cols-3">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Theo chủ đề</CardTitle>
            <CardDescription>Tối đa 10 câu của một chủ đề.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <form action={startPractice} className="grid min-w-0 gap-3">
              <input type="hidden" name="mode" value="topic" />
              <label className="grid min-w-0 gap-1 text-sm">
                Chủ đề
                <TopicSelect
                  topics={topics.map((topic) => ({ slug: topic.slug, label: topicLabel(topic.name) }))}
                />
              </label>
              <StartPracticeButton className="w-full">Bắt đầu</StartPracticeButton>
            </form>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Điểm yếu</CardTitle>
            <CardDescription>
              20 câu, khoảng 12 câu chủ đề yếu, 5 câu đang học và 3 câu đã vững. Câu AI đạt kiểm tra được lưu để dùng lại khi hết token. Nếu chưa luyện chủ đề nào, lấy chủ đề ít làm nhất.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <form action={startPractice}>
              <input type="hidden" name="mode" value="weakness" />
              <StartPracticeButton>Luyện điểm yếu</StartPracticeButton>
            </form>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Nhanh</CardTitle>
            <CardDescription>5 câu, trộn câu mới với câu AI đã lưu và câu có sẵn.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <form action={startPractice}>
              <input type="hidden" name="mode" value="quick" />
              <StartPracticeButton variant="outline">5 câu nhanh</StartPracticeButton>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
