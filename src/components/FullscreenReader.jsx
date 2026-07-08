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
  playing,
  pauseReading,
  resumeReading,
  restartReading,
}) {
  return (
    <div className="fullscreen-reader">
      <button className="exit-fullscreen-tbn" onClick={toggleFullscreen}>
        ✕ Exit Fullscreen
      </button>

      <Reader currentWord={currentWord} />

      <ProgressBar progress={progress} />

      <div className="fullscreen-controls">
        {isFinished ? (
          <button className="restart-btn" onClick={restartReading}>
            ↺ Restart
          </button>
        ) : playing ? (
          <button className="pause-btn" onClick={pauseReading}>
            ⏸ Pause
          </button>
        ) : (
          <button className="resume-btn" onClick={resumeReading}>
            ▶ Resume
          </button>
        )}
      </div>

      {isFinished && <p>🎉 Reading complete!</p>}
      <p>
        Words: {currentWordNumber} / {totalWords}
      </p>
    </div>
  );
}
