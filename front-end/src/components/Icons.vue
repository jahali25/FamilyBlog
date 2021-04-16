<template>
<div class="iconPage">
    <div class="iconList" v-for="icon in icons" :key="icon.id">
        <div class="icon" @click="setIcon(icon)">
            <img :src="icon.path" />
        </div>
    </div>

</div>
</template>

<script>
export default {
    name: 'Icons',
    created () {
        this.icons = this.$root.$data.icons;
    },
    data() {
        return {
            icons: [],
        }
    },
    methods: {
        setIcon(icon) {
            this.$emit('clicked', icon);
        }
    },
}
</script>

<style scoped>

.iconPage {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    width: 300px;
}

img {
    width: 100px;
    margin: 10px;
}

</style>
