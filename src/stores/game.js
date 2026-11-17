import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {

    const nomJugador = ref('')
    const partides = ref([])
    // Resultats de tots els jugadors, enviats pel servidor
    const classificacio = ref([])

    function guardarNom(nom) {
        nomJugador.value = nom;
    }

    // Pas 3 + Pas 5: guarda una partida. Les últimes han de sortir les primeres.
    function guardarPartida(errorTotal) {
        partides.value.unshift({
            id: partides.value.length + 1,
            nom: nomJugador.value,
            errorTotal: errorTotal
        })
    }

    // Pas 5: esborra l'historial
    // (en un store amb setup no hi ha "this": es fa amb .value)
    function esborrarPartides() {
        partides.value = [];
    }

    // Substitueix la classificació per la que ens envia el servidor
    function actualitzarClassificacio(dades) {
        classificacio.value = dades;
    }

    return {
        nomJugador,
        partides,
        classificacio,
        guardarNom,
        guardarPartida,
        esborrarPartides,
        actualitzarClassificacio,
    }
})
