<template>
<div>
    <section class='postsGallery'>
        <div class="blogPost" v-for="post in posts" v-bind:key="post._id">
            <p class="postTitle">{{post.title}}</p>
            <img :src="post.photoPath" class="postImg" />
            <div class="userInfo">
                <p class="postName">{{post.user.firstName}} {{post.user.lastName}}</p>
                <img :src="post.user.iconPath" class="userIcon" />
            </div>
            <p class="postDate">{{formatDate(post.created)}}</p>
        </div>
    </section>
</div>
</template>

<script>
import moment from 'moment';
export default {
    name: 'PostsGallery',
    props: {
        posts: Array
    },
    methods: {
        formatDate(date) {
          if (moment(date).diff(Date.now(), 'days') < 15)
            return moment(date).fromNow();
          else
            return moment(date).format('d MMMM YYYY');
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
</style>
