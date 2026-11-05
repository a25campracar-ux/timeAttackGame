import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
    
    const nomJugador = ref('')
    const partides = ref([])

    function guardarNom(nom) {
        nomJugador.value = nom;
    }

    return {
        nomJugador,
        partides,
        guardarNom,
    }
})