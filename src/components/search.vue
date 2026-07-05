<template>
    <form class="search-form" @submit="handleSearch">
        <div class="search-icon">
            <div class="search-icon-wrapper" @click="showSearhEngine()">
                <img :src="getCurrentEngineIcon()" alt="search engine">
            </div>
        </div>
        <input autocomplete="off" type="search" class="search-input" placeholder="搜你所想-看你想看~" v-model="searchInput"
            @keydown="handleKeydown" @input="handleInput" @focus="handleFocus" @blur="handleBlur">
    </form>

    <transition name="suggestion-transition">
        <!-- <div class="search-suggestions"> -->
        <div class="search-suggestions" :class="'show' ? showSuggestions && suggestions.length > 0 : ''"
            v-if="showSuggestions && suggestions.length > 0">
            <div class="suggestion-item" v-for="(item, index) in suggestions" :key="index"
                :class="{ 'active': index === activeSuggestionIndex }" @mousedown.prevent="selectSuggestion(item)"
                @mouseenter="activeSuggestionIndex = index">
                {{ item }}
            </div>
        </div>
    </transition>

    <transition name="search-engine-transition">
        <div class="search-engine" v-if="isSearchengine">
            <div class="search-engine-item" v-for="(item, index) in searchEngineList" :key="index"
                :class="{ 'active': index === currentEngineIndex }" @click="switchEngine(index)">
                <div class="search-engine-item-icon">
                    <img :src="item.icon" alt=""></img>
                </div>
                <div class="search-engine-item-name">
                    {{ item.name }}
                </div>
                <div class="search-engine-item-delete" @click.stop="deleteSearchEngine(index)">
                    <img src="../assets/common/cancel.svg" alt="">
                </div>
            </div>
            <div class="search-engine-item search-engine-add" @click="handleAddEngine">
                <div class="search-engine-item-icon">
                    <img src="../assets/common/add.svg" alt="">
                </div>
                <div class="search-engine-item-name">
                    添加
                </div>
            </div>
        </div>
    </transition>
    <Msg ref="msgRef" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useThemeStore } from '../stores/theme'
import Msg from '../components/msg.vue'
import baiduIcon from '../assets/searchengine/baidu.svg'
import googleIcon from '../assets/searchengine/google.svg'
import bingIcon from '../assets/searchengine/bing.svg'
import sougouIcon from '../assets/searchengine/sougou.svg'

const themeStore = useThemeStore()

const msgRef = ref(null)
const isSearchengine = ref(false)
const searchInput = ref('')
const currentEngineIndex = ref(0)
const suggestions = ref([])
const showSuggestions = ref(false)
const activeSuggestionIndex = ref(-1)
let debounceTimer = null
let scriptElement = null

const showSearhEngine = () => {
    isSearchengine.value = !isSearchengine.value
}

const handleAddEngine = () => {
    isSearchengine.value = false
    themeStore.openSettingsPanel(1)
}

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

function showMessage(message, type = 'info', duration = 3000) {
    if (msgRef.value) {
        msgRef.value.addMessage(message, type, duration)
    }
}
function handleMsgClose(id) {
    return 'ok'
}
const searchEngineList = ref([])
const searchEngine = ref([])

const scrollToActiveItem = () => {
    nextTick(() => {
        const box = document.querySelector('.search-suggestions')
        const activeItem = document.querySelector('.suggestion-item.active')
        if (!box || !activeItem) return
        const boxRect = box.getBoundingClientRect()
        const itemRect = activeItem.getBoundingClientRect()
        if (itemRect.bottom > boxRect.bottom) {
            box.scrollTop += itemRect.bottom - boxRect.bottom
        }
        if (itemRect.top < boxRect.top) {
            box.scrollTop -= boxRect.top - itemRect.top
        }
    })
}

onMounted(() => {
    const storedList = localStorage.getItem('yzm_SearchEngineList')
    if (storedList) {
        try {
            searchEngineList.value = JSON.parse(storedList)
        } catch (e) {
            showMessage('获取搜索引擎列表失败', 'error')
            searchEngineList.value = [...defaultSearchEngineList]
            saveSearchEngineList()
        }
    } else {
        searchEngineList.value = [...defaultSearchEngineList]
        saveSearchEngineList()
    }

    const stored = localStorage.getItem('yzm_SearchEngine')
    if (stored) {
        try {
            const parsed = JSON.parse(stored)
            searchEngine.value = Array.isArray(parsed) ? parsed : [parsed]
        } catch (e) {
            showMessage('获取搜索引擎列表失败', 'error')
            initDefaultEngine()
        }
    } else {
        initDefaultEngine()
    }

    window.bing = {
        sug: (data) => {
            if (!data || !data.AS) {
                showMessage('获取搜索建议失败!', 'error')
                suggestions.value = []
                showSuggestions.value = false
                return
            }
            let results = []
            if (data.AS.Results && Array.isArray(data.AS.Results)) {
                data.AS.Results.forEach(result => {
                    if (result.Suggests && Array.isArray(result.Suggests)) {
                        result.Suggests.forEach(suggest => {
                            if (suggest.Txt) {
                                results.push(suggest.Txt)
                            }
                        })
                    }
                })
            }
            suggestions.value = results
            showSuggestions.value = results.length > 0
            activeSuggestionIndex.value = -1
        }
    }
})

