export default function Reader({ currentWord }) {
  //This is a presentational component, it receivas currentWord and displays it.
  //it doesnt know total number of words, or the curren position in the document, nor is playing or finished.
  function getORPIndex(word) {
    const length = word.length;

    if (length <= 1) return 0;
    if (length <= 5) return 1;
    if (length <= 9) return 2;
    if (length <= 13) return 3;

    return 4;
  }

  const getHighlightedWord = (word) => {
    if (!word) return "Ready?";

    const orpIndex = getORPIndex(word);

    return (
      <div className="spritz-word">
        <span className="left">{word.slice(0, orpIndex)}</span>

        <span className="highlight">{word[orpIndex]}</span>

        <span className="right">{word.slice(orpIndex + 1)}</span>
      </div>
    );
  }; //Research behind Spritz suggests readers naturally recognize words slightly left of center.

  return <div className="reader-word">{getHighlightedWord(currentWord)}</div>;
}
//I separated the logic responsible for finding and highlighting the center character from the JSX rendering logic. 
//This makes the component easier to read, test, and maintain
//getHighlightedWord() 
