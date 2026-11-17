<script setup>
defineProps({
  resultats: Array
})
</script>

<template>
  <!-- overflow-auto: en pantalles estretes la taula fa scroll en lloc de trencar-se -->
  <div class="overflow-auto">
    <table>
      <thead>
        <tr>
          <th>Tecla</th>
          <th class="num">Objectiu</th>
          <th class="num">Temps real</th>
          <th class="num">Error</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in resultats" :key="r.tecla">
          <td><strong>{{ r.tecla }}</strong></td>
          <td class="num">{{ r.objectiu }} s</td>
          <td class="num">{{ r.tempsReal }} s</td>
          <td class="num">{{ r.error }} s</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
