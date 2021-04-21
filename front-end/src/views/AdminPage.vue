<template>
<div class="adminPage">
    <div v-if="isAdmin" >
      <div class="form">
      <input v-model="findUserInfo" placeholder="Search">
      <div class="suggestions" v-if="suggestions.length > 0">
        <div class="suggestion" v-for="s in suggestions" :key="s.id" @click="selectItem(s)">
          {{s.firstName}} {{s.lastName}} {{s.username}}
        </div>
      </div>
    </div>
</div>
</template>

<script>
export default {
  name: 'AdminPage',
  components: {

  },
  data() {
    return {
      users: [],
      findUserInfo: '',
      foundUser: null,
    }
  },
  computed: {
    isAdmin() {
      return this.$root.$data.isAdmin;
    },
    currentUser() {
      return this.$root.$data.user;
    },
    suggestions() {
      let items = this.users.filter(function (item) {
        if (item.role === "admin" || item.role === "banned") {
          return false;
        }
        if (item.firstName.toLowerCase().startsWith(this.findUserInfo.toLowerCase())) {
          return true;
        }
        if (item.lastName.toLowerCase().startsWith(this.findUserInfo.toLowerCase())) {
          return true;
        }
        if (item.username.toLowerCase().startsWith(this.findUserInfo.toLowerCase())) {
          return true;
        }
        return false;
      });
      return items;
    },
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
    },
    async getUsers() {
      try {
        let response = await axios.get('/api/users/all');
        this.users = response.data.users;
      } catch (error) {
        console.log(error);
      }
    },
    selectItem(item) {
      this.findUserInfo = '';
      this.foundUser = item;
    }
  }
}
</script>

<style scoped>
</style>
