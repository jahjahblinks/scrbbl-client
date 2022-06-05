<!--metaInfo: {
title: ‘SITE TITLE’,
script: [
{ src: ‘/assets/js/bootstrap.js’, body: true },
{ src: ‘/assets/js/moment.js’, body: true },

]
}-->

<!--this file is a copy of room.vue-->

<template>
  <div class="section-xs container">
    <div class="columns is-multiline">
      <div class="column is-full">
        <h1 class="title is-2 has-text-centered has-text-primary" id="Title" v-if="room">
          {{ room.name.toUpperCase() }}
        </h1>
        <h2 v-if="room && time >= 10" class="subtitle is-4 has-text-centered">
          {{ parseInt(time / 60) }}:{{ time % 60 <= 9 ? "0" + (time % 60) : time % 60 }}
        </h2>
        <h2 v-else-if="room && time > 0" class="subtitle is-4 has-text-centered has-text-danger has-text-weight-bold">
          {{ parseInt(time / 60) }}:{{ time % 60 <= 9 ? "0" + (time % 60) : time % 60 }}
        </h2>
        <h2 v-if="room && time > 0" class="subtitle is-4 has-text-centered has-text-weight-bold hint">
          <span class="hint-word">{{ wordHint.toUpperCase() }}</span>
        </h2>
      </div>

      <div class="column is-3">
        <div class="card">
          <!--
          <header class="card-header">
            <p class="card-header-title"> Leaderboard 🏆 <span v-if="room && wordHint"> &nbsp; Round {{numRounds}} of {{maxRounds}}</span></p>
          </header>
          <div class="card-content">
            <ul class="content playerlist" v-if="showUsers">
              <li
                v-for="user in sortedUsers"
                :key="user.id"
                v-if="painter == user.id"
              >
                <strong>{{ user.name }} ✏️</strong> :
                <span class="has-text-weight-bold">{{ user.points }}</span>
              </li>
              <li :key="user.id" v-else>
                {{ user.name }} :
                <span class="has-text-weight-bold">{{ user.points }}</span>
              </li>
            </ul>
          </div> -->
          <footer class="card-footer">
            <router-link
              to="/"
              class="card-footer-item has-text-danger is-hoverable"
              >Leave Room</router-link
            >
          </footer>
        </div>

        <!-- <div class="card card--painter">
          <header class="card-header">
            <p class="card-header-title">⚡</p>
          </header>
          <div class="card-content">
            <ul class="content playerlist" v-if="iDraw">
              <li v-if="!artistUps.length" class="has-text-danger">
                No artist power-ups available.
              </li>
              <li v-else v-for="power in artistUps">
                {{ power }}
              </li>
            </ul>
            <ul class="content playerlist" v-else>
              <li v-if="!guesserUps.length" class="has-text-danger">
                No guesser power-ups available.
              </li>
              <li v-else v-for="power in guesserUps">
                {{ power }}
              </li>
            </ul>
          </div>
        </div> -->
        <div
          class="card card--painter"
          v-if="true"
        > 
    
          <header class="card-header">
            <div class="card-header-title">
              <p>Tilt IMU to select word <br>
                Forward Tilt: Select Word 1 <br>
                Backward Tilt: Select Word 3 <br>
                Leftward or Rightward Tilt: Select Word 2
              </p> 
            </div>
          </header>
          <!--
          <div class="card-content">
            <ul class="content">
              <li v-for="word in words" :key="word">
                <button
                  class="button is-fullwidth is-word"
                  @click="
                    () => {
                      chooseWord(word);
                    }
                  "
                >
                  {{ word }}
                </button>
              </li>
            </ul>
          </div> -->
        </div>

        <div
          class="card card--painter"
          v-if="true"
        > 
    
          <header class="card-header">
            <div class="card-header-title">
              <p>Tilt IMU to change brush size when drawing <br>
                Leftward Tilt: Decrease Brush Size <br>
                Rightward Tilt: Increase Brush Size
              </p> 
            </div>
          </header>
        </div>

        <!--
        <div class="card card--painter" v-if="iDraw && roundStarted">
          <header class="card-header">
            <div class="card-header-title">
              <p>The chosen word is...</p>
            </div>
          </header>
          <div class="card-content">
            <p class="content">{{ password }}</p>
          </div>
        </div> -->

        <!-- <div class="card card--painter">
          <header class="card-header card-video">
            <p id="headerVideo" class="card-header-title">📷</p>
            <div class="control control-video">
              <button 
                id="startAndStop" 
                class = "button is-primary is-borderless"
                >
                Start
              </button>
            </div>
          </header>
          <div class="card-content content-video">
            <video id="videoInput" width=320 height=240 hidden></video>
          </div>
        </div> -->
      </div>

      <whiteboard id="whiteboardID" :iDraw="iDraw" :started="roundStarted"/>

      <div
        class="card card--painter"
        v-if="true"
        > 
  
          <header class="card-header">
            <div class="card-header-title">
              <p>To start drawing, pinch index finger and thumb together and move your hand around. Unpinch your fingers to stop drawing.
              </p> 
            </div>
          </header>
        </div>

      <div class="column is-3" id="chat">
        <div class="card chat">
          <header class="card-header">
            <p class="card-header-title">Chat 💬</p>
          </header>
          <div class="chat-body" ref="chat">
            <ul class="chat-messages">
              <li
                v-for="message in messages"
                :key="message.id"
                class="chat-message"
              >
                <span
                  class="has-text-weight-bold is-size-7"
                  v-if="message.sender != 'server'"
                  >{{ message.sender }}:</span
                >
                <span v-if="message.sender == 'server' && (message.msg.includes('No one guessed the word:') || message.msg.includes('left the game, choosing another 👨‍🎨') || message.msg.includes(`You need at least 2 players to start!`))" class="has-text-weight-bold has-text-danger is-size-7">
                  {{ message.msg }}
                </span>
                <span v-else-if="message.sender == 'server' && (message.msg.includes('joined the game!') || message.msg.includes(`Congratulations! You've guessed the word!`) || message.msg.includes(`guessed the word:`))" class="has-text-weight-bold has-text-success is-size-7">
                  {{ message.msg }}
                </span>
                <span v-else-if="message.sender == 'server' && (message.msg.includes(`You're so close!`) || message.msg.includes(`The chosen word is:`))" class="has-text-weight-bold has-text-warning is-size-7">
                  {{ message.msg }}
                </span>
                <span v-else-if="message.sender == 'server'" class="has-text-weight-bold is-size-7">
                  {{ message.msg }}
                </span>
                <span v-else class="is-size-7">{{ " " + message.msg }}</span>
              </li>
            </ul>
          </div>
          <footer class="card-footer">
            <form class="field has-addons chat-input" @submit="sendMessage">
              <div class="control">
                <input
                  id="message_typespace"
                  value=""
                  v-model="message"
                  class="input is-borderless"
                  type="text"
                  placeholder="Send a message..."
                />
              </div>
              <div class="control">
                <input
                  type="submit"
                  class="button is-primary is-borderless"
                  value="Send"
                />
              </div>
            </form>
          </footer>
        </div>

        <div
        class="card card--painter"
        v-if="true"
        > 
  
          <header class="card-header">
            <div class="card-header-title">
              <p>To guess a word, click the start button and say your guess.
              </p> 
            </div>
          </header>
        </div>

        <div class="card card--painter">
          <header class="card-header card-audio">
            <p id="headerAudio" class="card-header-title">🔈</p>
            <div class="control control-video">
              <button 
                id="playAndPause"
                class = "button is-primary is-borderless"
                @click="
                    () => {
                      stt();
                      stt_word();
                    }
                  "
                >
                Start
              </button>
            </div>
          </header>
        </div>
      </div>
      
      <!--place to put notes w/speechrec-->
      
      <div class="column is-full">
        <p class="subtitle is-4 has-text-centered has-text-weight-bold" id="note"></p>
      </div>

      <div class="column is-full">
        <div>
          <input type="hidden" id="fname"><br>
          <table cellpadding="0" cellspacing="0" width="0" border="0">
              <tr>
                <!--
                <td>
                    <video id="videoInput" width=320 height=240></video>
                </td>
                -->
                <td>
                    <canvas id="canvasOutput" width=320 height=240 hidden></canvas>
                </td>
                <td>
                    <canvas id="sockOutput" width=320 height=240 hidden></canvas>
                </td>
              </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Whiteboard from "../components/WhiteBoard_tutorial";
