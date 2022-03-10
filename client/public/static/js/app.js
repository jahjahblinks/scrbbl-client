//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream;                      //stream from getUserMedia()
var rec;                            //Recorder.js object
var input;                          //MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

// connects to the audio button and header in Room.vue
/*
var playAndPauseButton = document.getElementById("playAndPause");
var headerAudio = document.getElementById("headerAudio");
var messageSTT = document.getElementById("message_typespace");

//add events to those 2 buttons
playAndPauseButton.addEventListener("click", playAndPause);

var listening = false;

function playAndPause() {
    // get output div reference
//     var output = document.getElementById("output"); //headerAudio
    // get action element reference
//     var action = document.getElementById("action"); //playAndPauseButton
    // new speech recognition object
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var recognition = new SpeechRecognition();

    // This runs when the speech recognition service starts
    recognition.onstart = function() {
        console.log("recordButton clicked");
        console.log("Begin Speech Recognition");
        //prevent button push until after speech recognition is completed
        playAndPauseButton.disabled = true;
        playAndPauseButton.innerText = 'Wait';
        playAndPauseButton.className = 'button is-danger is-borderless';
        headerAudio.innerText = '🔊';
    };

    recognition.onspeechend = function() {
        console.log("Speech Recognition ended");
        playAndPauseButton.disabled = false;
        playAndPauseButton.innerText = 'Start';
        playAndPauseButton.className = 'button is-primary is-borderless';
        headerAudio.innerText = '🔈';
        recognition.stop();
    }

    // This runs when the speech recognition service returns result
    recognition.onresult = function(event) {
        //transcript stored here
        var transcript = event.results[0][0].transcript;
        var confidence = event.results[0][0].confidence;
        console.log("Text: " + transcript);
        console.log("Confidence: " + confidence);
        messageSTT.message = transcript;
        messageSTT.value = transcript;
//         message.setAttribute("value", transcript)
//         messageSTT.dispatchEvent(new Event('message_typespace'));
        //output confidence
        //output.innerHTML = "<b>Text:</b> " + transcript + "<br/> <b>Confidence:</b> " + confidence*100+"%";
        //output.classList.remove("hide");
    };

     // start recognition
     recognition.start(); 
}
*/

function startRecording() {
    console.log("recordButton clicked");
    listening = true;
    playAndPauseButton.innerText = 'Stop';
    playAndPauseButton.className = 'button is-danger is-borderless';
    headerAudio.innerText = '🔊';

    /*
        Simple constraints object, for more advanced audio features see
        https://addpipe.com/blog/audio-constraints-getusermedia/
    */

    var constraints = { audio: true, video:false }


    /*
        We're using the standard promise based getUserMedia() 
        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    */

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        /*
            create an audio context after getUserMedia is called
            sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
            the sampleRate defaults to the one set in your OS for your playback device

        */
        audioContext = new AudioContext();

        //update the format 
        //document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"
        /*  assign to gumStream for later use  */
        gumStream = stream;

        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);

        /* 
            Create the Recorder object and configure to record mono sound (1 channel)
            Recording 2 channels  will double the file size
        */
        rec = new Recorder(input,{numChannels:1})

        //start the recording process
        rec.record()

        console.log("Recording started");

    }).catch(function(err) {
        //enable the record button if getUserMedia() fails
        console.log(err)
        listening = false;
        playAndPauseButton.innerText = 'Start';
        playAndPauseButton.className = 'button is-primary is-borderless';
        headerAudio.innerText = '🔈';
    });
}

function stopRecording() {
    console.log("stopButton clicked");
    listening = false;
    playAndPauseButton.innerText = 'Start';
    playAndPauseButton.className = 'button is-primary is-borderless';
    headerAudio.innerText = '🔈';


    //tell the recorder to stop the recording
    rec.stop();

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink);
}

function playAndPauseOG() {
  if (!listening) {
    console.log("Recording started");
    startRecording();
  } else {
    console.log("Recording stopped");
    stopRecording();
  }
  console.log("Success");
}

function createDownloadLink(blob) {


    //name of .wav file to use during upload and download (without extention)
    var filename = new Date().toISOString();

    console.log(document.getElementById('fname').value);

    var moo=new XMLHttpRequest();
    var d=new FormData();
    d.append("audio_data",blob, filename);
    d.append("name", document.getElementById('fname').value);
    moo.open("POST","/audio",true);
    moo.send(d);

}
