<template>
    <div class="msg-wrapper">
        <transition-group name="msg-slide" tag="div" class="msg-list">
            <div v-for="item in messageList" :key="item.id" class="msg-container" :class="item.type">
                <div class="msg-content">
                    <img class="msg-icon" :src="icon[item.type]" alt="" />
                    <span class="msg-text">{{ item.message }}</span>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    message: {
        type: [String, Object],
        default: ''
    },
    type: {
        type: String,
        default: 'info',
        validator: (value) => ['success', 'info', 'error'].includes(value)
    },
    duration: {
        type: Number,
        default: 3000
    }
})

const emit = defineEmits(['update:show', 'close'])

const messageList = ref([])
let idCounter = 0
const timers = new Map()

const icon = {
    success: new URL('../assets/common/success.svg', import.meta.url).href,
    info: new URL('../assets/common/info.svg', import.meta.url).href,
    error: new URL('../assets/common/error.svg', import.meta.url).href
}

watch(() => props.show, (newVal) => {
    if (newVal && props.message) {
        addMessage(props.message, props.type, props.duration)
        emit('update:show', false)
    }
})

function addMessage(message, type = 'info', duration = 3000) {
    const id = ++idCounter
    const msgItem = {
        id,
        message,
        type,
        duration
    }
    messageList.value.unshift(msgItem)
    const timer = setTimeout(() => {
        removeMessage(id)
    }, duration)
    timers.set(id, timer)
}

function removeMessage(id) {
    const index = messageList.value.findIndex(item => item.id === id)
    if (index > -1) {
        messageList.value.splice(index, 1)
        if (timers.has(id)) {
            clearTimeout(timers.get(id))
            timers.delete(id)
        }
        emit('close', id)
    }
}

function closeMessage(id) {
    removeMessage(id)
}

defineExpose({
    addMessage,
    closeMessage
})
</script>

<style scoped>
.msg-wrapper {
    overflow: hidden;
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999999999999;
    width: 100%;
    max-width: 400px;
    pointer-events: none;
}

.msg-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
    width: 100%;
}

.msg-container {
    min-width: 200px;
    max-width: 400px;
    padding: 16px 24px;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 50px;
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: auto;
}

.msg-content {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #ffffff;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 0.3px;
}

.msg-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    object-fit: contain;
}

.msg-text {
    flex: 1;
    line-height: 1.4;
}

.msg-container.success .msg-icon {
    padding: 6px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
}

.msg-container.info .msg-icon {
    color: #ffffff;
}

.msg-container.error .msg-icon {
    border-radius: 50%;
}

.msg-slide-enter-active,
.msg-slide-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.msg-slide-enter-from {
    opacity: 0;
    transform: translateY(-100px) scale(0.8);
}

.msg-slide-leave-to {
    opacity: 0;
    transform: translateY(-100px) scale(0.8);
}

.msg-slide-enter-to,
.msg-slide-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}
</style>