export default {
  name: "About",
  data() {
    return {
      users: [],
      showUsers: false,
      room: null,
      message: "",
      voice_message: "",
      messages: [],
      painter: null,
      words: [],
     // iDraw: false,
      iDraw: true,
      password: null,
      roundStarted: true,
      // roundStarted: false,
      time: 0,
      wordTime: 0,
      numRounds: 0,
      maxRounds: 0,
      wordHint: "",
      guesserUps: [],
      artistUps: [],
      size: 5,
      names: "",
    };
  },
  components: { Whiteboard },
  methods: {
    async joinRoom() {
      // Getting Password
      let password = "";

      if (!this.room.users.includes(this.$socket.id) && this.room.isPrivate) {
        password = await this.getPassword();
      }

      // Getting Name
      let name = await this.getName();
      this.names = name
      this.$socket.emit("setName", name);
      this.$socket.name = name;
      
      document.getElementById('fname').setAttribute("value", name);
      //var s= document.getElementById('fname');
      //s.value = name;
      
      this.showUsers = true;

      // Joining
      this.$socket.emit("join_room", {
        id: this.$route.params.id,
        password,
      });
    },
    getUsers() {
      this.$socket.emit("get_users");
    },
    getRoomInfo() {
      this.$socket.emit("get_room", this.$route.params.id);
    },
    async getName() {
      const name = await this.$swal({
        title: "Enter your name:",
        input: "text",
        showCancelButton: false,
        inputPlaceholder: "Your name is...",
        inputAttributes: {
          autocapitalize: "off",
          autocorrect: "off",
        },
      });

      return name.value;
    },
    async getPassword() {
      const { value: password } = await this.$swal({
        title: "Enter the password:",
        input: "password",
        showCancelButton: true,
        inputPlaceholder: "The password is...",
        inputAttributes: {
          autocapitalize: "off",
          autocorrect: "off",
        },
      });

      return password;
    },
    displayUsers(sortedUsers) {
      var text = "";
      var c = 1;
      var user;
      for (user in sortedUsers){
        text = text + "#" + c + " " + sortedUsers[user].name + "-" + sortedUsers[user].points + " \n";
        c++;
      }
      return text;
    },
    sendMessage(e) {
      e.preventDefault();
      if (this.message.length != 0) {
        this.$socket.emit("send_message_tutorial", this.message);
        this.message = "";
      }
    },
    chooseWord(word) {
      this.$socket.emit("word_chosen", word);
    },
    setPainter(painter) {
      this.painter = painter;
      this.iDraw = painter == this.$socket.id;
    },
    scrollChat() {
      this.$nextTick(() => {
        this.$refs.chat.scrollTo(0, this.$refs.chat.scrollHeight);
      });
    },
    stt() {
      var playAndPauseButton = document.getElementById("playAndPause");
      var headerAudio = document.getElementById("headerAudio");
      var messageSTT = document.getElementById("message_typespace");
      var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
      var recognition = new SpeechRecognition();
      var this_message = "";

      recognition.onstart = function() {
        console.log("recordButton clicked");
        console.log("Begin Speech Recognition");
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
      };

      recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript;
        var confidence = event.results[0][0].confidence;
        console.log("Text: " + transcript);
        console.log("Confidence: " + confidence);
        messageSTT.value = transcript;
        this_message = transcript;
        this.message = this_message;
      };

      recognition.start();
      this.message = this_message;
      this.$socket.emit("send_message", "I'm using speech recognition software!");
    },
    stt_word() {
      console.log("wait for message to update");
      if(this.message==="") {//we want it to not be empty
        setTimeout(stt_word(), 50);//wait 50 milliseconds then recheck
        return;
      }
      console.log("after stt"+this.message);
    },
    stt_lamer() {
      var playAndPauseButton = document.getElementById("playAndPause");
      var headerAudio = document.getElementById("headerAudio");
      var notes = document.getElementById("note");
      var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
      var recognition = new SpeechRecognition();
      var new_note = "";

      recognition.onstart = function() {
        //console.log("recordButton clicked");
        //console.log("Begin Speech Recognition");
        playAndPauseButton.disabled = true;
        playAndPauseButton.innerText = 'Wait';
        playAndPauseButton.className = 'button is-danger is-borderless';
        headerAudio.innerText = '🔊';
      };

      recognition.onspeechend = function() {
        //console.log("Speech Recognition ended");
        playAndPauseButton.disabled = false;
        playAndPauseButton.innerText = 'Start';
        playAndPauseButton.className = 'button is-primary is-borderless';
        headerAudio.innerText = '🔈';
        recognition.stop();
      }

      recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript;
        var confidence = event.results[0][0].confidence;
        console.log("Text: " + transcript);
        console.log(confidence);
        new_note = transcript.toLowerCase();
        console.log(new_note);
        notes.innerHTML = new_note;
      };

      recognition.start();
    },
  },
  sockets: {
    receive_users(users) {
      // hardcode users to 1
      this.users = 1;
    },
    receive_users_error(msg) {
      this.$swal({ title: msg, type: "error" });
    },
    join_room_error(msg) {
      this.$swal({ title: msg, type: "error" });
      this.$router.push("/rooms");
    },
    receive_room(room) {
        this.room = room;
        this.setPainter(room.painter);
        this.getUsers();
        this.joinRoom();
    },
    receive_message(msgObj) {
      if (msgObj && msgObj.msg && msgObj.msg.length) {
        this.messages.push(msgObj);
        this.scrollChat();
      }
    },
    receive_server_message(msg) {
      if (msg && msg.length) {
        this.messages.push({ sender: "server", msg });
        this.scrollChat();
      }
    },
    receive_callback(msg) {
      if (msg && msg.length) {
        this.messages.push({ sender: "server", msg });
        this.scrollChat();
      }
    },
    receive_password(password) {
      this.password = password;
    },
    round_initialized(words) {
      this.words = words;
    },
    round_started() {
      this.roundStarted = true;
      this.words = [];
    },
    round_stopped() {
      this.roundStarted = true;
    },
    game_ended() {
      this.$swal({ 
        title: "Goodbye", 
        text: this.displayUsers(this.sortedUsers),
        type: "info" });
      this.$router.push("/rooms");
    },
    painter_changed(painter) {
      this.setPainter(painter);
    },
    countdown(time) {
      this.time = time;
    },
    countdown_painter(time) {
      this.wordTime = time;
    },
    get_numRounds(numRounds) {
      this.numRounds = numRounds;
    },
    get_maxRounds(maxRounds) {
      this.maxRounds = maxRounds;
    },
    receive_hint(wordHint) {
      this.wordHint = wordHint;
    },
    increase_brush() {
      this.Whiteboard.increaseLineSize();
    },
    decrease_brush() {
      this.Whiteboard.decreaseLineSize();
    },
    start_speech() {
      this.stt();
    },
    /* get_powerups(points) {
      var power_list = ['Extend Time ⏳','Reveal Hint to Guessers 👁️','Double Points ✌️','Reveal Hint 👁️','Remove Hints ❌','Extra 💯 Points'];
      var guesser = [];
      var artist = [];

      var i;
      for (i = 0; i < 6; i++) {
        points = points % (2 ** (6 - i));
        var valid = Math.floor(points/(2 ** (5 - i)));
        if (valid == 1) {
          if (i < 3) {
            artist.push(power_list[i]);
          } else {
            guesser.push(power_list[i]);
          }
        }
      }

      this.artistUps = artist;

      this.guesserUps = guesser;
    }, */
  },
  computed: {
    sortedUsers() {
      return this.users.sort((a, b) => {
        return b.points - a.points;
      });
    },
    isButtonDisabled() {
      return true;
    },
  },
  mounted() {
    this.getRoomInfo();
    let socketScript = document.createElement('script');
      socketScript.setAttribute('src', './static/js/socket.io.js');
      document.body.appendChild(socketScript);
    let utilsScript = document.createElement('script');
      utilsScript.setAttribute('src', './static/js/utils.js');
      document.body.appendChild(utilsScript);
    //let utilScript = document.createElement('script');
      //utilScript.setAttribute('src', './static/js/util.js');
      //document.body.appendChild(utilScript);
    let recorderScript = document.createElement('script');
      recorderScript.setAttribute('src', '/static/js/recorder.js');
      document.body.appendChild(recorderScript);
    let appScript = document.createElement('script');
      appScript.setAttribute('src', '/static/js/app.js');
      document.body.appendChild(appScript);
    
    
    //let webrtcScript = document.createElement('script');
      //webrtcScript.setAttribute('src', 'https://webrtc.github.io/adapter/adapter-5.0.4.js');
      //document.body.appendChild(webrtcScript);
    document.onreadystatechange = () => { 
    if (document.readyState == "complete") { 
    this.$loadScript('/static/js/utils.js')
    .then(()=> {
      let utils = new Utils('errorMessage');
      let streaming = false;
      let videoInput = document.getElementById('videoInput');
      let startAndStop = document.getElementById('startAndStop');
      let canvasOutput = document.getElementById('canvasOutput');
      let canvasContext = canvasOutput.getContext('2d');
      let sockOutput = document.getElementById('sockOutput');
      let sockContext = sockOutput.getContext('2d');
      let headerVideo = document.getElementById('headerVideo');

       utils.loadOpenCv(() => {
        startAndStop.removeAttribute('disabled');
      });

      startAndStop.addEventListener('click', () => {
        if (!streaming) {
            //utils.clearError();
            console.log("testingggggg")
            utils.startCamera('qvga', onVideoStarted, 'videoInput');
        } else {
            utils.stopCamera();
            onVideoStopped();
        }
      });

/*       function onVideoStarted() {
        utils.nameStuff(document.getElementById('fname').value);
        streaming = true;
        startAndStop.innerText = 'Stop';
        startAndStop.className = 'button is-danger is-borderless';
        headerVideo.innerText = '📸';
        videoInput.width = videoInput.videoWidth;
        videoInput.height = videoInput.videoHeight;
        videoInput.hidden = false;
        utils.executeCode('codeEditor', streaming);
      } */

/*       function onVideoStopped() {
        streaming = false;
        canvasContext.clearRect(0, 0, canvasOutput.width, canvasOutput.height);
        sockContext.clearRect(0, 0, sockOutput.width, sockOutput.height);
        startAndStop.innerText = 'Start';
        startAndStop.className = 'button is-primary is-borderless';
        headerVideo.innerText = '📷';
        videoInput.hidden = true;
      } */

     
    })
    .catch((err)=> {
      console.log(err);
      console.log("Brokennnnnnnn")
      this.$forceUpdate();
    });
    }
    }
  },
  watch: {
    "$route.params.id": function(id) {
      this.messages = [];
      this.getRoomInfo();
    },
  },
};
</script>