onUnmounted(() => {
    if (debounceTimer) {
        clearTimeout(debounceTimer)
    }
    if (scriptElement) {
        document.head.removeChild(scriptElement)
        scriptElement = null
    }
    delete window.bing
})

const initDefaultEngine = () => {
    const bingEngine = searchEngineList.value.find(engine => engine.name === '必应')
    if (bingEngine) {
        searchEngine.value = [bingEngine]
        currentEngineIndex.value = searchEngineList.value.findIndex(engine => engine.name === '必应')
    } else {
        searchEngine.value = [searchEngineList.value[2]]
        currentEngineIndex.value = 2
    }
    saveSearchEngine()
}

const saveSearchEngineList = () => {
    localStorage.setItem('yzm_SearchEngineList', JSON.stringify(searchEngineList.value))
}

const saveSearchEngine = () => {
    localStorage.setItem('yzm_SearchEngine', JSON.stringify(searchEngine.value))
}

const switchEngine = (index) => {
    currentEngineIndex.value = index
    searchEngine.value = [searchEngineList.value[index]]
    saveSearchEngine()
    isSearchengine.value = false
}

const deleteSearchEngine = (index) => {
    if (searchEngineList.value.length <= 1) {
        showMessage('请至少保留一个搜索引擎喵~', 'info')
        return
    }

    searchEngineList.value.splice(index, 1)
    saveSearchEngineList()

    if (index === currentEngineIndex.value) {
        currentEngineIndex.value = 0
        searchEngine.value = [searchEngineList.value[0]]
        saveSearchEngine()
    } else if (index < currentEngineIndex.value) {
        currentEngineIndex.value--
    }
}

const handleSearch = (event) => {
    event.preventDefault()
    if (!searchInput.value.trim()) return
    let query = searchInput.value.trim()
    if (activeSuggestionIndex.value >= 0 && suggestions.value[activeSuggestionIndex.value]) {
        query = suggestions.value[activeSuggestionIndex.value]
    }
    if (isUrl(query)) {
        let url = query
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url
        }
        window.open(url, '_blank')
    } else {
        const currentEngine = searchEngine.value[0] || searchEngineList.value[0]
        const searchUrl = currentEngine.url + encodeURIComponent(query)
        window.open(searchUrl, '_blank')
    }
    showSuggestions.value = false
    suggestions.value = []
}

const handleKeydown = (event) => {
    if (event.key === 'Enter') {
        handleSearch(event)
    } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (suggestions.value.length > 0) {
            activeSuggestionIndex.value = (activeSuggestionIndex.value + 1) % suggestions.value.length
            searchInput.value = suggestions.value[activeSuggestionIndex.value]
            scrollToActiveItem()
        }
    } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        if (suggestions.value.length > 0) {
            activeSuggestionIndex.value = activeSuggestionIndex.value <= 0
                ? suggestions.value.length - 1
                : activeSuggestionIndex.value - 1
            searchInput.value = suggestions.value[activeSuggestionIndex.value]
            scrollToActiveItem()
        }
    } else if (event.key === 'Escape') {
        showSuggestions.value = false
    }
}

const handleInput = () => {
    if (debounceTimer) {
        clearTimeout(debounceTimer)
    }
    debounceTimer = setTimeout(() => {
        fetchBingSuggestions(searchInput.value)
    }, 300)
}

const fetchBingSuggestions = (keyword) => {
    if (!keyword || keyword.trim() === '') {
        suggestions.value = []
        showSuggestions.value = false
        return
    }
    if (scriptElement) {
        document.head.removeChild(scriptElement)
        scriptElement = null
    }
    scriptElement = document.createElement('script')
    const encodedKeyword = encodeURIComponent(keyword.trim())
    scriptElement.src = `https://api.bing.com/qsonhs.aspx?type=cb&q=${encodedKeyword}&cb=window.bing.sug`
    scriptElement.async = true
    scriptElement.onerror = () => {
        scriptElement.src = `http://api.bing.com/qsonhs.aspx?type=cb&q=${encodedKeyword}&cb=window.bing.sug`
    }
    document.head.appendChild(scriptElement)
}

const selectSuggestion = (suggestion) => {
    searchInput.value = suggestion
    showSuggestions.value = false
    suggestions.value = []
    const currentEngine = searchEngine.value[0] || searchEngineList.value[0]
    const searchUrl = currentEngine.url + encodeURIComponent(suggestion)
    window.open(searchUrl, '_blank')
}

const handleFocus = () => {
    if (searchInput.value.trim()) {
        fetchBingSuggestions(searchInput.value)
    }
}

const handleBlur = () => {
    setTimeout(() => {
        showSuggestions.value = false
    }, 200)
}

