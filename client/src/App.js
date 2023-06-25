import React from "react";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
// import {Button} from '@mui/material';
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import EasySpeech from 'easy-speech'
import {Button} from '@mui/material';

const showdown = require('showdown');

// const StyledButton = styled(Button)`
//   margin-left:4px;
//   margin-right:2px;
// `

export default function App() {

  function convertMarkdownToHTML(markdown) {
    const converter = new showdown.Converter();
    markdown = markdown.replace(/\[[^\]]+\]/g, '');
    return converter.makeHtml(markdown);
  }
  
  // declaring variables for speech recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Handling the browser which doesn't support speech recognition
  if(!browserSupportsSpeechRecognition) {
    return <span>Your Browser doesn't support speech recognition</span>
  }
  
  async function handleSubmit() {
    // handing empty input
    if(transcript.length === 0) {
      alert("Please click on Start button and start recording your query");
      return;
    }
    try {
      document.getElementById('submitButton').disabled = true; // Disabling Generate Response Button
      document.getElementById('generateResponse').innerHTML = "Loading ...";
      const response = await axios.post("http://localhost:8008/FetchTranscript", { transcript }); // waiting to get response from backend
      document.getElementById('submitButton').disabled = false; // Enabling Generate Response Button
      
      // Handle the response from the backend
      var answer = response.data['message']['answer'];
      answer = convertMarkdownToHTML(answer); // Response from backend is in markdown format, converting it to HTML format
      document.getElementById("generateResponse").innerHTML = answer; // writing the response to frontend
      answer = answer.replace(/<[^>]*>/g, ''); // replaing response html tags with nothing
      
      // Response To Audio
      EasySpeech.detect();
      EasySpeech.init()
        .then(()=> {EasySpeech.speak({text:answer})})

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="m-4">
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button className="btn btn-secondary ms-2" onClick={SpeechRecognition.startListening}>Start</button>
      <button className="btn btn-secondary ms-2" onClick={resetTranscript}>Reset</button> 
      <p>{transcript}</p>
      <Button variant="contained" id="submitButton" className="btn btn-primary ms-2" onClick={handleSubmit}>Generate Response</Button>
      <p className="mt-2 font-monospace" style={{fontSize:22}} id="generateResponse"></p>
    </div>
  )
}