<template>
    <div ref="column" class="column" 
    :style="`background-color: ${column.color}`"
    >
        <button class="sort-btn" @click="sortColumn()">Sort</button>
        <my-card 
            v-for="card in useStore[column.type]" 
            :card="card" 
            :currentColumn="column.type" 
            :currentColor="column.color" 
            @refresh="$emit('refresh')" 
            :key="card.id"
        />   
    </div>

</template>
  
<script>
import MyCard from '@/components/MyCard.vue'
import { storeProductsManager } from '@/store/index.js'
import { getColumnSize } from '@/functions/setColumnSize.js'
export default {
    components: {
        MyCard
    },
    data(){
        return {
            sortType:true,
        }
    },
    methods:{
        sortColumn() {
            if(this.sortType) {
                this.useStore[this.column.type].sort(function(a, b){return a.rating.rate - b.rating.rate});
                this.sortType = false
                return
            }
                this.useStore[this.column.type].sort(function(a, b){return b.rating.rate - a.rating.rate});
                this.sortType = true
            },
    }, 
    mounted() {
        this.useStore[this.column.type+'Size'] = getColumnSize(this.$refs['column'])

    },
    setup(){
        const useStore = storeProductsManager()
        return {
            useStore,
        }
    },
    props:['column'],
}
</script> 
  
<style scoped>
@media (min-width: 960px) and (max-width: 1280px) {
  .column {
  width: 45%;
}
}
@media (max-width: 959px) {
  .column {
  width: 90%;
}
}
.sort-btn{
    all: unset;
    width: 30px;
    height: 20px;
    margin-bottom:10px;
    padding: 0 5px;
    font-size: 10px;
    font-weight: bold;
    text-align: center;
    color: #fff;
    font-family: Arial, Verdana, sans-serif;
    border-radius: 5px;
    background-color: rgb(42, 42, 255);
    box-shadow: 0px 0px 5px black;
    cursor: pointer;
}
.column {  
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 350px;
    min-height: 240px;
    border-radius: 15px;
    padding: 5px;
}
.column:not(:last-child) {
    margin-right: 20px;    
}
</style>