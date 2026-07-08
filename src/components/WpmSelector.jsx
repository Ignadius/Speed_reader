export default function WpmSelector({ wpm, increaseWpm, decreaseWpm }) {
  return (
    <div className="wpm-selector">
      <button onClick={decreaseWpm} disabled={Number(wpm) <= 50}>
        −
      </button>

      <span>{wpm} WPM</span>

      <button onClick={increaseWpm} disabled={Number(wpm) >= 1000}>
        +
      </button>
    </div>
  );
}
