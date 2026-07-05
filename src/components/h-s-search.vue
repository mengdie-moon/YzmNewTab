<template>
    <div class="search-settings">
        <div class="s-list">
            <transition-group name="search-engine-transition" tag="div">
                <div v-for="(engine, index) in searchEngineList" :key="index" class="s-item">
                    <div class="s-item-icon">
                        <img :src="engine.icon" alt="">
                    </div>
                    <div class="s-item-info">
                        <div class="s-item-name">{{ engine.name }}</div>
                        <div class="s-item-url">{{ engine.url }}</div>
                    </div>
                    <div class="s-item-delete" @click.stop="deleteSearchEngine(index)">
                        <img src="../assets/common/cancel.svg" alt="">
                    </div>
                </div>
            </transition-group>
            <div v-if="searchEngineList.length === 0" class="s-empty">
                暂无搜索引擎，请添加~
            </div>
        </div>
        <div class="s-add-btn" @click="showAddDialog = true">
            <img src="../assets/common/add.svg" alt="">
            <span>添加搜索引擎</span>
        </div>
        <transition name="dialog-fade">
            <div v-if="showAddDialog" class="s-dialog-overlay" @click.self="showAddDialog = false">
                <div class="s-dialog">
                    <div class="s-dialog-header">
                        <div class="s-dialog-title">添加搜索引擎</div>
                        <div class="s-dialog-close" @click="showAddDialog = false">
                            <img src="../assets/common/cancel.svg" alt="">
                        </div>
                    </div>

                    <div class="s-dialog-body">
                        <div class="s-form-item">
                            <label class="s-form-label">名称</label>
                            <input type="text" class="s-form-input" v-model="newEngine.name" placeholder="例如：知乎">
                        </div>

                        <div class="s-form-item">
                            <label class="s-form-label">搜索URL</label>
                            <input type="text" class="s-form-input" v-model="newEngine.url"
                                placeholder="例如：https://www.zhihu.com/search?q=">
                            <div class="s-form-tip">URL末尾需要包含查询参数占位符（如 ?q= 或 ?wd=）</div>
                        </div>

                        <div class="s-form-item">
                            <label class="s-form-label">图标</label>
                            <div class="s-icon-selector">
                                <div v-for="(icon, key) in iconOptions" :key="key" class="s-icon-option"
                                    :class="{ 'active': newEngine.iconKey === key && !newEngine.customIcon }"
                                    @click="selectPresetIcon(key)">
                                    <img :src="icon" alt="">
                                </div>
                                <div class="s-icon-option s-icon-upload" :class="{ 'active': newEngine.customIcon }"
                                    @click="triggerFileUpload">
                                    <img v-if="newEngine.customIcon" :src="newEngine.customIcon" alt="">
                                    <div v-else class="s-upload-placeholder">
                                        <span>+</span>
                                    </div>
                                    <input ref="fileInput" type="file" accept="image/*" style="display: none"
                                        @change="handleFileUpload">
                                </div>
                            </div>
                            <div class="s-form-tip">支持 JPG、PNG、SVG 格式，建议尺寸 64x64px</div>
                        </div>
                    </div>

                    <div class="s-dialog-footer">
                        <button class="s-btn s-btn-cancel" @click="showAddDialog = false">取消</button>
                        <button class="s-btn s-btn-confirm" @click="addSearchEngine">添加</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
    <Msg ref="msgRef" />
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import Msg from './msg.vue'
import baiduIcon from '../assets/searchengine/baidu.svg'
import googleIcon from '../assets/searchengine/google.svg'
import bingIcon from '../assets/searchengine/bing.svg'
import sougouIcon from '../assets/searchengine/sougou.svg'
const searchEngineList = ref([])
const showAddDialog = ref(false)
const fileInput = ref(null)
const msgRef = ref(null)

const defaultSearchEngineList = [
    {
        name: '百度',
        url: 'https://www.baidu.com/s?wd=',
        icon: baiduIcon
    },
    {
        name: '谷歌',
        url: 'https://www.google.com/search?q=',
        icon: googleIcon
    },
    {
        name: '必应',
        url: 'https://cn.bing.com/search?q=',
        icon: bingIcon
    },
    {
        name: '搜狗',
        url: 'https://www.sogou.com/web?query=',
        icon: sougouIcon
    }
]

const iconOptions = {
    baidu: baiduIcon,
    google: googleIcon,
    bing: bingIcon,
    sougou: sougouIcon
}
const newEngine = reactive({
    name: '',
    url: '',
    iconKey: 'baidu',
    customIcon: null
})

