<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import KeyPad from '../components/KeyPad.vue'
import ResultsTable from '../components/ResultsTable.vue'

const tecles = ['A', 'S', 'D', 'F']

// Segundos en los que hay que pulsar cada tecla 
const tempsObjectiu = {
  A: 2,
  S: 4,
  D: 5,
  F: 7
}

// Datos reactivos
const jugant = ref(false);
const resultats = ref([]);
const premudes = ref([]);

let tempsInici = 0

function iniciarPartida() {
  resultats.value = [];
  premudes.value = [];
  jugant.value = true;
  tempsInici = performance.now();

}

function rebreTecla(tecla) {
  // si no esta jugando, sale
  if (!jugant.value) return
  // si ya hay un resultado de esa tecla, sale
  if (resultats.value.some(e => e.tecla === tecla)) return
  // para el tiempo, y lo calcula 
  const tempsFinal = performance.now();
  const tempsTranscorregut = (tempsFinal - tempsInici) / 1000;
  // leer objetivo de tempsObjetiu
  const objectiu = tempsObjectiu[tecla];
  // calcular error y redondear
  const error = +Math.abs(tempsTranscorregut - objectiu).toFixed(2);
  // objeto resultado
  const guardarResultat = {
    tecla: tecla,
    objectiu: objectiu,
    tempsReal: +tempsTranscorregut.toFixed(2),
    error: error,
  }
  resultats.value.push(guardarResultat);

  premudes.value.push(tecla);

  if (resultats.value.length === tecles.length) {
    jugant.value = false;
  }
}

// Teclado físico: convierte la tecla pulsada en una de las del juego
function gestionarTeclat(e) {
  // Ignora las repeticiones automáticas al mantener una tecla pulsada
  if (e.repeat) return
  // Ignora combinaciones como Ctrl+S para no romper los atajos del navegador
  if (e.ctrlKey || e.metaKey || e.altKey) return

  const tecla = e.key.toUpperCase()
  if (tecles.includes(tecla)) {
    rebreTecla(tecla)
  }
}

// Escucha el teclado mientras la vista está en pantalla
onMounted(() => window.addEventListener('keydown', gestionarTeclat))
onUnmounted(() => window.removeEventListener('keydown', gestionarTeclat))
</script>

<template>
  <h1>Time Attack</h1>
  <button v-if="!jugant" @click="iniciarPartida">Començar</button>
  <KeyPad 
    :tecles="tecles" 
    :bloquejat="!jugant" 
    :premudes="premudes"
    @premuda="rebreTecla" 
  />
  <ResultsTable
    v-if="!jugant && resultats.length === tecles.length" 
    :resultats="resultats"
  />
</template>
