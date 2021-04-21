<template>
<div class="settingsPage">
    <form class="pure-form">
        <fieldset>
            <legend>Change Your Personal Information</legend>
            <input placeholder="first name" v-model="firstName">
            <input placeholder="last name" v-model="lastName">
        </fieldset>
        <fieldset>
            <input type="password" placeholder="password" v-model="password">
            <button type="submit" class="pure-button pure-button-primary"
            @click.prevent="changePassword">Change Password</button>
        </fieldset>
        <fieldset class="bioHolder">
            <textarea v-model="bio"> </textarea>
        </fieldset>
        <fieldset>
            <div class="iconContainer">
                    <!-- Note, this is a child passing data back to a parent.
                    Advanced stuff if I say so myself -->
                <icons v-on:clicked="selectIcon" />
            </div>
        </fieldset>
        <fieldset>
            <button type="submit" class="pure-button pure-button-primary"
            @click.prevent="changeInfo">Change Personal Info</button>
        </fieldset>
    </form>

    <p v-if="error" class="error">{{error}}</p>
</div>
</template>

<script>
import axios from 'axios';
import Icons from "@/components/Icons.vue";
export default {
    name: 'Settings',
    components: {
        Icons
    },
    data(){
        return {
            firstName: "",
            lastName: "",
            bio: "",
            password: "",
            icon: null,
            error: '',
        }
    },
    async created() {
        try {
          let response = await axios.get('/api/users');
          this.$root.$data.user = response.data.user;
          this.checkUserStatus();
          this.updateFields(response);
          this.error = '';
        } catch (error) {
          this.$root.$data.user = null;
          this.error = "User not logged in!";
        }

    },
    computed: {
        user() {
            return this.$root.$data.user;
        }
    },
    methods: {
        selectIcon(childIcon) {
            this.icon = childIcon;
        },
        async changeInfo() {
            if (this.user == null) {
                console.log("Error! User not logged in");
            }
            this.error = '';
            let iconPath = '';
            if (this.icon === null) {
                iconPath = this.user.iconPath;
            } else {
                iconPath = this.icon.path;
            }
            try {
                let response = await axios.put('/api/users', {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    bio: this.bio,
                    iconPath: iconPath,
                });
                this.$root.$data.user = response.data.user;
                this.checkUserStatus();
                this.updateFields(response);
                this.error = "Congrats! You updated your personal information.";
            } catch (error) {
                console.log(error);
                this.error = "Unable to change data";
            }
        },
        async changePassword() {
            this.error = "";
            if (this.password === '') {
                this.error = "Unable to change password";
                return;
            }
            try {
                let response = await axios.put("/api/users/password", {
                    password: this.password,
                });
                this.error = response.data.message
            } catch (error) {
                console.log(error);
                this.error = error.response.data.message;
            }
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
        },
        updateFields(response) {
            let user = response.data.user;
            this.firstName = user.firstName;
            this.lastName = user.lastName;
            this.bio = user.bio;
        }
    },
}
</script>

<style scoped>
input {
    margin: 5px;
}

.iconContainer {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
