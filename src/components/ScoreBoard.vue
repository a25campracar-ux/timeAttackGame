<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

// Sense props: les dades venen directament de Pinia
const store = useGameStore()

// Repte opcional: millor marca (menys error = millor)
const millorMarca = computed(() => {
  if (store.partides.length === 0) return null
  // ✏️ HUECO 4: de cada partida, quin número vols comparar?
  return Math.min(...store.partides.map(p => p.errorTotal))
})
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
  </div>
</template>
