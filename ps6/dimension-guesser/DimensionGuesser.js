import './DimensionGuesser.css';
import React from "react";

const MIN = 20;
const MAX_WIDTH  = Math.max(100, (1 * window.innerWidth) / 2 - 20);
const MAX_HEIGHT = Math.max(100, (1 * window.innerHeight) / 2 - 50);

function App() {
  const [width, setWidth]   = React.useState(getRandomIntegerBetween(MIN, MAX_WIDTH));
  const [height, setHeight] = React.useState(getRandomIntegerBetween(MIN, MAX_HEIGHT));

  const [guessWidth, setGuessWidth]   = React.useState(MIN);
  const [guessHeight, setGuessHeight]   = React.useState(MIN);

  const [cheatingMode, setCheatingMode] = React.useState(false);
  const [showingFeedback, setShowingFeedback] = React.useState(false);

  const onChangeWidth = React.useCallback((e) => {
    const value = parseInt(e.target.value);
    setGuessWidth(value);
  }, []);
  const onChangeHeight = React.useCallback((e) => {
    const value = parseInt(e.target.value);
    setGuessHeight(value);
  }, []);

  const doGuess = React.useCallback(() => {
    setShowingFeedback(true);
  }, []);

  const doAdvance = React.useCallback(() => {
    setWidth(getRandomIntegerBetween(MIN, MAX_WIDTH));
    setHeight(getRandomIntegerBetween(MIN, MAX_HEIGHT));
    setGuessWidth(MIN);
    setGuessHeight(MIN);
    setShowingFeedback(false);
  }, []);

  const onKeyDown = React.useCallback((e) => {
    if (e.key === "Enter") {
      doGuess();
    }
  }, [doGuess]);

  const onChangeCheatingMode = React.useCallback((e) => {
    setCheatingMode(e.target.checked);
  }, []);

  const showUserDimensions = cheatingMode || showingFeedback;

  return (
    <div className="App">
      <label id="cheating-mode">Cheating mode <input type="checkbox" value={cheatingMode} onChange={onChangeCheatingMode} /></label>
      <p>Guess the size of the grey rectangle below (in pixels)</p>

      {!showingFeedback && <label>Width:  <input type="number" min={MIN} max={MAX_WIDTH}  value={guessWidth}  onChange={onChangeWidth}  onKeyDown={onKeyDown} /></label> } &nbsp;
      {!showingFeedback && <label>Height: <input type="number" min={MIN} max={MAX_HEIGHT} value={guessHeight} onChange={onChangeHeight} onKeyDown={onKeyDown} /></label> }

      {showingFeedback && <p>Your guess: {guessWidth} &times; {guessHeight}. Actual: <strong>{width} &times; {height}</strong></p> }

      {!showingFeedback && <button onClick={doGuess}>Guess</button> }
      {showingFeedback && <button onClick={doAdvance}>Next</button>}

      <div id="guessing-rect" style={{width: `${width}px`, height: `${height}px`}} />
      {showUserDimensions && <div id="answer-rect"   style={{width: `${guessWidth}px`, height: `${guessHeight}px`, position: "relative", top: `${-height-5}px`}} /> }
    </div>
  );
}

export default App;

function getRandomIntegerBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}