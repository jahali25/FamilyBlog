<template>
<div class="login">
    <div class="loginBox">
        <form class="pure-form space-above">
            <fieldset>
                <legend>Login</legend>
                <input placeholder="username" v-model="usernameLogin">
                <input type="password" placeholder="password" v-model="passwordLogin">
            </fieldset>
            <fieldset>
                <button type="submit" class="pure-button pure-button-primary"
                @click.prevent="login">Login</button>
            </fieldset>
        </form>
        <p v-if="errorLogin" class="error">{{errorLogin}}</p>
        <form class="pure-form">
            <fieldset>
                <legend>Register for an account</legend>
                <input placeholder="first name" v-model="firstName">
                <input placeholder="last name" v-model="lastName">
            </fieldset>
            <fieldset>
                <input placeholder="username" v-model="username">
                <input type="password" placeholder="password" v-model="password">
            </fieldset>
            <fieldset class="bioHolder">
                <textarea :placeholder="bioPlaceholder" v-model="bio"> </textarea>
            </fieldset>
            <fieldset>
                <!-- Note, this is a child passing data back to a parent.
                Advanced stuff if I say so myself -->
                <icons v-on:clicked="selectIcon" />
            </fieldset>
            <fieldset>
                <button type="submit" class="pure-button pure-button-primary"
                @click.prevent="register">Register</button>
            </fieldset>
        </form>
        <p v-if="error" class="error">{{error}}</p>

    </div>
</div>
</template>

<script>
import axios from 'axios';
import Icons from "@/components/Icons.vue";
export default {
    name: 'Login',
    components: {
        Icons
    },
    data() {
        return {
            bioPlaceholder: "Here is an optional section where you can add " +
            "a little about yourself",
            firstName: '',
            lastName: '',
            bio: '',
            username: '',
            password: '',
            icon: null,
            usernameLogin: '',
            passwordLogin: '',
            error: '',
            errorLogin: '',
        }
    },
    methods: {
        async register() {
            this.error = '';
            this.errorLogin = '';
            if (!this.firstName || !this.lastName || !this.username || !this.password
            || !this.icon)
                return;
            try {
                let response = await axios.post('/api/users', {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    username: this.username,
                    password: this.password,
                    bio: this.bio,
                    iconPath: this.icon.path,
                });
                this.$root.$data.user = response.data.user;
                this.checkUserStatus();
            } catch (error) {
                this.error = error.response.data.message;
                this.$root.$data.user = null;
            }
        },
        async login() {
          this.error = '';
          this.errorLogin = '';
          if (!this.usernameLogin || !this.passwordLogin)
            return;
          try {
            let response = await axios.post('/api/users/login', {
              username: this.usernameLogin,
              password: this.passwordLogin,
            });
            this.$root.$data.user = response.data.user;
            this.checkUserStatus();
          } catch (error) {
            this.errorLogin = "Error: " + error.response.data.message;
            this.$root.$data.user = null;
          }
        },
        selectIcon(childIcon) {
            this.icon = childIcon;
        },
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
        }
    },
}
</script>

<style scoped>
.space-above {
  margin-top: 50px;
}

h1 {
  font-size: 28px;
  font-variant: capitalize;
}

.login {
  padding: 120px;
  display: flex;
  justify-content: center;
}

.loginBox {
  text-align: center;
}

.login form {
  font-size: 14px;
}

.login form legend {
  font-size: 20px;
}

input {
  margin-right: 10px;
}

.error {
  margin-top: 10px;
  display: inline;
  padding: 5px 20px;
  border-radius: 30px;
  font-size: 10px;
  background-color: #d9534f;
  color: #fff;
}

textarea {
    width: 200px;
    height: 70px;
}

</style>
