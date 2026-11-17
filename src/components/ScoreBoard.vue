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
  <section class="marcadors" aria-label="Marcadors">
    <!-- Historial d'aquest navegador -->
    <article>
      <header class="marcador__cap">
        <h2>El teu historial</h2>
        <p v-if="millorMarca !== null" class="marcador__millor">
          Millor marca <strong class="xifra">{{ millorMarca }} s</strong>
        </p>
      </header>

      <p v-if="store.partides.length === 0" class="buit">Encara no has jugat cap partida.</p>

      <template v-else>
        <div class="overflow-auto">
          <table>
            <thead>
              <tr>
                <th class="num">Partida</th>
                <th>Jugador</th>
                <th class="num">Error total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="partida in store.partides" :key="partida.id">
                <td class="num">{{ partida.id }}</td>
                <td>{{ partida.nom }}</td>
                <td class="num">{{ partida.errorTotal }} s</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button class="secondary outline" @click="store.esborrarPartides()">Esborrar historial</button>
      </template>
    </article>

    <!-- Classificació de tots els jugadors connectats (Socket.IO) -->
    <article>
      <header class="marcador__cap">
        <h2>Classificació global</h2>
        <p class="marcador__millor">En directe</p>
      </header>

      <p v-if="store.classificacio.length === 0" class="buit">
        Encara no hi ha resultats. Sigues el primer a jugar!
      </p>

      <div v-else class="overflow-auto">
        <table>
          <thead>
            <tr>
              <th class="num">Posició</th>
              <th>Jugador</th>
              <th class="num">Error total</th>
            </tr>
          </thead>
          <tbody>
            <!-- La primera fila (la millor) va destacada -->
            <tr
              v-for="(resultat, index) in classificacioOrdenada"
              :key="index"
              :class="{ millor: index === 0 }"
            >
              <td class="num xifra">{{ index + 1 }}</td>
              <td>{{ resultat.nom }}</td>
              <td class="num">{{ resultat.errorTotal }} s</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </section>
</template>

<style scoped>
.marcadors { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.5rem; align-items: start; }
.marcador__cap { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; margin: 0 0 1.25rem; padding: 0; background: none; border: 0; }
.marcador__cap h2 { font-size: 1.5rem; margin: 0; }
.marcador__millor { margin: 0; font-size: 0.875rem; color: var(--text-3); }
.marcador__millor strong { color: var(--text); font-weight: 500; margin-left: 0.35rem; }
.buit { color: var(--text-3); margin: 0; padding: 1.5rem 0 0.5rem; border-top: 1px solid var(--linia); }
article button { margin: 1.25rem 0 0; }

/* El millor resultat: text més fort i una marca de llum a la posició */
.millor td { color: var(--text); font-weight: 600; }
.millor td:first-child { box-shadow: inset 2px 0 0 var(--accent); }

@media (max-width: 900px) {
  .marcadors { grid-template-columns: minmax(0, 1fr); }
}
</style>
