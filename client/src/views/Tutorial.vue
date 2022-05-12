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
      <iframe src="https://docs.google.com/document/d/e/2PACX-1vTD8WiNV5gDQHIPw5IKnd9AXqcw1xUFODQWVi1V5o4OasCsYNLPy2HvzrxTqy5iNe0UkWG8A3l9Yfdj/pub?embedded=true"></iframe>
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