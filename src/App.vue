<script setup>
import { useGameStore } from '@/stores/game'

const store = useGameStore()
</script>

<template>
  <!-- Fila de marca: nom del joc i, si n'hi ha, el jugador -->
  <header class="container capcalera">
    <a class="marca" href="./" aria-label="Time Attack, inici">
      <span class="marca__signe" aria-hidden="true"></span>
      Time Attack
    </a>
    <p class="capcalera__info">
      <template v-if="store.nomJugador">Jugant com <strong>{{ store.nomJugador }}</strong></template>
      <template v-else>Classificació en temps real</template>
    </p>
  </header>

  <main class="container">
    <RouterView />
  </main>
</template>
