<template>
  <v-footer app>
    <div class="w-100 text-center">
      <div class="mb-3 mb-md-0">
        &copy; {{ yearHijri }} <strong class="text-primary text-center">Newsletter Manager</strong>
      </div>
    </div>
  </v-footer>
</template>

<script setup>
import { yearHijri } from '~/utils/hijri'
</script>