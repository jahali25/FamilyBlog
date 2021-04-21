<template>
<div>
    <section class='postsGallery'>
        <div class="blogPost" v-for="post in posts" v-bind:key="post._id">
            <router-link :to="{
                name: 'PostPage', params: {id: post._id}
            }">
                <p class="postTitle">{{post.title}}</p>
                <img :src="post.photoPath" class="postImg" />
                <div class="userInfo">
                    <p class="postName">
                        {{post.user.firstName}} {{post.user.lastName}}
                    </p>
                    <img :src="post.user.iconPath" class="userIcon" />
                </div>
                <p class="postDate">
                    {{formatDate(post.created)}}
                </p>
            </router-link>
            <div class="editingButtons" v-if="canEdit(post)">
                <button @click="deletePost(post)">Delete Post</button>
                <button @click="editPost(post)">Edit Post</button>
                <div v-if="idToChange">
                    <edit-post :show="true" :post="post" @close="close"
                    @updateFinished="updateFinished" />
                </div>
            </div>
        </div>
    </section>
</div>
</template>

<script>
import moment from 'moment';
import axios from 'axios';
import EditPost from '@/components/EditPost.vue';
export default {
    name: 'PostsGallery',
    props: {
        posts: Array
    },
    components: {
        EditPost
    },
    data() {
        return {
            idToChange: '',
        }
    },
    computed: {
        isAdmin() {
          return this.$root.$data.isAdmin;
        },
        user() {
          return this.$root.$data.user;
        }
    },
    methods: {
        formatDate(date) {
          if (moment(date).diff(Date.now(), 'days') < 15)
            return moment(date).fromNow();
          else
            return moment(date).format('d MMMM YYYY');
        },
        canEdit(post) {
            if (this.user === null) {
                return false;
            }
            if (this.isAdmin || this.user._id === post.user._id) {
                return true;
            }
            return false;
        },
        async deletePost(post) {
            try {
                await axios.delete("/api/posts/" + post._id);
                this.$emit('update');
            } catch (error) {
                console.log(error);
            }
        },
        editPost(post) {
            this.idToChange = post._id;
        },
        close() {
            this.idToChange = '';
        },
        updateFinished() {
            this.idToChange = '';
            this.$emit('update');
        }
    },
}
</script>

<style scoped>

.userIcon {
    width: 20px;
}

.postImg {
    width: 80px;
}

router-link:hover {
    box-shadow: 10px 10px;
    margin: 15px;
}
a {
    text-decoration: none;
}
</style>
