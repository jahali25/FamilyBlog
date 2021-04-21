<template>
<div class="adminPage">
    <div v-if="isAdmin" >
      <div class="form">
        <input v-model="findUserInfo" placeholder="Search">
        <div class="suggestions">
          <div class="suggestion" v-for="s in suggestions" :key="s.id" @click="selectItem(s)">
            "{{s.firstName}} {{s.lastName}}" {{s.username}}
          </div>
        </div>
      </div>
      <div class="userInfo" v-if="foundUser">
        <h2>{{foundUser.firstName}} {{foundUser.lastName}}</h2>
        <img class="userIcon" :src="foundUser.iconPath" />
        <p>{{foundUser.bio}}</p>
      </div>
      <div class="adminButtons" v-if="foundUser">
        <button @click="promote" class="pure-button pure-button-primary">
          Promote this Person to Administrator
        </button>
        <button @click="ban" class="pure-button pure-button-primary">
          Ban this Person
        </button>
      </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
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
      let info = this.findUserInfo;
      let items = this.users.filter(function (item) {
        if (item.role === "admin" || item.role === "banned") {
          return false;
        }
        if (info === '') {
          return true;
        }
        if (item.firstName.toLowerCase().startsWith(info.toLowerCase())) {
          return true;
        }
        if (item.lastName.toLowerCase().startsWith(info.toLowerCase())) {
          return true;
        }
        if (item.username.toLowerCase().startsWith(info.toLowerCase())) {
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
      this.getUsers();
    } catch (error) {
      this.$root.$data.user = null;
    }
    this.findUserInfo = '';
    this.foundUser = null;
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
      console.log(item);
      this.foundUser = item;
    },
    async ban() {
      if (!this.foundUser) {
        return;
      }
      try {
        const id = this.foundUser._id;
        await axios.put("/api/users/ban/" + id);
        this.getUsers();
        this.foundUser = null;
      } catch (error) {
        console.log(error);
      }
    },
    async promote() {
      if (!this.foundUser) {
        return;
      }
      try {
        const id = this.foundUser._id;
        await axios.put("/api/users/promote/" + id);
        this.getUsers();
        this.foundUser = null;
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style scoped>
.form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

/* Suggestions */
.suggestions {
  margin: 10px;
  width: 200px;
  border: 1px solid #ccc;
}

.suggestion {
  min-height: 20px;

}

.suggestion:hover {
  background-color: #5BDEFF;
  color: #fff;
}

button {
  margin: 5px 3px;

}

.find {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.userIcon {
  width: 50px;
}
</style>
