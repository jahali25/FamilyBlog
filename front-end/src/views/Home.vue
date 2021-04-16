<template>
  <div class="home">
    <div v-if="user">
      <h1> Congrats logged in </h1>
    </div>
    <Login v-else/>
  </div>
</template>

<script>
//import Icons from '@/components/Icons.vue';
import Login from '@/components/Login.vue';
export default {
  name: 'Home',
  components: {
    //Icons,
    Login
  },
  computed: {
        user() {
            return this.$root.$data.user;
        }
    }
}
</script>
