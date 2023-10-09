<template>
  <my-desk></my-desk>
</template>

<script>
import MyDesk from '@/components/MyDesk.vue'

export default {
  name: 'App',
  components: {
    MyDesk
  }
}
</script>

<style>
* {
  -webkit-user-drag: none;
  user-select: none;
  margin: 0;
  padding: 0;

}
</style>
