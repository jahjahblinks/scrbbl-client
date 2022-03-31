<template>
  <div class="container">
    <section class="hero">
      <div class="hero-body room-header">
        <div class="container">
          <h1 class="title room">Rooms</h1>
          <h2 class="subtitle room-title">
            Choose a room, or create a new one to start playing! 🤓
          </h2>
        </div>
      </div>
    </section>
    <section class="section">
      <table class="table is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Name 📋</th>
            <th>Type</th>
            <th>Player(s)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="room in rooms" :key="room.id">
            <td>{{room.name}}</td>
            <td>{{room.isPrivate ? 'Private 🔐' : 'Public 🌎'}}</td>
            <td>{{room.users.length}}/{{room.maxPlayers}}</td>
            <td class="is-paddingless">
              <router-link :to="'./room/'+room.id" class="button is-primary is-fullwidth">Join</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
export default {
  name: "About",
  data() {
    return { rooms: [] };
  },
  methods: {
    getRooms() {
      this.$socket.emit("get_rooms");
    }
  },
  sockets: {
    receive_rooms(rooms) {
      this.$data.rooms = rooms;
      //console.log(rooms);
    }
  },
  mounted() {
    this.getRooms();
   // console.log(this.$socket);
  }
};
</script>

<style lang="scss" scoped>
.room-title {
  padding-top: 1rem;
}

.room-header {
  padding-bottom: 0rem;
}
</style>
