<template>
    <div class="t-r-moreBtn">
        <div class="morebtnBox">
            <button @click="toggleMore()" class="more-button" title="更多设置" aria-label="更多设置">
                <img src="../assets/common/more.svg" alt="">
            </button>
        </div>
    </div>
    <transition name="menu-fade">
        <div class="t-r-moreMenu" v-if="isShowMore">
            <!-- <div class="t-r-moreMenu"> -->
            <div class="t-m-menu-left">
                <div class="t-m-menu-l-user">
                    <img src="../assets/common/avator.jpeg" alt="">
                </div>
                <div class="t-m-menu-l-items">
                    <div class="t-m-menu-l-item" :class="{ active: activeIndex === index }"
                        v-for="(item, index) in moreLeft" :key="index" @click="handleMenuClick(index)">
                        <div class="t-m-menu-l-item-icon">
                            <img :src="item.icon" alt="">
                        </div>
                        <div class="t-m-menu-l-item-name">{{ item.name }}</div>
                    </div>
                </div>
            </div>
            <div class="t-m-menu-right">
                <transition :name="slideAnimName" mode="out-in">
                    <div class="panel-wrap" :key="activeIndex">
                        <div v-if="activeIndex === 0" class="panel normal-panel">
                            <div class="t-m-m-r-header">
                                <div class="t-m-m-r-header-title">常规</div>
                                <div class="t-m-m-r-header-close" @click="toggleMore">
                                    <img src="../assets/common/cancel.svg" alt="">
                                </div>
                            </div>

                        </div>
                        <div v-if="activeIndex === 1" class="panel search-panel">
                            <div class="t-m-m-r-header">
                                <div class="t-m-m-r-header-title">搜索</div>
                                <div class="t-m-m-r-header-close" @click="toggleMore">
                                    <img src="../assets/common/cancel.svg" alt="">
                                </div>
                            </div>
                        </div>
                        <div v-if="activeIndex === 2" class="panel style-panel">
                            <div class="t-m-m-r-header">
                                <div class="t-m-m-r-header-title">个性</div>
                                <div class="t-m-m-r-header-close" @click="toggleMore">
                                    <img src="../assets/common/cancel.svg" alt="">
                                </div>
                            </div>

                        </div>
                        <div v-if="activeIndex === 3" class="panel about-panel">
                            <div class="t-m-m-r-header">
                                <div class="t-m-m-r-header-title">关于</div>
                                <div class="t-m-m-r-header-close" @click="toggleMore">
                                    <img src="../assets/common/cancel.svg" alt="">
                                </div>
                            </div>
                            <About />
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </transition>
    <Msg ref="msgRef" />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Msg from '../components/msg.vue'
import CommonIcon from '../assets/common/s-common.svg'
import PenIcon from '../assets/common/s-pen.svg'
import SearchIcon from '../assets/common/s-search.svg'
import AboutIcon from '../assets/common/s-about.svg'
import About from '../components/h-s-about.vue'
const isShowMore = ref(false)
const msgRef = ref(null)
const activeIndex = ref(0)
const prevIndex = ref(0)
const moreLeft = [
    {
        id: 0,
        name: '常规',
        icon: CommonIcon
    },
    {
        id: 1,
        name: '搜索',
        icon: SearchIcon
    },
    {
        id: 2,
        name: '个性',
        icon: PenIcon
    },
    {
        id: 3,
        name: '关于',
        icon: AboutIcon
    }
]
function showMessage(message, type = 'info', duration = 3000) {
    if (msgRef.value) {
        msgRef.value.addMessage(message, type, duration)
    }
}
const slideAnimName = computed(() => {
    return activeIndex.value > prevIndex.value ? 'slide-right' : 'slide-left'
})
function handleMsgClose(id) {
    return 'ok'
}
function toggleMore() {
    isShowMore.value = !isShowMore.value
    // showMessage('🔥速制作ing~', 'info')
}

function handleMenuClick(index) {
    activeIndex.value = index
}
</script>

<style scoped>
.t-r-moreBtn {
    position: fixed;
    top: 23px;
    right: 23px;
    display: flex;
    align-items: center;
    z-index: 999;
    padding: 5px;
}

.morebtnBox {
    padding: 10px;
}

.more-button {
    border: none;
    background: #3a3a3a33;
    border-radius: 50px;
    backdrop-filter: blur(15px);
    /* width: 60px;
    height: 50px; */
    padding: 10px;
}

.more-button img {
    padding: 5px;
    filter: saturate(150%);
    transition: all 0.3s ease;
}

.more-button img:hover {
    transform: scale(1.5);
}

