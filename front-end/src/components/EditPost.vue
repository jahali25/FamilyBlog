<template>
<transition v-if="show" name="modal">
    <div class="modal-mask">
        <div class="modal-container">
            <form class="pure-form" @submit.prevent="update">
                <legend>Upload a Blog Post</legend>
                <fieldset>
                    <input v-model="post.title" placeholder="Title">
                </fieldset>
                <fieldset>
                    <textarea v-model="post.paragraphs" placeholder="Blog Post"></textarea>
                </fieldset>
                <fieldset>
                    <p v-if="error" class="error">{{error}}</p>
                </fieldset>
                <fieldset class="buttons">
                    <button type="button" @click="close" class="pure-button">Close</button>
                    <button type="submit" class="pure-button pure-button-primary right">
                    Upload</button>
                </fieldset>
            </form>
        </div>
    </div>
</transition>
</template>

<script>
import axios from 'axios';
export default {
    name: 'EditPost',
    props: {
        post: Object,
        show: Boolean
    },
    data () {
        return {
            error: "",
        }
    },
    methods: {
        async update() {
            try {
                const id = this.post.id;
                await axios.put("/api/posts/" + id, {
                    title: this.post.title,
                    paragraphs: this.post.paragraphs
                });
                this.$emit('updateFinished');
            } catch (error) {
                console.log(error);
                this.error = error.response.data.message;
            }
        },
        close() {
            this.$emit('close');
        },
    },

}
</script>

<style scoped>
/* Modals */
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .3);
  transition: opacity 0.5s ease;
  display: flex;
  transition: background 0.2s ease-in-out, height 1s ease-in-out;
  transition: height 0.2s ease-in-out, width 0.2s ease-in-out;
  justify-content: center;
  transition-timing-function: cubic-bezier(0.64, 0.57, 0.67, 1.53);
}

.modal-container {
  width: 50%;
  height: max-content;
  margin-top: 80px;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all 0.5s ease;
}

/*
* The following styles are auto-applied to elements with
* transition="modal" when their visibility is toggled
* by Vue.js.
*
* You can easily play with the modal transition by editing
* these styles.
*/
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.buttons {
    display: flex;
    flex-direction: row;
    align-items: space-between;
    justify-content: center;
}
button {
    margin: 5px;
}
</style>
