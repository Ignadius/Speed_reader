export default function TextPreview({ words, wordIndex, setWordIndex }) {
  return (
    <div className="text-preview">
      {words.map((word, index) => (
        <span
          key={index}
          className={index === wordIndex ? "selected-word" : "preview-word"}
          onClick={() => {
            setWordIndex(index);
          }}
        >
          {word}{" "}
        </span>
      ))}
    </div>
  );
}
