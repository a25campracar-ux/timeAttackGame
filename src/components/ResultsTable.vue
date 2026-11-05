<script setup>
defineProps({
  resultats: Array
})
</script>

<template>
  <!-- overflow-auto: en pantallas estrechas la tabla hace scroll en vez de romperse -->
  <div class="overflow-auto">
    <table class="striped">
      <thead>
        <tr>
          <th>Tecla</th>
          <th>Objectiu</th>
          <th>Temps real</th>
          <th>Error</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="r in resultats" :key="r.tecla">
          <td>{{ r.tecla }}</td>
          <td>{{ r.objectiu }} s</td>
          <td>{{ r.tempsReal }} s</td>
          <td>{{ r.error }} s</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