<style lang="scss" scoped>
.is-borderless {
  border-radius: 0;
  border: 0;
  box-shadow: 0;
}

.playerlist {
  text-align: left;
}

.chat-body {
  height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  @media screen and (max-width: 670px) {
    height: 200px;
  }
}

.chat-messages {
  list-style-type: none;
}

.chat-message {
  text-align: left;
  padding: 0.5rem 1rem;
  box-shadow: 0 1px 2px rgba(10, 10, 10, 0.1);
  word-break: break-all;
}

.chat-input {
  display: flex;
  justify-content: stretch;
  width: 100%;
  .control:first-child {
    flex: 1;
  }
}

.voice-input {
  display: flex;
  justify-content: stretch;
  width: 100%;
}

.card--painter {
  margin-top: 2rem;
  .card-header-title {
    justify-content: space-between;
  }
}

.is-word {
  white-space: normal;
  height: auto;
}

.control-video {
  box-sizing: content-box;
}

.card-video {
  line-height: 1.4;
}

.card-audio {
  line-height: 1.4;
}

.content-video {
  padding: 0rem;
  font-size: 0em;
   transform: rotateY(180deg);
  -webkit-transform:rotateY(180deg); // Safari and Chrome 
  -moz-transform:rotateY(180deg); // Firefox 
}

.hint {
  margin-top: -1.25rem;
  margin-bottom: -0.5rem;
}

.hint-word {
  white-space: pre;
}
</style>