.t-r-moreMenu {
    z-index: 9999;
    position: absolute;
    display: flex;
    /* align-items: center; */
    top: 50%;
    left: 50%;
    width: 90%;
    padding: 13px;
    max-width: 1000px;
    height: auto;
    min-height: 50%;
    transform: translate(-50%, -50%);
    min-width: 180px;
    background-color: #0000004d;
    filter: saturate(150%);
    -webkit-backdrop-filter: blur(15px) saturate(1.2);
    backdrop-filter: blur(15px) saturate(1.2);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
    overflow: hidden;
}

::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #555555 0%, #515151 100%);
    border-radius: 4px;
    transition: all 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #737373 0%, #959595 100%);
}

::-webkit-scrollbar-thumb:active {
    background: linear-gradient(135deg, #b0b0b0 0%, #909090 100%);
}

::-webkit-scrollbar-corner {
    background: transparent;
}

.t-m-menu-left {
    display: flex;
    width: 25%;
    flex-direction: column;
    align-items: center;
}

.t-m-menu-l-user img {
    border-radius: 10px;
    overflow: hidden;
    width: 50px;
    height: 50px;
}

.t-m-menu-l-items {
    margin-top: 10px;
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
}

.t-m-menu-l-item {
    border-radius: 15px;
    transition: all 0.4s ease;
    cursor: pointer;
    display: flex;
    margin: 5px;
    width: 100%;
    align-items: center;
    /* flex-direction: row; */
    color: #FFFFFF;
    padding: 12px;
}

.t-m-menu-l-item.active {
    background: rgba(255, 255, 255, 0.3);
}

.t-m-menu-l-item:hover {
    background: rgba(255, 255, 255, 0.2);
}

.t-m-menu-l-item-name {
    letter-spacing: 2px;
    margin-left: 5px;
}

.t-m-menu-l-item-icon {
    display: flex;
    align-items: center;
    margin-right: 3px;
}

.t-m-menu-l-item-icon img {
    width: 20px;
    height: 20px;
}

.t-m-menu-right {
    flex: 1;
    color: #fff;
    background: #323232d9;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    padding: 20px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.3s ease;
    margin-left: 10px;
    overflow: scroll;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 70vh;
}

.panel-wrap {
    width: 100%;
}

.panel {
    width: 100%;
}

.t-m-m-r-header {
    display: flex;
    align-items: center;
    padding: 2px;
    justify-content: space-between;
    border-bottom: 2px solid #796e6e33;
}

.t-m-m-r-header-title {
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    background: #796e6e33;
    padding: 3px 10px;
    border-radius: 10px;
}

.t-m-m-r-header-close {
    opacity: 0.8;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.t-m-m-r-header-close:hover {
    cursor: pointer;
    opacity: 1;
    border-radius: 50px;
    padding: 5px;
    background: #796e6e33;
}


/* 动画 */

.menu-fade-enter-active,
.menu-fade-leave-active {
    transition: all 0.3s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
}

.menu-fade-enter-to,
.menu-fade-leave-from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
}

.slide-right-enter-active,
.slide-right-leave-active {
    transition: 0.3s ease all;
}

.slide-right-leave-from {
    opacity: 1;
    transform: translateX(0);
}

.slide-right-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

.slide-right-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.slide-right-enter-to {
    opacity: 1;
    transform: translateX(0);
}

.slide-left-enter-active,
.slide-left-leave-active {
    transition: 0.3s ease all;
}

.slide-left-leave-from {
    opacity: 1;
    transform: translateX(0);
}

.slide-left-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.slide-left-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.slide-left-enter-to {
    opacity: 1;
    transform: translateX(0);
}

/* 适配 */
@media screen and (max-width: 1024px) {
    .t-r-moreMenu {
        width: 85%;
        max-width: 800px;
    }

    .t-m-menu-left {
        width: 30%;
    }

    .t-m-menu-l-item {
        padding: 10px;
    }
}


@media screen and (max-width: 768px) {
    .t-m-menu-l-item-name {
        display: none;
    }

    .t-m-menu-l-user img {
        width: 40px;
        height: 40px;
    }

    .t-m-menu-left {
        width: 10%;
    }

    .t-m-menu-l-item {
        justify-content: center;
        padding: 12px;
    }

    .t-m-menu-l-item-icon {
        margin-right: 0;
    }

    .t-m-menu-l-item-icon img {
        width: 22px;
        height: 22px;
    }
}

@media screen and (max-width: 480px) {
    .t-r-moreBtn {
        top: 15px;
        right: 15px;
    }

    .more-button {
        padding: 8px;
    }

    .t-m-menu-l-user img {
        width: 30px;
        height: 30px;
    }

    .t-m-menu-l-item{
        width: auto;
    }

    .t-m-menu-l-item-icon img {
        width: 15px;
        height: 15px;
    }
}
</style>