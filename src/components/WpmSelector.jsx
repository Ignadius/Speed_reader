export default function WpmSelector({ wpm, setWpm }) {
  const handleWpmChange = (e) => {
    setWpm(e.target.value);
  };

  return (
    <div>
      <label htmlFor="wpm-input">WPM:</label>

      <input
        id="wpm-input"
        type="number"
        value={wpm}
        min="50"
        max="1000"
        onChange={handleWpmChange}
      />
    </div>
  );
}
