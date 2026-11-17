<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import KeyPad from '../components/KeyPad.vue'
import ResultsTable from '../components/ResultsTable.vue'
import ScoreBoard from '../components/ScoreBoard.vue'
import { useGameStore } from '@/stores/game'
import { socket } from '@/services/socket'

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

    // Pas 3: suma els errors de totes les tecles i guarda la partida a Pinia
    let errorTotal = 0
    for (let index = 0; index < resultats.value.length; index++) {
      const element = resultats.value[index]
      errorTotal = errorTotal + Math.abs(element.error);
    }
    const errorFinal = Number(errorTotal.toFixed(2))

    // Guardem la partida al nostre Pinia (historial local)
    store.guardarPartida(errorFinal)

    // Enviem el resultat al servidor perquè el reparteixi a tothom
    socket.emit('resultat', {
      nom: store.nomJugador,
      errorTotal: errorFinal
    })
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

// Socket.IO: s'executa quan la connexió amb el servidor funciona
function connectat() {
  console.log('Connectat al servidor!', socket.id)
}

// Socket.IO: el servidor ens envia la classificació global (en connectar i després de cada partida)
function rebreClassificacio(dades) {
  console.log('Classificació rebuda:', dades)
  store.actualitzarClassificacio(dades)
}

// En entrar a la vista: escolta el teclat i connecta amb el servidor
onMounted(() => {
  window.addEventListener('keydown', gestionarTeclat)

  socket.on('connect', connectat)
  socket.on('classificacio', rebreClassificacio)
  socket.connect()
})

// En sortir de la vista: ho deixa tot net
onUnmounted(() => {
  window.removeEventListener('keydown', gestionarTeclat)

  socket.off('connect', connectat)
  socket.off('classificacio', rebreClassificacio)
  socket.disconnect()

  // Si se sale de la vista a media cuenta atrás, la paramos
  clearInterval(interval)
})
</script>

<template>
  <!-- ============ Pantalla d'entrada: demana el nom ============ -->
  <section v-if="!store.nomJugador" class="bloc heroi">
    <div class="heroi__text">
      <p class="etiqueta">Joc de precisió · en línia</p>
      <h1 class="titular"><span>Compta els segons.</span> <span>Sense rellotge.</span></h1>
      <p class="entradeta">
        Prem A, S, D i F en el segon exacte que et toca. Com menys t'equivoquis, més amunt
        apareixeràs a la classificació que veuen tots els jugadors connectats.
      </p>

      <!-- Al ser un formulari, també s'entra prement Intro -->
      <form class="heroi__form" @submit.prevent="entrar">
        <label for="nom">El teu nom</label>
        <fieldset role="group">
          <input id="nom" v-model="nom" placeholder="p. ex. Anna" autocomplete="off" maxlength="20" />
          <button type="submit">Entrar al joc</button>
        </fieldset>
      </form>

      <dl class="xifres">
        <div><dt>Tecles</dt><dd class="xifra">4</dd></div>
        <div><dt>Durada</dt><dd class="xifra">7 s</dd></div>
        <div><dt>Rellotges</dt><dd class="xifra">0</dd></div>
      </dl>
    </div>

    <!-- Avançament del joc: els objectius de cada tecla -->
    <div class="llum">
      <div class="finestra" aria-label="Objectius de cada tecla">
        <div class="finestra__barra" aria-hidden="true">
          <span class="finestra__punts"><span></span><span></span><span></span></span>
          <span class="finestra__adreca">time-attack / objectius</span>
        </div>
        <div class="finestra__cos">
          <ol class="objectius objectius--gran">
            <li v-for="tecla in tecles" :key="tecla">
              <span class="objectius__tecla" :style="{ background: colorsTecles[tecla] }">{{ tecla }}</span>
              <span class="objectius__temps xifra">{{ tempsObjectiu[tecla] }} s</span>
            </li>
          </ol>
          <p class="finestra__nota">Tres, dos, u… i a partir d'aquí, només el teu cap.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ Joc: només quan ja hi ha nom ============ -->
  <template v-else>
    <section class="bloc joc">
      <div class="joc__intro">
        <p class="etiqueta">Partida</p>
        <h1 class="titular">Hola, {{ store.nomJugador }}.</h1>
        <p class="entradeta">Prem cada tecla al seu temps, amb el ratolí o amb el teclat.</p>

        <ol class="passos">
          <li><span class="xifra">01</span><span>Prem <strong>Començar</strong>: compte enrere de 3 segons.</span></li>
          <li><span class="xifra">02</span><span>El temps corre, però no el veus. Compta mentalment.</span></li>
          <li><span class="xifra">03</span><span>Prem cada tecla quan creguis que toca. El teu error total va a la classificació.</span></li>
        </ol>
      </div>

      <div class="llum">
        <div class="finestra">
          <div class="finestra__barra" aria-hidden="true">
            <span class="finestra__punts"><span></span><span></span><span></span></span>
            <span class="finestra__adreca">time-attack / partida</span>
          </div>
          <div class="finestra__cos">
            <!-- Objectiu de cada tecla, cada lletra amb el seu color -->
            <ol class="objectius" aria-label="Objectius">
              <li v-for="tecla in tecles" :key="tecla">
                <span class="objectius__tecla" :style="{ background: colorsTecles[tecla] }">{{ tecla }}</span>
                <span class="objectius__temps xifra">{{ tempsObjectiu[tecla] }} s</span>
              </li>
            </ol>

            <KeyPad
              :tecles="tecles"
              :bloquejat="!jugant"
              :premudes="premudes"
              :colors="colorsTecles"
              @premuda="rebreTecla"
            />

            <!-- Un sol botó que canvia de text: Començar → 3, 2, 1 → Ja! → Tornar a jugar -->
            <button
              class="boto-principal"
              :disabled="jugant || compteEnrere > 0"
              @click="començarCompteEnrere"
            >
              {{ textBoto }}
            </button>

            <!-- Resultats de l'última partida -->
            <div v-if="!jugant && resultats.length === tecles.length" class="resultats">
              <h2 class="etiqueta">Resultats</h2>
              <ResultsTable :resultats="resultats" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Historial local i classificació global (Pinia) -->
    <ScoreBoard class="bloc" />
  </template>
