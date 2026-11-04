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
  <div>
    <button
      v-for="tecla in tecles"
      :key="tecla"
      :disabled="bloquejat || premudes.includes(tecla)" 
      @click="emit('premuda', tecla)"
    >
      {{ tecla }}
    </button>
  </div>
</template>
