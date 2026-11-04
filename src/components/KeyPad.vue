<!-- Componente del teclado (A, S, D, F). Es el hijo de GameBoardView.vue -->
<script setup>
// Props que recibe del padre:
// - tecles: array con las teclas disponibles
// - bloquejat: si es true, los botones están deshabilitados
defineProps({
  tecles: Array,
  bloquejat: Boolean,
  premudes: Array,
})

// Avisa al padre de qué tecla se ha pulsado
const emit = defineEmits(['premuda'])
</script>

<template>
  <div class="teclat">
    <button
      v-for="tecla in tecles"
      :key="tecla"
      class="tecla"
      :class="{ premuda: premudes.includes(tecla) }"
      :disabled="bloquejat || premudes.includes(tecla)"
      @click="emit('premuda', tecla)"
    >
      {{ tecla }}
    </button>
  </div>
</template>

<style scoped>
/* Las cuatro teclas en fila, del mismo tamaño */
.teclat {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-block: 2rem;
}

/* Teclas grandes y cuadradas, como las de un teclado */
.tecla {
  aspect-ratio: 1;
  font-family: monospace;
  font-size: 2.5rem;
  font-weight: bold;
  border-radius: 1rem;
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.25);
  transition: transform 0.08s, box-shadow 0.08s;
}

/* Efecto de "hundirse" al hacer clic */
.tecla:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.25);
}

/* Tecla ya usada: verde y hundida */
.tecla.premuda {
  background-color: #2e9e5b;
  border-color: #2e9e5b;
  color: white;
  opacity: 1;
  transform: translateY(4px);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.25);
}
</style>
