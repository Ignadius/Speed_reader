import "./App.css";

// Root component of the application.
//
// Responsibilities:
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
import ProgressBar from "./components/ProgressBar";
import PdfUpload from "./components/PdfUpload";
import TextPreview from "./components/TextPreview";

import { useState, useEffect } from "react";

export default function App() {
  // ========================================
  // STATE
  // ========================================

  // Full text currently loaded into the application.
  // Can come from manual input or PDF extraction.
  const [text, setText] = useState("");

  // Stores PDF page information.
  //
  // Example:
  // [
  //   { pageNumber: 1, text: "..." },
  //   { pageNumber: 2, text: "..." }
  // ]
  //
  // Keeping pages separate allows future features such as:
  // - Current page tracking
  // - Jump to page
  // - Read page ranges
  const [pdfPages, setPdfPages] = useState([]);

  // Array of words used by the reader engine.
  //
  // Example:
  // ["Hello", "world", "React"]
  const [words, setWords] = useState([]);

  // Current reading position.
  //
  // Example:
  // wordIndex = 4
  // means the fifth word is currently displayed.
  const [wordIndex, setWordIndex] = useState(0);

  // Reading speed in Words Per Minute.
  //
  // Stored as a string because it comes from
  // a controlled input element.
  const [wpm, setWpm] = useState("250");

  // Controls whether the reader is currently running.
  //
  // true  -> reading
  // false -> paused/stopped
  const [playing, setPlaying] = useState(false);

  // Name of the uploaded PDF file.
  const [documentName, setDocumentName] = useState("");

  //Full screen mode daa
  const [fullscreenMode, setFullscreenMode] = useState(false);

  const toggleFullscreen = () => {
    setFullscreenMode((prev) => !prev);
  };

  const [isFinished, setIsFinished] = useState(false);

  // DERIVED VALUES

  // Current word displayed in the reader.
  //
  // Falls back to an empty string if no word exists.
  const currentWord = words[wordIndex] || "";

  // Reading progress percentage.
  //
  // Example:
  // wordIndex = 4
  // words.length = 10
  // progress = 50
  const progress =
    words.length > 0 ? ((wordIndex + 1) / words.length) * 100 : 0;

  // Total PDF pages.
  //
  // Derived from pdfPages.
  // No separate state is needed.
  const totalPages = pdfPages.length;

  // Converts text into an array of words
  // for the clickable preview component.
  //
  // Example:
  // "Hello React world"
  // becomes:
  // ["Hello", "React", "world"]
  const previewWords = text.trim() ? text.trim().split(/\s+/) : [];

  // ========================================
  // READER CONTROLS
  // ========================================

  // Start a new reading session.
  const startReading = () => {
    // Prevent reading empty input.
    if (!text.trim()) return;

    // Convert text into words.
    const wordArray = text.trim().split(/\s+/);

    // Store words used by the reading engine.
    setWords(wordArray);

    // If the user selected a word in the preview,
    // start there.
    if (wordIndex >= wordArray.length) {
      setWordIndex(0);
    }

    // New reading session.
    setIsFinished(false);

    // Start playback.
    setPlaying(true);
  };

  // Pause reading.
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

    // Convert WPM into milliseconds.
    //
    // Example:
    // 300 WPM
    // 60000 / 300 = 200ms
    //End of reading logic
    const timer = setTimeout(
      () => {
        // Advance to the next word.
        if (wordIndex < words.length - 1) {
          setWordIndex((prevIndex) => prevIndex + 1);
        } else {
          // End of text reached.
          setPlaying(false);
          setIsFinished(true);
        }
      },
      60000 / Number(wpm),
    );
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
      />
    );
  }
  return (
    <div className="app">
      {/* Darkens the screen during reading */}
      {playing && <div className="reading-overlay"></div>}

      {/* Application title */}
      <h1>Speed Reader</h1>

      {/* Uploaded document name */}
      {documentName && (
        <div className="document-name">
          <strong>Currently Reading:</strong> 📄 {documentName}
        </div>
      )}

      {/* PDF page count */}
      {totalPages > 0 && <p className="pdf-info">📑 Pages: {totalPages}</p>}

      {/* Text input or preview */}
      {text.trim() ? (
        <TextPreview
          words={previewWords}
          wordIndex={wordIndex}
          setWordIndex={setWordIndex}
        />
      ) : (
        <TextInput text={text} setText={setText} />
      )}

      {/* PDF upload */}
      <PdfUpload
        onTextExtracted={setText}
        setPdfPages={setPdfPages}
        setDocumentName={setDocumentName}
      />

      {/* Reading speed selector */}
      <WpmSelector wpm={wpm} setWpm={setWpm} />

      {/* Reader controls */}
      <Controls
        startReading={startReading}
        pauseReading={pauseReading}
        resumeReading={resumeReading}
        restartReading={restartReading}
        resetReading={resetReading}
        skipBackward={skipBackward}
        skipForward={skipForward}
        playing={playing}
        words={words}
        text={text}
        toggleFullscreen={toggleFullscreen}
      />

      {/* Current word */}
      <Reader currentWord={currentWord} />

      {/* Progress bar */}
      <ProgressBar progress={progress} />

      {isFinished && <p>🎉 Reading complete!</p>}

      {/* Word counter */}
      <p>
        Words:{" "}
        {words.length > 0 ? `${wordIndex + 1} / ${words.length}` : "0 / 0"}
      </p>
    </div>
  );
}
