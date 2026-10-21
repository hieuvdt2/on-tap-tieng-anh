// Nhiều câu ngữ pháp/từ vựng có dạng điền chỗ trống ("___"); sau khi trả lời, ghép đáp án đúng vào
// chỗ trống để học sinh thấy câu hoàn chỉnh thay vì chỉ thấy đề bài còn trống. Trả về từng đoạn kèm
// cờ isAnswer để nơi hiển thị có thể tô đậm/gạch chân đúng phần vừa điền.
// Câu AI tự sinh đôi khi dùng chuỗi gạch dưới dài hơn 3 ký tự, nên khớp cả cụm liền nhau (>=3) chứ
// không chỉ đúng 3 ký tự, để không sót gạch dưới thừa sau khi thay.
const BLANK = /_{3,}/g;
// Một số câu có nhiều hơn một chỗ trống; đáp án khi đó liệt kê từng phần cách nhau bằng dấu phẩy
// hoặc dấu gạch chéo (ví dụ "Does, give" hoặc "a / The"), đúng theo số chỗ trống trong đề.
const ANSWER_PARTS = /\s*[,/]\s*/;

export type FilledSegment = { text: string; isAnswer: boolean };

export function fillBlank(stem: string, answerText: string): FilledSegment[] | null {
  const blanks = stem.match(BLANK);
  if (!blanks) return null;

  // Nhiều chỗ trống: chỉ điền được khi tách đáp án ra đúng bằng số chỗ trống, không thì để trống
  // (thà không hiện câu hoàn chỉnh còn hơn hiện một câu ghép sai).
  const answerParts = blanks.length === 1 ? [answerText] : answerText.split(ANSWER_PARTS);
  if (answerParts.length !== blanks.length) return null;

  const textParts = stem.split(BLANK);
  const segments: FilledSegment[] = [];
  textParts.forEach((text, index) => {
    if (text) segments.push({ text, isAnswer: false });
    if (index < answerParts.length) segments.push({ text: answerParts[index]!, isAnswer: true });
  });
  return segments;
}
