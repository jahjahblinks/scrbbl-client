<template>
  <footer class="footer">
    <div class="container">
      <div class="content">
        <p>
          Developed by Team 6 at
          <a href="https://www.youtube.com/watch?v=jWsx2iqO1ks&ab_channel=Grandayy">UCLA</a>.
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "footer"
};
</script>

<style lang="scss" scoped>
.footer {
  width: 100%;
  padding-bottom: 3rem;
  text-align: right;
  @media screen and (max-width: 500px) {
    text-align: center;
  }
}
</style>
