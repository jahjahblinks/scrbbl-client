<template>
  <div>
    <section class="section hero title-card">
      <div class="hero-body">
        <div class="container has-text-centered">
          <div class="column is-6 is-offset-3">
            <h2 class="title is-1">🐻✏️</h2>
            <h3 class="subtitle is-2 doodle">
              Welcome to <a href="./">scrbbl @ UCLA</a>!
            </h3>
          </div>
        </div>
      </div>
    </section>

    <section class="section-xs container has-text-centered">
      <div class="hero is-light">
        <div class="hero-body">
          <div class="content">
            <h4 class="title is-3 ">How to Play!</h4>
            <p>The maxiumum time limit per round is 180 seconds.</p>
            <p>At least 2 players are needed to start a game.</p>
            <h5 class="title is-5">GLHF</h5>
          </div>
        </div>
      </div>

      <div>
        <button class="button is-success is-large " @click="openRoom">
          <strong>Play!</strong>
        </button>
        &nbsp;
        <button class="button is-primary is-large " @click="openCreator">
          <strong>Create Room</strong>
        </button>
        &nbsp;
        <button class="button is-info is-large " @click="openPractice">
          <strong>Practice!</strong>
        </button>
        <button class="button is-warning is-large " @click="openTutorial">
          <strong>Tutorial</strong>
        </button>
      </div>

    </section>
    
  </div>
</template>

<script>
export default {
  name: "homepage",
  methods: {
    openCreator() {
      this.$emit("openCreator");
    },
    openRoom() {
      this.$router.push({
        path: 'rooms'
      })
    },
    openPractice() {
      // this.$emit("openPracticeCreator")
      this.$router.push({
      path: 'practice'
      })
    },
    openTutorial() {
      // this.$emit("openPracticeCreator")
      //this.$router.push({
      //path: 'tutorial'
      //})
      location.href = 'tutorial.html';

    }
  },
  // mounted() {
  //   let utilsScript = document.createElement('script');
  //     utilsScript.setAttribute('src', './static/js/utils.js');
  //     document.body.appendChild(utilsScript);
  //   let utils = new Utils('errorMessage');
  //   utils.loadOpenCv(() => {
  //     });
  // },
};
</script>

<style lang="scss" scoped>
.button {
  margin: 2% 0;
}

.title-card {
  padding-top: 1rem;
  padding-bottom: 0rem;
}

.doodle {
  padding-top: 0.5rem;
}
</style>
