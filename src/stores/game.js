import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {

    const nomJugador = ref('')
    const partides = ref([])

    function guardarNom(nom) {
        nomJugador.value = nom;
    }

    // Pas 3 + Pas 5: guarda una partida. Les últimes han de sortir les primeres.
    function guardarPartida(errorTotal) {
        // ✏️ HUECO 1: ¿push() o unshift()? (push = al final, unshift = al principio)
        partides.value.unshift({
            id: partides.value.length + 1,
            nom: nomJugador.value,
            errorTotal: errorTotal
        })
    }

    // Pas 5: esborra l'historial
    // (en un store amb setup no hi ha "this": es fa amb .value)
    function esborrarPartides() {
        // ✏️ HUECO 2: deixa l'array buit
        partides.value = [];
    }

    return {
        nomJugador,
        partides,
        guardarNom,
        guardarPartida,
        esborrarPartides,
    }
})
