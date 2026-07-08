export default function Controls({
  startReading,
  pauseReading,
  resumeReading,
  restartReading,
  skipBackward,
  skipForward,
  playing,
  words,
  isFinished,
}) {
  return (
    <div className="controls">
      {words.length === 0 && (
        <button className="start-btn" onClick={startReading}>
          ▶
        </button>
      )}
      {words.length > 0 && (
        <>
          <button className="skip-btn" onClick={skipBackward}>
            -10
          </button>

          {playing ? (
            <button className="pause-btn" onClick={pauseReading}>
              ⏸
            </button>
          ) : isFinished ? (
            <button className="restart-btn" onClick={restartReading}>
              ↺
            </button>
          ) : (
            <button className="resume-btn" onClick={resumeReading}>
              ▶
            </button>
          )}

          <button className="skip-btn" onClick={skipForward}>
            +10
          </button>
        </>
      )}
    </div>
  );
}
