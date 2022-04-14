<template>
  <card-modal
    :visible="isVisible"
    title="Create Room"
    transition="fade"
    @cancel="close"
    @ok="createRoom"
    class="section-xs"
  >
    <form class="columns is-multiline">
      <div class="field column is-12">
        <label class="label">Room Name</label>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="Enter a name..."
            v-model="name"
            required
          />
        </div>
        <p class="help is-danger" v-if="errors['name']">
          You have to enter a name.
        </p>
      </div>

      <div class="field column is-6">
        <label class="label">Password</label>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="Enter a password..."
            v-model="password"
            :disabled="!isPrivate"
          />
        </div>
        <p class="help is-danger" v-if="errors['password']">
          Minimum password length is 3 characters.
        </p>
      </div>

      <div class="field column is-6">
        <label class="label">Max Players</label>
        <div class="control">
          <input
            class="input"
            type="number"
            placeholder="Enter a number..."
            v-model="maxPlayers"
            min="2"
            max="50"
            required
          />
        </div>
        <p class="help is-danger" v-if="errors['players']">
          Minimum number of players is 2.
        </p>
        <p class="help is-danger" v-if="errors['max_players']">
          Maximum number of players is 50.
        </p>
      </div>

      <div class="field column is-6">
        <label class="label">Rounds</label>
        <div class="control">
          <input
            class="input"
            type="number"
            placeholder="Enter a number..."
            v-model="maxRounds"
            min="2"
            max="10"
            required
          />
        </div>
        <p class="help is-danger" v-if="errors['num_rounds']">
          Minimum number of rounds is 2.
        </p>
        <p class="help is-danger" v-if="errors['max_num_rounds']">
          Maximum number of rounds is 10.
        </p>
      </div>

      <div class="column is-6">
        <label class="label">Round Time</label>
        <div class="field has-addons">
          <div class="control is-fullwidth">
            <input
              class="input"
              type="number"
              placeholder="Enter a number..."
              v-model="roundTime"
              min="30"
              max="180"
              required
            />
          </div>
          <p class="control">
            <a class="button is-static">
              s
            </a>
          </p>
        </div>
        <p class="help is-danger" v-if="errors['rounds']">
          Minimum round time is 30 seconds.
        </p>
        <p class="help is-danger" v-else-if="errors['max_rounds']">
          Maximum round time is 180 seconds.
        </p>
      </div>

      <div class="column is-6">
        <label class="label">Word Selection Time</label>
        <div class="field has-addons">
          <div class="control is-fullwidth">
            <input
              class="input"
              type="number"
              placeholder="Enter a number..."
              v-model="wordTime"
              min="10"
              max="60"
              required
            />
          </div>
          <p class="control">
            <a class="button is-static">
              s
            </a>
          </p>
        </div>
        <p class="help is-danger" v-if="errors['word']">
          Minimum word selection time is 10 seconds.
        </p>
        <p class="help is-danger" v-else-if="errors['max_word']">
          Maximum word selection time is 60 seconds.
        </p>
      </div>

      <div class="field column is-12">
        <div class="control">
          <switches
            v-model="isPrivate"
            text-enabled="The room is private."
            text-disabled="The room is public."
            theme="bulma"
            color="default"
          ></switches>
        </div>
      </div>
    </form>
  </card-modal>
</template>

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

      if (roomdata.maxRounds < 2) {
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

      if (roomdata.roundTime > 600) {
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

<style lang="scss">
.control.is-fullwidth {
  flex: 1;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
  transform: rotateY(50deg);
}
.fade-enter-active,
.fade-leave {
  opacity: 1;
  transform: rotateY(0deg);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity, transform 200ms ease-out;
}
</style>
