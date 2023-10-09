<template>
    <div class="desk" >
        <my-column 
          v-if="show" 
          v-for="column in columns" 
          @refresh="refresh()" 
          :column="column" 
          :key="column.type"
        />       
    </div>
  </template>
  
  <script>
import MyColumn from '@/components/MyColumn.vue'
import { columnTypes } from '@/constants/columns.js'
import { storeProductsManager } from '@/store/index.js'

export default {
    data(){
      return{
        show:true,
      }
    },
    setup() {
        const useStore = storeProductsManager()
        const columns = columnTypes
        useStore.fetchItems()
        return {
          useStore,
          columns
        }
    },
    methods:{
      refresh(){
        this.show = false
        const self = this
        setTimeout(()=>{
          self.show = true
        },100)
      }
    },
    components: {
        MyColumn
    },
}
  </script>
  
<style scoped>
.desk {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  height: 100%;
  padding: 20px;
  background-color: lightgray;
}
</style>