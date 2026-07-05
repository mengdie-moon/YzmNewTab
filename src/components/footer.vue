<template>
    <p class="copyright">© {{ getCurrentYear() }} YZM-NEWTab. | <a class="copyright" href="https://icp.gov.moe/?keyword=20260350" target="_blank">萌ICP备20260350号</a><br /> <span class="sentence">{{ stence }}</span></p>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get } from '../utils/request'
const stence = ref('')
const getStence = async () => {
    const res = await get('https://v1.hitokoto.cn/')
    console.log(res)
    stence.value = `${res.hitokoto}——${res.from ? res.from : res.from_who}`
}
const getCurrentYear = () => {
    return new Date().getFullYear()
}

onMounted(() => {
    getStence()
})
</script>

<style scoped>

.copyright, .sentence {
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    margin: 0;
    text-decoration: none;
}

.copyright:hover {
    color: rgba(255, 255, 255, 0.8);
}
</style>
