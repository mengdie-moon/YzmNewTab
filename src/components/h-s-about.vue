<template>
    <div class="about">
        <div class="a-h">
            <div class="a-h-left">
                <div class="a-h-l-logo">
                    <img src="../assets/common/avator.jpeg" alt="">
                </div>
            </div>
            <div class="a-h-right">
                <div class="a-h-r-h">
                    <div class="a-h-r-h-title">
                        YzmNewTab
                    </div>
                    <div @click="ToQQGroup" class="a-h-r-h-qq">
                        <img src="../assets/common/s-qq.svg" alt="">
                    </div>
                    <div @click="ToGithub" class="a-h-r-h-github">
                        <img src="../assets/common/s-github.svg" alt="">
                    </div>
                </div>
                <div class="a-h-r-desc">
                    <div class="a-h-r-version">
                        v1.1.0
                    </div>
                    <div class="a-h-r-desc-text">
                        一个现代化，个性化的浏览器新标签页<br />(Last Update: 2026.7.4 18:06)
                    </div>
                    <div class="a-h-r-copying">
                        &copy; 2026 <a class="a-h-r-copying-a" href="http://newtab.linghantech.top/">YZM-NewTab</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="a-author">
            <div class="a-a-title">
                <div class="a-a-t-title">开发者</div>
            </div>
            <div class="a-a-author">
                <div class="a-a-a-avator">
                    <img src="http://q.qlogo.cn/headimg_dl?dst_uin=2751140642&spec=640&img_type=jpg" alt="">
                </div>
                <div class="a-a-a-info">
                    <div class="a-a-a-name">蛋黄酥</div>
                    <div class="a-a-a-desc">负责整个应用的完整开发</div>
                </div>
            </div>
        </div>
        <div class="yzmnewtab">
            <h1>YZMTAB</h1>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
const ToQQGroup = () => {
    window.open('https://qm.qq.com/cgi-bin/qm/qr?k=ZkL0KQJl79-J6t0vBq_9KmQPBB5o8uk6&jump_from=webapi&authKey=eTLaxTaf3RAcC44Qla3AMhauUocu5gCWaeJnN4OymwVb9xHO26+KJvKfPHDT2OL8')
}
const ToGithub = () => {
    window.open('https://github.com/mengdie-moon/YzmNewTab')
}
</script>

<style scoped>
.about {
    width: 100%;
    margin-top: 10px;
    /* height: 10px; */
    display: flex;
    flex-direction: column;
    overflow: scroll;
    overflow-y: auto;
    overflow-x: hidden;
}

.a-h {
    width: 100%;
    display: flex;
    align-items: center;
}

.a-h-l-logo {
    width: 100px;
    height: 100px;
    overflow: hidden;
}

.a-h-l-logo img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
}

.a-h-right {
    flex: 1;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.a-h-r-h {
    width: 100%;
    display: flex;
    align-items: center;
}

.a-h-r-h-qq img,
.a-h-r-h-github img {
    width: 25px;
    cursor: pointer;
    height: 25px;
    margin-left: 10px;
}

.a-h-r-h-title {
    font-size: 20px;
    font-weight: 600;
}

.a-h-r-version {
    font-size: 18px;
    font-weight: 600;
    color: #a6a5a5;
}

.a-h-r-desc {
    margin-top: 10px;
}

.a-h-r-desc-text {
    font-size: 15px;
    color: #838282;
}

.a-h-r-copying,
.a-h-r-copying-a {
    text-decoration: none;
    font-size: 13px;
    color: #838282;
}

.a-h-r-copying-a:hover {
    color: #5c5c5c;
}

.a-author {
    margin-top: 20px;
}

.a-a-t-title {
    font-size: 20px;
    font-weight: 600;
}

.a-a-t-title::before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 30px;
    background-color: #5c5c5c;
    vertical-align: middle;
    border-radius: 5px;
    margin-right: 10px;
}

.a-a-author {
    padding: 10px;
    position: relative;
    width: 50%;
    height: 150px;
    margin-top: 20px;
    border-radius: 55px;
    overflow: hidden;
    display: flex;
    align-items: center;
}

.a-a-author::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('../assets/common/avator.jpeg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: blur(2px);
    opacity: 0.6;
    z-index: 0;
}

.a-a-a-avator {
    position: relative;
    z-index: 1;
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    margin: 0 10px 0 0;
}

.a-a-a-avator img {
    width: 100%;
    object-fit: cover;
    height: 100%;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.a-a-a-info {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.a-a-a-name {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
}

.a-a-a-desc {
    font-size: 14px;
    line-height: 1.6;
    max-width: 200px;
}

.yzmnewtab {
    margin-top: 20PX;
    text-align: center;
    opacity: .1;
    pointer-events: none;
    -webkit-user-select: none;
    user-select: none;
    transform: translate(-30px);
}

.yzmnewtab h1 {
    background: linear-gradient(135deg, #ccc, #fff, #ccc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 140px;
    font-weight: 900;
    letter-spacing: -2px;
    margin: 0;
    line-height: .8;
    text-transform: uppercase;
    font-style: italic;
    background: linear-gradient(135deg, #333, #666, #333);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transform: skew(-5deg);
}

/* 适配 */
@media screen and (max-width: 1024px) {
    .a-h-l-logo {
        width: 80px;
        height: 80px;
    }

    .a-h-r-h-title {
        font-size: 18px;
    }

    .a-a-author {
        width: 70%;
        height: 130px;
    }

    .a-a-a-avator {
        width: 70px;
        height: 70px;
    }

    .yzmnewtab h1 {
        font-size: 100px;
    }
}

@media screen and (max-width: 768px) {
    .about {
        height: auto;
        min-height: 300px;
        padding-bottom: 20px;
    }

    .a-h {
        flex-direction: column;
        align-items: flex-start;
    }

    .a-h-left {
        margin-bottom: 15px;
    }

    .a-h-l-logo {
        width: 60px;
        height: 60px;
    }

    .a-h-right {
        margin-left: 0;
        width: 100%;
    }

    .a-h-r-h-title {
        font-size: 16px;
    }

    .a-h-r-version {
        font-size: 14px;
    }

    .a-h-r-desc-text {
        font-size: 13px;
    }

    .a-a-author {
        width: 90%;
        height: auto;
        min-height: 120px;
        padding: 15px;
        border-radius: 20px;
        flex-direction: row;
    }

    .a-a-a-avator {
        width: 60px;
        height: 60px;
        margin-right: 15px;
    }

    .a-a-a-name {
        font-size: 16px;
    }

    .a-a-a-desc {
        font-size: 12px;
        max-width: 150px;
    }

    .yzmnewtab {
        margin-top: 10px;
        transform: translate(-10px);
    }

    .yzmnewtab h1 {
        font-size: 60px;
        letter-spacing: -1px;
    }
}

@media screen and (max-width: 480px) {
    .a-a-author {
        width: 95%;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .a-a-a-avator {
        margin: 0 0 10px 0;
    }

    .a-a-a-info {
        align-items: center;
    }

    .a-h-r-h-title{
        font-size: 14px;
    }

    .a-h-r-version {
        font-size: 13px;
    }

    .a-h-r-desc-text {
        font-size: 11px;
    }

    .a-h-r-copying, .a-h-r-copying a{
        font-size: 11px;
    }

    .yzmnewtab h1 {
        font-size: 40px;
    }

    .a-h-r-h-qq img,
    .a-h-r-h-github img {
        width: 15px;
        height: 15px;
        margin-left: 5px;
    }
}
</style>