function showMessage(message, type = 'info', duration = 3000) {
    if (msgRef.value) {
        msgRef.value.addMessage(message, type, duration)
    }
}

const saveSearchEngineList = () => {
    localStorage.setItem('yzm_SearchEngineList', JSON.stringify(searchEngineList.value))
}

const deleteSearchEngine = (index) => {
    if (searchEngineList.value.length <= 1) {
        showMessage('请至少保留一个搜索引擎喵~', 'info')
        return
    }
    searchEngineList.value.splice(index, 1)
    saveSearchEngineList()
    showMessage('删除成功', 'success')
}
const selectPresetIcon = (key) => {
    newEngine.iconKey = key
    newEngine.customIcon = null
}
const triggerFileUpload = () => {
    fileInput.value.click()
}
const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return
    if (file.size > 200 * 1024) {
        showMessage('图片大小不能超过 200KB', 'error')
        return
    }
    if (!file.type.startsWith('image/')) {
        showMessage('请选择图片文件', 'error')
        return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
        const base64 = e.target.result
        compressImage(base64, 64, 64, (compressedBase64) => {
            newEngine.customIcon = compressedBase64
            newEngine.iconKey = null
            showMessage('图标上传成功', 'success')
        })
    }
    reader.onerror = () => {
        showMessage('图片读取失败', 'error')
    }
    reader.readAsDataURL(file)
    event.target.value = ''
}
const compressImage = (base64, maxWidth, maxHeight, callback) => {
    const img = new Image()
    img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        if (width > height) {
            if (width > maxWidth) {
                height *= maxWidth / width
                width = maxWidth
            }
        } else {
            if (height > maxHeight) {
                width *= maxHeight / height
                height = maxHeight
            }
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8)
        callback(compressedBase64)
    }
    img.src = base64
}

const addSearchEngine = () => {
    if (!newEngine.name.trim()) {
        showMessage('请输入搜索引擎名称', 'error')
        return
    }
    if (!newEngine.url.trim()) {
        showMessage('请输入搜索URL', 'error')
        return
    }
    const urlPattern = /^https?:\/\/.+\?.+=/
    if (!urlPattern.test(newEngine.url)) {
        showMessage('URL格式不正确，需要包含协议头和查询参数（如 ?q= 或 ?wd=）', 'error')
        return
    }
    let icon
    if (newEngine.customIcon) {
        icon = newEngine.customIcon
    } else {
        icon = iconOptions[newEngine.iconKey]
    }
    searchEngineList.value.push({
        name: newEngine.name.trim(),
        url: newEngine.url.trim(),
        icon: icon
    })
    saveSearchEngineList()
    showMessage('添加成功', 'success')
    newEngine.name = ''
    newEngine.url = ''
    newEngine.iconKey = 'baidu'
    newEngine.customIcon = null
    showAddDialog.value = false
}

onMounted(() => {
    const storedList = localStorage.getItem('yzm_SearchEngineList')
    if (storedList) {
        try {
            searchEngineList.value = JSON.parse(storedList)
        } catch (e) {
            console.error('解析失败')
            searchEngineList.value = [...defaultSearchEngineList]
        }
    } else {
        searchEngineList.value = [...defaultSearchEngineList]
    }
})
</script>

<style scoped>
.search-settings {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.s-h {
    padding: 10px 0;
    border-bottom: 2px solid #796e6e33;
}

.s-h-title {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    background: #796e6e33;
    padding: 5px 12px;
    border-radius: 10px;
    display: inline-block;
}

.s-list {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
}

.s-item {
    display: flex;
    align-items: center;
    padding: 12px;
    margin-bottom: 10px;
    background-color: rgba(255, 255, 255, 0.06);
    border-radius: 10px;
    transition: all 0.2s ease;
    cursor: pointer;
}

.s-item:hover {
    background-color: rgba(255, 255, 255, 0.12);
}

.s-item-icon {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.s-item-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.s-item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.s-item-name {
    color: #fff;
    font-size: 15px;
    font-weight: 600;
}

.s-item-url {
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.s-item-delete {
    flex-shrink: 0;
    background: #6f6f6f;
    padding: 4px;
    border-radius: 8px;
    opacity: 0.8;
    margin-left: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.s-item-delete:hover {
    opacity: 1;
    background: #8c8c8c;
    transform: scale(1.1);
}

.s-item-delete img {
    width: 16px;
    height: 16px;
}

.s-empty {
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
    padding: 30px 0;
    font-size: 14px;
}

.s-add-btn {
    margin-top: 15px;
    padding: 12px;
    background-color: rgba(255, 255, 255, 0.06);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #fff;
    font-size: 14px;
}

.s-add-btn:hover {
    background-color: rgba(255, 255, 255, 0.12);
}

.s-add-btn img {
    width: 20px;
    height: 20px;
}

.s-list::-webkit-scrollbar {
    width: 6px;
}

.s-list::-webkit-scrollbar-track {
    background: transparent;
}

.s-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
}

.s-list::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
}

.search-engine-transition-enter-active,
.search-engine-transition-leave-active {
    transition: all 0.3s ease-out;
}

.search-engine-transition-enter-from,
.search-engine-transition-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.search-engine-transition-enter-to,
.search-engine-transition-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
    transition: all 0.3s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
    opacity: 0;
}

.dialog-fade-enter-to,
.dialog-fade-leave-from {
    opacity: 1;
}

.s-dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
}

