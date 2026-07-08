import "./App.css";

// - Stores all shared application state
// - Controls the reading engine
// - Coordinates PDF uploads
// - Calculates derived values such as progress and page count
// - Passes state and handlers to child components

import TextInput from "./components/TextInput";
import Reader from "./components/Reader";
import Controls from "./components/Controls";
import FullscreenReader from "./components/FullscreenReader";
import WpmSelector from "./components/WpmSelector";
import Progress from "./components/Progress";
import PdfUpload from "./components/PdfUpload";
import TextPreview from "./components/TextPreview";

import { useState, useEffect } from "react";

export default function App() {
  // STATE
  // Full text currently loaded into the application.
  // Can come from manual input or PDF extraction.
  const [text, setText] = useState("");

  // Stores PDF page information.
  const [pdfPages, setPdfPages] = useState([]);

  // Array of words used by the reader engine.
  const [words, setWords] = useState([]);

  // Current reading position.
  const [wordIndex, setWordIndex] = useState(0);

  // Reading speed in Words Per Minute.
  //
  // Stored as a string because it comes from
  // a controlled input element.
  const [wpm, setWpm] = useState(250);

  // Controls whether the reader is currently running.
  const [playing, setPlaying] = useState(false);

  // Name of the uploaded PDF file.
  const [documentName, setDocumentName] = useState("");

  //Full screen mode daa
  const [fullscreenMode, setFullscreenMode] = useState(false);

  const toggleFullscreen = () => {
    setFullscreenMode((prev) => !prev);
  };

  const [isFinished, setIsFinished] = useState(false);

  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  useEffect(() => {
    document.body.classList.toggle("dark-theme", isDark);
  }, [isDark]);

  // DERIVED VALUES

  // Current word displayed in the reader.
  //
  // Falls back to an empty string if no word exists.
  const currentWord = words[wordIndex] || "";

  // Reading progress percentage.
  //It doesnt own any data, calculate the reading progress
  const progress =
    words.length > 0 ? ((wordIndex + 1) / words.length) * 100 : 0;

  // Total PDF pages.
  //
  // Derived from pdfPages.
  // No separate state is needed.
  const totalPages = pdfPages.length;

  // Converts text into an array of words
  // for the clickable preview component.
  const previewWords = text.trim() ? text.trim().split(/\s+/) : [];

  // ========================================
  // READER CONTROLS
  // ========================================

  const startReading = () => {
    if (!text.trim()) return;

    const wordArray = text.trim().split(/\s+/);

    setWords(wordArray);
    setWordIndex(0);

    // New reading session.
    setIsFinished(false);
    // Start playback.
    setPlaying(true);
  };

  const pauseReading = () => {
    setPlaying(false);
  };

  // Resume reading if words exist.
  const resumeReading = () => {
    if (words.length > 0) {
      setPlaying(true);
    }
  };

  // Restart reading from the beginning.
  const restartReading = () => {
    if (words.length === 0) return;

    setWordIndex(0);
    setIsFinished(false);
    setPlaying(true);
  };

  // Completely reset the reader.
  //
  // Used when loading a new text or PDF.
  const resetReading = () => {
    setPlaying(false);
    setText("");
    setWords([]);
    setPdfPages([]);
    setWordIndex(0);
    setDocumentName("");
    setIsFinished(false);
  };

  // READING ENGINE
  useEffect(() => {
    // Stop if paused.
    if (!playing) return;

    // Stop if no words exist.
    if (words.length === 0) return;

    const timer = setTimeout(() => {
      // Advance to the next word.
      if (wordIndex < words.length - 1) {
        setWordIndex((prevIndex) => prevIndex + 1);
      } else {
        // End of text reached.
        setPlaying(false);
        setIsFinished(true);
      }
    }, 60000 / wpm);
    // Cleanup previous timer.
    return () => clearTimeout(timer);
  }, [wordIndex, words, wpm, playing]);

  // Jump backward 10 words.
  const skipBackward = () => {
    setWordIndex((prev) => Math.max(prev - 10, 0));
  };

  // Jump forward 10 words.
  const skipForward = () => {
    setWordIndex((prev) => Math.min(prev + 10, words.length - 1));
  };

  const increaseWpm = () => {
    setWpm((prev) => String(Number(prev) + 25));
  };

  const decreaseWpm = () => {
    setWpm((prev) => String(Math.max(50, Number(prev) - 25)));
  };
  //RENDER
  if (fullscreenMode) {
    return (
      <FullscreenReader
        currentWord={currentWord}
        progress={progress}
        currentWordNumber={wordIndex + 1}
        totalWords={words.length}
        isFinished={isFinished}
        toggleFullscreen={toggleFullscreen}
        playing={playing}
        pauseReading={pauseReading}
        resumeReading={resumeReading}
        restartReading={restartReading}
      />
    );
  }
  return (
    <div className={`app ${playing ? "reading-mode" : ""}`}>
      <div className="top-actions">
        <label className="theme-switch">
          <input type="checkbox" checked={isDark} onChange={toggleDarkMode} />

          <span className="slider">
            <span className="theme-icon">☀️</span>
            <span className="theme-icon">🌙</span>
          </span>
        </label>

        <button
          className="fullscreen-btn"
          onClick={toggleFullscreen}
          title="Enter Fullscreen"
        >
          ⛶
        </button>
      </div>

      <h1 className="app-title">Speed Reader</h1>
      {documentName && (
        <div className="document-name">
          <strong>Currently Reading:</strong> 📄 {documentName}
        </div>
      )}
      {totalPages > 0 && <p className="pdf-info">📑 Pages: {totalPages}</p>}
      {text.trim() ? (
        <TextPreview
          words={previewWords}
          wordIndex={wordIndex}
          setWordIndex={setWordIndex}
        />
      ) : (
        <TextInput text={text} setText={setText} />
      )}

      <div className="reader-container">
        <Reader currentWord={currentWord} />

        <div className="document-actions">
          <PdfUpload
            onTextExtracted={setText}
            setPdfPages={setPdfPages}
            setDocumentName={setDocumentName}
          />
          {text.trim() && (
            <button className="document-btn" onClick={resetReading}>
              Clear
            </button>
          )}
        </div>
      </div>

      {isFinished && <p>🎉 Reading complete!</p>}

      <Progress progress={progress} />

      <div className="selector">
        <WpmSelector
          wpm={wpm}
          increaseWpm={increaseWpm}
          decreaseWpm={decreaseWpm}
        />
      </div>

      <Controls
        startReading={startReading}
        pauseReading={pauseReading}
        resumeReading={resumeReading}
        restartReading={restartReading}
        skipBackward={skipBackward}
        skipForward={skipForward}
        playing={playing}
        words={words}
        isFinished={isFinished}
      />
    </div>
  );
}
