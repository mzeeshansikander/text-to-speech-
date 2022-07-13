import { useEffect, useState } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import "./App.css";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();
console.log({ mic });
mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";

function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState(null);
  const [savedNotes, setSavedNotes] = useState([]);

  //--------------------------------------------------
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    googleApiKey: "AIzaSyAEKq5NlUKymt8n4zGS3LJtwMZLpw9MwQ8",
    useLegacyResults: false,
  });

  //--------------------------------------------------
  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log("continue..");
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log("Stopped Mic on Click");
      };
    }
    mic.onstart = () => {
      console.log("Mics on");
    };

    mic.onresult = (event) => {
      console.log({ event });
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      console.log({ transcript });
      setNote(transcript);
      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, note]);
    setNote("");
  };

  useEffect(() => {
    handleListen();
  }, [isListening]);

  return (
    <>
      <h1>Voice Notes Created Using Window Object</h1>
      <div className="container">
        <div className="box">
          <h2>Current Note</h2>
          {isListening ? <span>🛑🎙️</span> : <span>🎙️</span>}
          <button onClick={handleSaveNote} disabled={!note}>
            Save Note
          </button>
          <button onClick={() => setIsListening((prevState) => !prevState)}>
            Start/Stop
          </button>
          <p>{note}</p>
        </div>
        <div className="box">
          <h2>Notes</h2>
          {savedNotes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>
      </div>
      <h1>Voice Notes Created Using React-text-to-speech ( Google Api )</h1>
      <div>
        <h1>Recording: {isRecording.toString()}</h1>
        <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <ul>
          {results.map((result) => (
            <li key={result.timestamp}>{result.transcript}</li>
          ))}
          {interimResult && <li>{interimResult}</li>}
        </ul>
      </div>
    </>
  );
}

export default App;
