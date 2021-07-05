<template>
    <div class="sub-page">
        <div class="sub-page-title">{{ title }}</div>
        <div class="sub-page-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SubPage',
    props: {
        title: String
    }
}
</script>

<style scoped>
.sub-page {
    width: 100%;
    height: 100%;
}

.sub-page-title {
    width: 100%;
    height: 50px;
    font-size: 25px;
    position: relative;
    animation: showTitle ease-in-out 300ms 1 forwards;
}

.sub-page-content {
    width: 100%;
    height: calc(100% - 50px);
}

@keyframes showTitle {
    from {
        left: -10px;
        opacity: 0;
    }
    to {
        left: 0;
        opacity: 1;
    }
}
</style>
