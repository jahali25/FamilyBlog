<template>
<div>
  <div v-if="isNotBanned">
    <h1>Authors' Information</h1>
    <div class="userInfo" v-for="user in users" v-bind:key="user._id">
      <h2>{{user.firstName}} {{user.lastName}}</h2>
      <img class="userIcon" :src="user.iconPath" />
      <p>{{user.bio}}</p>
      <div v-if="isAdmin(user)">
        <p class="adminIcon"><i class="fas fa-lock-open"></i></p>
      </div>
      <hr />
    </div>
  </div>
  <div v-else>
    <DeniedPermission />
  </div>

</div>
</template>

<script>
import DeniedPermission from "@/components/DeniedPermission.vue";
import axios from 'axios';
export default {
    name: 'DisplayUsers',
    components: {
      DeniedPermission
    },
    computed: {
      currentUser() {
        return this.$root.$data.user;
      },
      isNotBanned() {
        if (!this.$root.$data.user) {
          return false;
        }
        return !this.$root.$data.isBanned;
      }
    },
    data() {
      return {
        users: []
      }
    },
    async created() {
        try {
          let response = await axios.get('/api/users');
          this.$root.$data.user = response.data.user;
          this.checkUserStatus();
          this.getUsers();
        } catch (error) {
          this.$root.$data.user = null;
        }
    },
    methods: {
        checkUserStatus() {
          if (this.$root.$data.user.role === "admin") {
            this.$root.$data.isAdmin = true;
            this.$root.$data.isBanned = false;
          } else if (this.$root.$data.user.role === "banned") {
            this.$root.$data.isAdmin = false;
            this.$root.$data.isBanned = true;
          } else {
            this.$root.$data.isAdmin = false;
            this.$root.$data.isBanned = false;
          }
        },
        async getUsers() {
          try {
            let response = await axios.get("/api/users/all");
            this.users = response.data.users;
          } catch (error) {
            console.log(error);
          }
        },
        isAdmin(user) {
          return user.role === "admin";
        }
    }
}
</script>

<style scoped>
.userIcon {
  width: 50px;
}
hr {
  margin: 1px;
}

.adminIcon {
  font-size: 5px;
}
</style>