</template>

<style scoped>
.heroi {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: clamp(2.5rem, 6vw, 6rem);
  align-items: center;
}
.heroi__form { margin: 2.5rem 0 0; max-width: 30rem; }
.heroi__form label { display: block; margin-bottom: 0.5rem; }
.heroi__form fieldset { margin: 0; }

.xifres { display: flex; gap: 2.5rem; margin: 3rem 0 0; }
.xifres div { display: flex; flex-direction: column-reverse; }
.xifres dt { font-size: 0.8125rem; color: var(--text-3); margin: 0; }
.xifres dd { margin: 0; font-size: 1.75rem; font-weight: 500; color: var(--text); letter-spacing: -0.02em; }

.objectius { list-style: none; padding: 0; margin: 0 0 1.25rem; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.75rem; }
.objectius li { list-style: none; margin: 0; display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: #0e0e11; border: 1px solid var(--linia); }
.objectius__tecla { display: grid; place-items: center; width: 2.25rem; height: 2.25rem; font-size: 1.1875rem; font-weight: 700; color: #0a0a0c; }
.objectius__temps { color: var(--text); font-size: 1.125rem; white-space: nowrap; }
.objectius--gran { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.objectius--gran li { padding: 1.25rem; }
.objectius--gran .objectius__tecla { width: 3.25rem; height: 3.25rem; font-size: 1.5rem; }
.objectius--gran .objectius__temps { font-size: 1.75rem; font-weight: 500; }
.finestra__nota { margin: 0.5rem 0 0; color: var(--text-3); font-size: 0.9375rem; }

.joc { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: clamp(2.5rem, 6vw, 6rem); align-items: start; }
.joc__intro { position: sticky; top: 2rem; }

.passos { list-style: none; padding: 0; margin: 3rem 0 0; max-width: 28rem; }
.passos li { list-style: none; display: grid; grid-template-columns: 2.5rem 1fr; padding: 1rem 0; margin: 0; color: var(--text-2); border-top: 1px solid var(--linia); }
.passos li > span:first-child { color: var(--text-3); font-size: 0.875rem; padding-top: 0.15rem; }
.passos strong { color: var(--text); font-weight: 500; }

.boto-principal { width: 100%; margin: 0; padding-block: 1rem; font-size: 1.0625rem; }
.resultats { margin-top: 2rem; }
.resultats h2 { margin-bottom: 0.75rem; }

@media (max-width: 900px) {
  .heroi, .joc { grid-template-columns: minmax(0, 1fr); }
  .joc__intro { position: static; }
}
@media (max-width: 520px) {
  .objectius { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .objectius--gran li { padding: 0.9rem; }
  .objectius--gran .objectius__tecla { width: 2.5rem; height: 2.5rem; font-size: 1.25rem; }
  .objectius--gran .objectius__temps { font-size: 1.375rem; }
  .xifres { gap: 1.75rem; }
}
</style>
