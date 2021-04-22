<template>
  <div class="home">
    <div v-if="user">
      <posts-gallery :posts="posts" @update="update"/>
    </div>
    <Login v-else/>
  </div>
</template>

<script>
import axios from 'axios';
import PostsGallery from "@/components/PostsGallery.vue";
import Login from '@/components/Login.vue';
export default {
  name: 'Home',
  components: {
    //Icons,
    Login,
    PostsGallery
  },
  data() {
    return {
      posts: [],
    }
  },
  computed: {
        user() {
            this.getPostOfUser();
            return this.$root.$data.user;
        }
  },
  async created() {
    try {
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
      this.checkUserStatus();
      this.getPostOfUser();
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
    async getPostOfUser() {
      if (!this.$root.$data.user) {
        return;
      }
      try {
        let response = await axios.get("/api/posts");
        this.posts = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    update() {
      this.getPostOfUser();
    }
  }
}
</script>