const getCurrentEngineIcon = () => {
    const currentEngine = searchEngine.value[0]
    return currentEngine ? currentEngine.icon : bingIcon
}

const isUrl = (str) => {
    if (!str || /\s/.test(str)) {
        return false;
    }
    if (/^https?:\/\//i.test(str)) {
        return true;
    }
    const domainPattern = /^[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}(\/.*)?$/;
    const ipOrLocalhostPattern = /^(localhost|(\d{1,3}\.){3}\d{1,3})(:\d+)?(\/.*)?$/;
    if (domainPattern.test(str) || ipOrLocalhostPattern.test(str)) {
        return true;
    }
    return false;
}

</script>

<style scoped>
.search-form {
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.3);
    display: flex;
    border-radius: 10px;
    overflow: hidden;
    width: 100%;
    max-width: 900px;
    min-width: 600px;
    background: transparent;
    backdrop-filter: blur(2.5px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    margin: 26px auto;
    position: relative;
    z-index: 10;
}

.search-form:hover {
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
}

.search-form:focus-within {
    background: #141414cc;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-color: rgba(50, 49, 49, 0.7);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.search-icon {
    display: flex;
    align-items: center;
    padding: 3px;
    background: rgba(255, 255, 255, 0.1);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.search-icon-wrapper:hover {
    background-color: #27272c;
    border-radius: 10px;
}

.search-icon-wrapper {
    cursor: pointer;
    width: 45px;
    height: 35px;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.search-icon-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    /* filter: brightness(0) invert(1); */
    opacity: 1;
}

.search-input {
    flex: 1;
    border: none;
    outline: none;
    padding: 14px 20px;
    font-size: 16px;
    color: #fff;
    background: transparent;
    letter-spacing: 0.5px;
}

.search-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
    font-weight: 400;
}

.search-input:focus::placeholder {
    color: rgba(255, 255, 255, 0.4);
}

.search-suggestions {
    position: absolute;
    width: 600px;
    max-height: 270px;
    overflow-y: auto;
    overflow-x: hidden;
    background: #141414ee;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    z-index: 9;
}

.search-suggestions.show {
    padding: 8px 0;
}

.suggestion-item {
    padding: 12px 20px;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 15px;
    border-left: 3px solid transparent;
}

.suggestion-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

.suggestion-item.active {
    background: rgba(255, 255, 255, 0.15);
    margin: 3px;
    border-radius: 10px;
    /* padding-left: 17px; */
    font-weight: bold;
}

.suggestion-item.active:hover {
    background: rgba(255, 255, 255, 0.2);
}

.search-suggestions::-webkit-scrollbar {
    width: 4px;
}

.search-suggestions::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
}

.search-suggestions::-webkit-scrollbar-track {
    background: transparent;
}

.search-engine {
    position: absolute;
    width: 100%;
    max-width: 600px;
    background: #141414cc;
    box-shadow: 0 2px 8px #0000004d;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 10px;
    padding: 10px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    transition: all 0.3s ease;
    gap: 8px;
}

.search-engine-item {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: rgba(255, 255, 255, 0.06);
}

.search-engine-item:hover {
    background-color: rgba(255, 255, 255, 0.12);
}

.search-engine-item.active {
    background-color: rgba(255, 255, 255, 0.17);
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.search-engine-item.active:hover {
    background-color: rgba(255, 255, 255, 0.25);
}

.search-engine-item-icon img,
.search-engine-item-delete img {
    display: block;
}

.search-engine-item-icon img {
    width: 23px;
    height: 23px;
}

.search-engine-item-delete img {
    width: 16px;
    height: 16px;
}

.search-engine-item-delete {
    background: #6f6f6f;
    padding: 2px;
    border-radius: 8px;
    opacity: 0.8;
    margin-left: 4px;
}

.search-engine-item-delete:hover {
    opacity: 1;
    background: #f9a27a;
}

.search-engine-item-delete img:hover {
    opacity: 1;
    fill: #eb8b5e;
}

.search-engine-item-name {
    color: #fff;
    font-weight: bold;
}

.search-engine-add {
    flex: 0 0 auto;
    margin-left: auto;
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

.suggestion-transition-enter-active,
.suggestion-transition-leave-active {
    transition: all 0.3s ease-out;
}

.suggestion-transition-enter-from,
.suggestion-transition-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.suggestion-transition-enter-to,
.suggestion-transition-leave-from {
    opacity: 1;
    transform: translateY(0);
}

@media (max-width: 768px) {
    .search-form {
        min-width: 500px;
    }

    .search-suggestions {
        max-width: 500px;
        min-width: 500px;
    }

    .search-engine {
        max-width: 500px;
    }
}

@media (max-width: 560px) {
    .search-form {
        min-width: 350px;
    }

    .search-suggestions {
        max-width: 350px;
        min-width: 350px;
    }

    .search-engine {
        max-width: 350px;
    }
}


@media (max-width: 360px) {
    .search-form {
        min-width: 260px;
    }

    .search-suggestions {
        max-width: 260px;
        min-width: 260px;
    }

    .search-engine {
        max-width: 260px;
    }
}
</style>