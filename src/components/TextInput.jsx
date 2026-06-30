export default function TextInput({ text, setText }) {
  return (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      rows="10"
      cols="50"
      placeholder="Paste text here..."
    />
  );
}
