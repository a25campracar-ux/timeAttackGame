<!-- Componente del teclado (A, S, D, F). Es el hijo de GameBoardView.vue -->
<script setup>
// Props que recibe del padre:
// - tecles: array con las teclas disponibles
// - bloquejat: si es true, los botones están deshabilitados
// - premudes: teclas ya pulsadas (se ven apagadas)
// - colors: color de cada tecla, p. ej. { A: 'var(--pico-color-pumpkin-450)' }
defineProps({
  tecles: Array,
  bloquejat: Boolean,
  premudes: Array,
  colors: Object,
})

// Avisa al padre de qué tecla se ha pulsado
const emit = defineEmits(['premuda'])
</script>

<template>
  <!-- Las cuatro teclas en fila, separadas -->
  <div class="teclat">
    <!-- Cambiamos las variables de color de Pico para pintar cada tecla.
         Las ya pulsadas quedan deshabilitadas, y Pico las muestra apagadas -->
    <button
      v-for="tecla in tecles"
      :key="tecla"
      :style="{ '--pico-background-color': colors[tecla], '--pico-border-color': colors[tecla] }"
      :disabled="bloquejat || premudes.includes(tecla)"
      @click="emit('premuda', tecla)"
    >
      {{ tecla }}
    </button>
  </div>
</template>

<style scoped>
.teclat {
  display: grid;
  /* minmax(0, 1fr): les columnes poden encongir en pantalles estretes */
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

/* Tecles quadrades amb el color de cada tecla (el color és del producte) */
.teclat button {
  aspect-ratio: 1;
  margin: 0;
  padding: 0;
  font-size: clamp(1.75rem, 1rem + 3vw, 3rem);
  font-weight: 500;
  color: #0a0a0c;
  box-shadow: inset 0 -6px 0 rgb(0 0 0 / 0.18);
}
.teclat button:disabled { opacity: 0.4; }
</style>
