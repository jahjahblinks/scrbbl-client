import Vue from "vue";
import VueSocketIO from "vue-socket.io";
import VueSweetAlert from "vue-sweetalert2";
import SocketIO from 'socket.io-client'
import router from "./router.js";
import App from "./App.vue";
import PracticeApp from "./PracticeApp.vue"
import Colors from "./styles/variables.scss";
import "./registerServiceWorker";
import LoadScript from "vue-plugin-load-script";

// Bulma
import "./styles/index.scss";

Vue.config.productionTip = false;

/* Establish Connection */
const socketConnection = SocketIO('https://scrbbl-server.herokuapp.com/',{ // http://192.168.68.117:5050', {
  withCredentials: false,
});

// Vue + Socket.io
Vue.use(
  new VueSocketIO({
    debug: false,
    connection: socketConnection,//"http://192.168.68.117:5050", 
    //transports: ["websocket"], //"https://tranquil-ridge-32141.herokuapp.com/", //"http://localhost:5050",
  })
);

// SweetAlert2
Vue.use(VueSweetAlert, {
  confirmButtonColor: Colors.primary,
  cancelButtonColor: Colors.light,
});

Vue.use(LoadScript);

// Initializing
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
