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

// Cuenta atrás antes de empezar (0 = no hay cuenta atrás en marcha)
const compteEnrere = ref(0)
let interval = null

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

// Escucha el teclado mientras la vista está en pantalla
onMounted(() => window.addEventListener('keydown', gestionarTeclat))
onUnmounted(() => {
  window.removeEventListener('keydown', gestionarTeclat)
  // Si se sale de la vista a media cuenta atrás, la paramos
  clearInterval(interval)
})
</script>

<template>
  <hgroup>
    <h1>Time Attack</h1>
    <p>Prem cada tecla quan creguis que ha passat el seu temps. Sense rellotge!</p>
  </hgroup>

  <!-- Zona de altura fija: así las teclas no saltan al cambiar de estado -->
  <div class="zona">
    <!-- :key hace que la animación se repita con cada número -->
    <span v-if="compteEnrere" :key="compteEnrere" class="numero">
      {{ compteEnrere }}
    </span>

    <p v-else-if="jugant" class="estat">Ja! Compta mentalment…</p>

    <button v-else class="boto-inici" @click="començarCompteEnrere">
      {{ resultats.length ? 'Tornar a jugar' : 'Començar' }}
    </button>
  </div>
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

<style scoped>
.zona {
  height: 7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Botón con el mismo estilo que las teclas */
.boto-inici {
  width: 100%;
  padding-block: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 1rem;
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.25);
  transition: transform 0.08s, box-shadow 0.08s;
}

.boto-inici:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.25);
}

/* Número grande de la cuenta atrás, aparece "saltando" */
.numero {
  font-size: 5rem;
  font-weight: bold;
  color: var(--pico-primary);
  animation: aparicio 0.4s ease-out;
}

@keyframes aparicio {
  from { transform: scale(1.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Mientras se juega, el texto parpadea suavemente */
.estat {
  margin: 0;
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--pico-primary);
  animation: parpelleig 1.2s ease-in-out infinite;
}

@keyframes parpelleig {
  50% { opacity: 0.4; }
}
</style>
