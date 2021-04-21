<template>
  <div class="home">
    <div v-if="user">
      <h1> Congrats logged in </h1>
    </div>
    <Login v-else/>
  </div>
</template>

<script>
import axios from 'axios';
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
  },
  async created() {
    try {
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
      this.checkUserStatus();
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  methods: {
    checkUserStatus() {
      if (this.$root.$data.user.role === "admin") {
        this.$root.$data.isAdmin = true;
      } else {
        this.$root.$data.isAdmin = false;
      }
    }
  }
}
</script>