.s-dialog {
    width: 90%;
    max-width: 500px;
    background: #252525;
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    overflow: hidden;
}

.s-dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.s-dialog-title {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
}

.s-dialog-close {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.s-dialog-close:hover {
    background: rgba(255, 255, 255, 0.1);
}

.s-dialog-close img {
    width: 18px;
    height: 18px;
}

.s-dialog-body {
    padding: 20px;
}

.s-form-item {
    margin-bottom: 18px;
}

.s-form-label {
    display: block;
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    margin-bottom: 8px;
    font-weight: 500;
}

.s-form-input {
    width: 100%;
    padding: 10px 14px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;
}

.s-form-input:focus {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);
}

.s-form-input::placeholder {
    color: rgba(255, 255, 255, 0.4);
}

.s-form-tip {
    margin-top: 6px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
}

.s-icon-selector {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.s-icon-option {
    width: 48px;
    height: 48px;
    padding: 8px;
    background: rgba(255, 255, 255, 0.06);
    border: 2px solid transparent;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.s-icon-option:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: scale(1.05);
}

.s-icon-option.active {
    border-color: #696969;
    background: rgba(180, 180, 180, 0.1);
}

.s-icon-option img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.s-icon-upload {
    position: relative;
    overflow: hidden;
}

.s-upload-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: rgba(255, 255, 255, 0.4);
    font-weight: bold;
}

.s-dialog-footer {
    display: flex;
    gap: 12px;
    padding: 15px 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    justify-content: flex-end;
}

.s-btn {
    padding: 10px 24px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.s-btn-cancel {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
}

.s-btn-cancel:hover {
    background: rgba(255, 255, 255, 0.15);
}

.s-btn-confirm {
    background: linear-gradient(135deg, #464646 0%, #454444 100%);
    color: #fff;
}

.s-btn-confirm:hover {
    background-color: #989797;
}

@media screen and (max-width: 768px) {
    .s-item {
        padding: 10px;
    }

    .s-item-icon {
        width: 28px;
        height: 28px;
        margin-right: 10px;
    }

    .s-item-name {
        font-size: 14px;
    }

    .s-item-url {
        font-size: 11px;
    }

    .s-item-delete {
        padding: 3px;
    }

    .s-item-delete img {
        width: 14px;
        height: 14px;
    }

    .s-dialog {
        width: 95%;
    }

    .s-icon-option {
        width: 42px;
        height: 42px;
    }
}

@media screen and (max-width: 480px) {
    .s-h-title {
        font-size: 16px;
        padding: 4px 10px;
    }

    .s-item {
        padding: 8px;
    }

    .s-item-icon {
        width: 24px;
        height: 24px;
        margin-right: 8px;
    }

    .s-item-name {
        font-size: 13px;
    }

    .s-item-url {
        font-size: 10px;
    }

    .s-item-delete {
        padding: 2px;
    }

    .s-item-delete img {
        width: 12px;
        height: 12px;
    }

    .s-add-btn {
        padding: 10px;
        font-size: 13px;
    }

    .s-add-btn img {
        width: 18px;
        height: 18px;
    }

    .s-dialog-body {
        padding: 15px;
    }

    .s-form-input {
        padding: 8px 12px;
        font-size: 13px;
    }

    .s-icon-option {
        width: 38px;
        height: 38px;
        padding: 6px;
    }

    .s-btn {
        padding: 8px 18px;
        font-size: 13px;
    }
}
</style>
