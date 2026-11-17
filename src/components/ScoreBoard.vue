<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

// Sense props: les dades venen directament de Pinia
const store = useGameStore()

// Repte opcional: millor marca (menys error = millor)
const millorMarca = computed(() => {
  if (store.partides.length === 0) return null
  return Math.min(...store.partides.map(p => p.errorTotal))
})

// Pas 7 · Repte 1: classificació global ordenada de menor a major error
// [...array] fa una còpia: així sort() no modifica les dades de Pinia
const classificacioOrdenada = computed(() =>
  [...store.classificacio].sort((a, b) => a.errorTotal - b.errorTotal)
)
</script>

<template>
  <div>
    <h3>Historial de partides</h3>

    <!-- Pas 5: missatge si encara no hi ha partides -->
    <p v-if="store.partides.length === 0"><small>Encara no has jugat cap partida.</small></p>

    <template v-else>
      <p>🏆 Millor marca: <strong>{{ millorMarca }} s</strong></p>

      <table>
        <thead>
          <tr>
            <th>Partida</th>
            <th>Jugador</th>
            <th>Error total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="partida in store.partides" :key="partida.id">
            <td>{{ partida.id }}</td>
            <td>{{ partida.nom }}</td>
            <td>{{ partida.errorTotal }} s</td>
          </tr>
        </tbody>
      </table>

      <!-- Pas 5: crida l'action del store -->
      <button class="secondary outline" @click="store.esborrarPartides()">
        Esborrar historial
      </button>
    </template>

    <h3>Classificació global</h3>

    <!-- Pas 7 · Repte 3: missatge si el servidor encara no té resultats -->
    <p v-if="store.classificacio.length === 0">
      <small>Encara no hi ha resultats. Sigues el primer a jugar!</small>
    </p>

    <table v-else>
      <thead>
        <tr>
          <th>Posició</th>
          <th>Jugador</th>
          <th>Error total</th>
        </tr>
      </thead>
      <tbody>
        <!-- Pas 7 · Repte 2: la primera fila (la millor) va destacada -->
        <tr
          v-for="(resultat, index) in classificacioOrdenada"
          :key="index"
          :class="{ millor: index === 0 }"
        >
          <td>{{ index === 0 ? '🥇' : index + 1 }}</td>
          <td>{{ resultat.nom }}</td>
          <td>{{ resultat.errorTotal }} s</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* Pico pinta el fons a les cel·les (td), per això el color va aquí */
.millor td {
  background-color: var(--pico-color-jade-100);
  color: var(--pico-color-jade-850);
  font-weight: bold;
}
</style>
