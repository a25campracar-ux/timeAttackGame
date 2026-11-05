import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia' 
import '@picocss/pico'
// Paleta de colores de Pico (variables --pico-color-*) para colorear las teclas
import '@picocss/pico/css/pico.colors.min.css'
// Nuestros ajustes del tema, siempre después de Pico
import './assets/tema.css'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

app.mount('#app')
