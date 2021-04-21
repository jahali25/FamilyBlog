<template>
<div class="postPage">
    <div v-if="post">
        <h1 class="title">{{post.title}}</h1>
        <p>{{post.paragraphs}}</p>
        <img class="postImage" :src="post.photoPath" />
        <div class="postInfo">
            <p>{{post.user.firstName}} {{post.user.lastName}} </p>
            <img class="userIcon" :src="post.user.iconPath" />
            <p>{{formatDate(post.created)}}</p>
        </div>
        <div class="likeIcon" @click="likePost()">
            <p><i class="fas fa-thumbs-up"></i> {{post.numOfLikes}}</p>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
export default {
    name: 'PostPage',
    computed: {
        user() {
            return this.$root.$data.user;
        },
    },
    created() {
        this.getPost();
    },
    data() {
        return {
            post: null,
            comment: '',
            commentList: [],
            error: '',
            hasLiked: false,
        }
    },
    methods: {
        async getPost() {
            try {
                const id = this.$route.params.id;
                let response = await axios.get("/api/posts/" + id);
                this.post = response.data;
            } catch (error) {
                console.log(error);
            }
        },
        formatDate(date) {
          if (moment(date).diff(Date.now(), 'days') < 15)
            return moment(date).fromNow();
          else
            return moment(date).format('d MMMM YYYY');
        },
        async likePost() {
            if (this.hasLiked === true) {
                return;
            }
            try {
                const id = this.$route.params.id;
                let response = await axios.put("/api/posts/like/" + id);
                this.post = response.data;
                this.hasLiked = true;
            } catch (error) {
                console.log(error);
                this.hasLiked = true;
            }
        }
    }
}
</script>

<style scoped>
.postPage {
    display: flex;
    align-items: center;
    justify-content: center;
}

.postInfo {
    display: flex;
}

.postImage {
    max-width: 300px;
}

.userIcon {
    width: 20px;
}
</style>
