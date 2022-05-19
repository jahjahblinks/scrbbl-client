

<script>
import Switches from "vue-switches";
import { CardModal } from "vue-bulma-modal";

export default {
  name: "roomCreator",
  data() {
    return {
      name: "",
      password: "",
      maxPlayers: 1,
      maxRounds: 3,
      roundTime: 600,
      wordTime: 250,
      isPrivate: false,
      errors: {},
    };
  },
  components: {
    Switches,
    CardModal,
  },
  props: ["isVisible"],
  methods: {
    createRoom() {
      let { errors, ...roomdata } = this.$data;
      let flag = true;

      if (roomdata.name.length < 1) {
        // this.$data.errors.name = true;
        this.$set(this.$data.errors, "name", true);
        flag = false;
      } else {
        this.$set(this.$data.errors, "name", false);
      }

      if (roomdata.isPrivate) {
        if (roomdata.password.length < 3) {
          //this.$data.errors.password = true;
          this.$set(this.$data.errors, "password", true);
          flag = false;
        } else {
          this.$set(this.$data.errors, "password", false);
        }
      }

      if (roomdata.maxPlayers < 1) {
        this.$set(this.$data.errors, "players", true);
        flag = false;
      } else {
        this.$set(this.$data.errors, "players", false);
      }

      if (roomdata.maxPlayers > 50) {
        this.$set(this.$data.errors, "max_players", true);
        flag = false;
      } else {
        this.$set(this.$data.errors, "max_players", false);
      }

      if (roomdata.maxRounds < 1) {
        this.$set(this.$data.errors, "num_rounds", true);
        flag = false;
      } else {
        this.$set(this.$data.errors, "num_rounds", false);
      }

      if (roomdata.maxRounds > 10) {
        this.$set(this.$data.errors, "max_num_rounds", true);
        flag = false;
      } else {
        this.$set(this.$data.errors, "max_num_rounds", false);
      }

      if (roomdata.roundTime < 30) {
        this.$set(this.$data.errors, "rounds", true);
        flag = false;
      } else {
        this.$set(this.$data.errors, "rounds", false);
      }

      if (roomdata.roundTime > 6000) {
        this.$set(this.$data.errors, "max_rounds", true);
        flag = false;
      } else {
        this.$set(this.$data.errors, "max_rounds", false);
      }

      if (roomdata.wordTime < 10) {
        this.$set(this.$data.errors, "word", true);
        flag = false;
      } else {
        this.$set(this.$data.errors, "word", false);
      }

      if (roomdata.wordTime > 250) {
        this.$set(this.$data.errors, "max_word", true);
        flag = false;
      } else {
        this.$set(this.$data.errors, "max_word", false);
      }

      if (!flag) {
        return false;
      }

      this.$socket.emit("create_room", roomdata);
      this.$emit("closeCreator");

      this.resetForm();

      return true;
    },
    close() {
      this.$emit("closeCreator");
    },
    resetForm() {
      this.$data.name = "";
      this.$data.password = "";
      this.$data.maxPlayers = 1;
      this.$data.maxRounds = 3;
      this.$data.isPrivate = false;
      this.$data.errors = {};
    },
  },
};
</script>