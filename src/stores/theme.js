import { defineStore } from 'pinia'
export const useThemeStore = defineStore('theme', {
    state: ()=>{
        return {
            DatkTheme: 'false',
            showSettingsPanel: false,
            settingsActiveTab: 0
        }
    },
    persist: true,
    actions: {
        toggleTheme(){
            this.DatkTheme = !this.DatkTheme
        },
        openSettingsPanel(tabIndex = 0) {
            this.showSettingsPanel = true
            this.settingsActiveTab = tabIndex
        },
        closeSettingsPanel() {
            this.showSettingsPanel = false
        }
    }
})
