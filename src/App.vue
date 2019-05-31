<template>
  <section>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </section>
</template>
<script type="text/javascript">
  export default {
    name: 'app'
  }
</script>
<style lang="scss">
  @import 'assets/scss/main';
  @import 'assets/pageScss/index';

  /*.fade-enter-active,*/
  /*.fade-leave-active {*/
    /*transition: all .2s ease;*/
  /*}*/

  /*.fade-enter,*/
  /*.fade-leave-active {*/
    /*opacity: 0;*/
  /*}*/
</style>
