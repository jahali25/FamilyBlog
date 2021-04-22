<template>
  <div id="app">
    <div id="nav">
      <div class="mainIcons">
        <router-link to="/"><i class="fas fa-home"></i></router-link>
        <router-link to='/exhibition'>
          <i class="fas fa-bullhorn"></i>
        </router-link>
      </div>
      <div v-if="user">
        <div v-if="isNotBanned">
          <router-link to="/addPost" class="addButton"> Add a Blog Post </router-link>
        </div>
        <div class='lessCommon'>
          <router-link to='/settings'>
            <i class="fas fa-user-cog" id="settingsIcon"></i>
          </router-link>
          <div v-if="isNotBanned">
            <router-link  to='/displayUsers'>
              <i class="fas fa-users"></i>
            </router-link>
          </div>
        </div>
        <div v-if="isAdmin">
          <router-link  to="/admin">
            <i class="fas fa-toolbox"></i>
          </router-link>
        </div>
        <h2> <span class="userName">{{user.firstName}} {{user.lastName}}</span>
          <a @click="logout"><i class="fas fa-sign-out-alt"></i></a>
        </h2>
      </div>
    </div>
    <router-view/>
    <div class="footer">
      <a href="https://github.com/jahali25/FamilyBlog" target="_blank">
        <img src="/icons/GitHub-Mark-120px-plus.png">
      </a>
      <p>I spent 12 hours on this project.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'App',
  components: {

  },
  computed: {
    isAdmin() {
      return this.$root.$data.isAdmin;
    },
    user() {
      return this.$root.$data.user;
    },
    isNotBanned() {
      if (!this.$root.$data.user) {
        return false;
      }
      return !this.$root.$data.isBanned;
    }
  },
  methods: {
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
        this.$root.$data.isAdmin = false;
        this.$forceUpdate();
      } catch (error) {
        this.$root.$data.user = null;
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#settingsIcon {
  margin: 20px;
  height: 10px;
  font-size: 40px;
}
.fas {
  font-size: 50px;
}

.mainIcons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.mainIcons i {
  margin: 10px;
}

i {
  margin: 10px 0;
}

.addButton {
  padding: 5px;
  border: 2px solid #2c3e50;
  border-radius: 15px;
  margin-bottom: 40px;
}

.lessCommon {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.userName {
  margin-right: 20px;
}

.footer {
  margin: 18px 0;
}

.footer img {
  width: 100px;
}

.editingButtons button {
  margin: 2px 8px;
  border-radius: 15px;
  padding: 5px;
}

* {
  font-size: 20px;
}
</style>
