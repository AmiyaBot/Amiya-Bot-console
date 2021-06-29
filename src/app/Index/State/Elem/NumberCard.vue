<template>
    <div class="number-card" :style="{ backgroundColor: '#' + color }">
        <div class="value">{{ value }}</div>
        <div class="title">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NumberCard',
    props: {
        title: String,
        value: String | Number,
        color: String
    }
}
</script>

<style scoped>
.number-card {
    height: 60px;
    padding: 0 20px;
    color: #fff;
    border-radius: 12px;
    display: flex;
}

.value {
    line-height: 60px;
    font-size: 30px;
}

.title {
    padding-left: 10px;
    font-size: 15px;
    flex-direction: column;
    justify-content: center;
    display: flex;
}
</style>
