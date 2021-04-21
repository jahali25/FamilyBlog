<template>
<div class="exhibition">
    <h1>Here are some of our topic blog posts</h1>
    <posts-gallery :posts="posts" @update="update"/>
    <p v-if="error">{{error}}</p>
</div>
</template>

<script>
import axios from 'axios';
import PostsGallery from '@/components/PostsGallery.vue';
export default {
    name: "Exhibition",
    components: {
        PostsGallery
    },
    data(){
        return {
            error: '',
            posts: [],
        }
    },
    async created() {
        this.getPosts();
        try {
          let response = await axios.get('/api/users');
          this.$root.$data.user = response.data.user;
          this.checkUserStatus();
        } catch (error) {
          this.$root.$data.user = null;
        }
    },
    methods: {
        async getPosts() {
            try {
                let response = await axios.get("/api/posts/all");
                this.posts = response.data;
                this.posts.sort((a, b) => a.numOfLikes > b.numOfLikes);
            } catch (error) {
            this.error = error.response.data.message;
          }
        },
        update() {
            this.getPosts();
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
    }
}
</script>
