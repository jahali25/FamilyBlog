<template>
<div class="iconPage">
    <div class="iconList" v-for="icon in icons" :key="icon.id">
        <div class="icon" @click="setIcon(icon)">
            <img :src="icon.path" :class="{selected: active(icon)}" />
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
            selectedIconID: '',
        }
    },
    methods: {
        setIcon(icon) {
            this.selectedIconID = icon.id;
            this.$emit('clicked', icon);
        },
        active(icon) {
            return icon.id === this.selectedIconID;
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

.selected {
    box-shadow: 10px 10px;
    margin: 15px;
}

</style>
