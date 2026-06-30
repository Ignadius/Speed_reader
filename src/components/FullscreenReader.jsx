import Reader from "./Reader";
import ProgressBar from "./ProgressBar";
import "../App.css";

export default function FullscreenReader({
  currentWord,
  progress,
  currentWordNumber,
  totalWords,
  isFinished,
  toggleFullscreen,
}) {
  return (
    <div className="fullscreen-reader">
      <button className="exit-fullscreen-tbn" onClick={toggleFullscreen}>
        ✕ Exit Fullscreen
      </button>

      <Reader currentWord={currentWord} />

      <ProgressBar progress={progress} />

      {isFinished && <p>🎉 Reading complete!</p>}

      <p>
        Words: {currentWordNumber} / {totalWords}
      </p>
    </div>
  );
}
