<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import KeyPad from '../components/KeyPad.vue'
import ResultsTable from '../components/ResultsTable.vue'
import { useGameStore } from '@/stores/game'

const store = useGameStore()
const tecles = ['A', 'S', 'D', 'F']

// Segundos en los que hay que pulsar cada tecla 
const tempsObjectiu = {
  A: 2,
  S: 4,
  D: 5,
  F: 7
}

// Color de cada tecla (paleta de Pico): se usa en los objetivos y en los botones
const colorsTecles = {
  A: 'var(--pico-color-pumpkin-450)',
  S: 'var(--pico-color-azure-500)',
  D: 'var(--pico-color-jade-500)',
  F: 'var(--pico-color-violet-500)'
}

// Datos reactivos
const jugant = ref(false);
const resultats = ref([]);
const premudes = ref([]);
const nom = ref ('');

let tempsInici = 0

// Cuenta atrás antes de empezar (0 = no hay cuenta atrás en marcha)
const compteEnrere = ref(0)
let interval = null

// Texto del botón principal según el momento de la partida
const textBoto = computed(() => {
  if (compteEnrere.value) return compteEnrere.value
  if (jugant.value) return 'Ja! Compta mentalment…'
  return resultats.value.length ? 'Tornar a jugar' : 'Començar'
})

function començarCompteEnrere() {
  // Limpia la partida anterior para que no se vean las teclas verdes ni la tabla
  resultats.value = []
  premudes.value = []
  compteEnrere.value = 3

  // Cada segundo resta 1; al llegar a 0 empieza la partida de verdad
  interval = setInterval(() => {
    compteEnrere.value--
    if (compteEnrere.value === 0) {
      clearInterval(interval)
      iniciarPartida()
    }
  }, 1000)
}

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

function entrar() {
  if (nom.value.trim() === '') return
  store.guardarNom(nom.value.trim())
}

// Escucha el teclado mientras la vista está en pantalla
onMounted(() => window.addEventListener('keydown', gestionarTeclat))
onUnmounted(() => {
  window.removeEventListener('keydown', gestionarTeclat)
  // Si se sale de la vista a media cuenta atrás, la paramos
  clearInterval(interval)
})
</script>

<template>
  <!-- Pantalla de bienvenida: pide el nombre antes de jugar -->
  <article v-if="!store.nomJugador">
    <hgroup>
      <h2>Benvingut a Time Attack!</h2>
      <p>Introdueix el teu nom per començar a jugar.</p>
    </hgroup>

    <!-- Al ser un formulario, también se entra pulsando Intro -->
    <form @submit.prevent="entrar">
      <fieldset role="group">
        <input
          v-model="nom"
          placeholder="El teu nom"
          autocomplete="off"
          aria-label="Nom del jugador"
        />
        <button type="submit">Entrar</button>
      </fieldset>
    </form>
  </article>

  <!-- Todo el juego: solo aparece cuando ya hay nombre guardado -->
  <div v-else>
    <article>
      <hgroup>
        <h2>Hola, {{ store.nomJugador }}!</h2>
        <p><small>Prem cada tecla al seu temps, sense rellotge. També amb el teclat.</small></p>
      </hgroup>

      <!-- Objetivo de cada tecla, cada letra con su color -->
      <p>
        <template v-for="(tecla, i) in tecles" :key="tecla">
          <strong :style="{ color: colorsTecles[tecla] }">{{ tecla }}</strong>: {{ tempsObjectiu[tecla] }}s
          <!-- &emsp; = espacio ancho entre objetivos (no después del último) -->
          <template v-if="i < tecles.length - 1">&emsp;&emsp;</template>
        </template>
      </p>

      <KeyPad
        :tecles="tecles"
        :bloquejat="!jugant"
        :premudes="premudes"
        :colors="colorsTecles"
        @premuda="rebreTecla"
      />

      <!-- Un solo botón que cambia de texto: Començar → 3, 2, 1 → Ja! → Tornar a jugar.
           role="group" hace que ocupe todo el ancho, con el texto centrado -->
      <div role="group">
        <button
          :disabled="jugant || compteEnrere > 0"
          @click="començarCompteEnrere"
        >
          {{ textBoto }}
        </button>
      </div>
    </article>

    <!-- Resultados de la última partida -->
    <article v-if="!jugant && resultats.length === tecles.length">
      <h3>Resultats</h3>
      <ResultsTable :resultats="resultats" />
    </article>
  </div>
</template>
