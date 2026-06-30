export default function Controls({
  startReading,
  pauseReading,
  resumeReading,
  restartReading,
  resetReading,
  skipBackward,
  skipForward,
  playing,
  words,
  text,
  toggleFullscreen,
}) {
  const textAvailable = text.trim().length > 0;
  return (
    <div className="controls">
      <button className="fullscreen" onClick={toggleFullscreen}>
        ⛶ Fullscreen
      </button>
      {words.length === 0 && (
        <button className="start-btn" onClick={startReading}>
          ▶ Start Reading
        </button>
      )}
      {textAvailable && (
        <button className="reset-btn" onClick={resetReading}>
          New Text
        </button>
      )}
      {words.length > 0 && (
        <>
          <button className="skip-btn" onClick={skipBackward}>
            -10
          </button>

          {playing ? (
            <button className="pause-btn" onClick={pauseReading}>
              ⏸ Pause
            </button>
          ) : (
            <button className="resume-btn" onClick={resumeReading}>
              ▶ Resume
            </button>
          )}

          <button className="skip-btn" onClick={skipForward}>
            +10
          </button>

          <button className="restart-btn" onClick={restartReading}>
            ↺ Restart
          </button>
        </>
      )}
    </div>
  );
}
