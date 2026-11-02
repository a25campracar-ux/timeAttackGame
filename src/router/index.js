import { createRouter, createWebHistory } from 'vue-router'
import gameBoardView from '../view/GameBoardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'GameBoard',
      component: GameBoard,
    },
  ],
})

export default router
