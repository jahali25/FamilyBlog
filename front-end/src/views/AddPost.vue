<template>
<div class="addPostContainer">
    <div v-if="isBanned">
      <h1>Sorry, you don't have permission to make posts.</h1>
      <denied-permission />
    </div>
    <div class ="postContainer" v-else>
      <form class="pure-form" @submit.prevent="upload">
        <legend>Upload a Blog Post</legend>
        <fieldset>
          <input v-model="title" placeholder="Title">
        </fieldset>
        <fieldset>
          <textarea v-model="paragraphs" placeholder="Blog Post"></textarea>
        </fieldset>
        <fieldset>
          <div class="imageInput" @click="chooseImage">
            <img v-if="url" :src="url" />
            <div v-if="!url" class="placeholder">
              Choose an Image
            </div>
            <input class="fileInput" ref="fileInput" type="file" @input="fileChanged">
          </div>
          <p v-if="error" class="error">{{error}}</p>
        </fieldset>
        <fieldset class="buttons">
          <button type="submit" class="pure-button pure-button-primary right">Upload</button>
        </fieldset>
      </form>
      <div class="submitted" v-if="beenPosted">
        <h2>Congrats! We posted your post</h2>
      </div>
    </div>
</div>
</template>
// ToDo Add a date picker
<script>
import DeniedPermission from "@/components/DeniedPermission.vue";
import axios from 'axios';
export default {
  name: 'AddPost',
  components: {
    DeniedPermission
  },
  data() {
    return {
      title: '',
      paragraphs: '',
      url: '',
      file: null,
      error: '',
      beenPosted: false,
    }
  },
  computed: {
    isBanned() {
      return this.$root.$data.isBanned;
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
    fileChanged(event) {
      this.file = event.target.files[0];
      this.url = URL.createObjectURL(this.file);
      this.beenPosted = false;
    },
    chooseImage() {
      this.$refs.fileInput.click();
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name);
        formData.append('title', this.title);
        formData.append('paragraphs', this.paragraphs);
        await axios.post("/api/posts", formData);
        this.file = null;
        this.url = "";
        this.title = "";
        this.paragraphs = "";
        this.error = "";
        this.beenPosted = true;
      } catch (error) {
          this.error = "Error: " + error.response.data.message;
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
    }
  },
}
</script>

<style scoped>
/* Form */

form {
  font-size: 11pt;
}

input {
  width: 100%;
}

textarea {
  width: 100%;
  height: 100px;
}

.placeholder {
  background: #F0F0F0;
  width: 200px;
  height: 125px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
  font-size: 14px;
  cursor: pointer;
}

.placeholder:hover {
  background: #E0E0E0;
}

.fileInput {
  display: none;
}

img {
  width: 200px;
}

.buttons {
  display: flex;
  justify-content: space-between;
}

.postContainer {
  width: 85%;
}

.addPostContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
legend {
  padding: 10px;
}
</style>
