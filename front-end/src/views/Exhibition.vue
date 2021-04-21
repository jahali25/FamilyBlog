<template>
<div class="exhibition">
    <posts-gallery :posts="posts" />
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
    created() {
        this.getPosts();
    },
    methods: {
        async getPosts() {
            try {
                let response = await axios.get("/api/posts/all");
                this.posts = response.data;
            } catch (error) {
            this.error = error.response.data.message;
          }
        }
    }
}
</script>
