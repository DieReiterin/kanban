import { defineStore } from 'pinia'
import axios from 'axios';
export const storeProductsManager = defineStore({
    id:'storeProductsManager',
    state:()=> ({
        productsNew: [],
        productsInProcess: [],
        productsDone: [],
        productsNewSize:{},
        productsInProcessSize:{},
        productsDoneSize:{},
        deskRef: {},
    }),
    

    actions: {      
      async fetchItems() {
        try {
            const response = await axios.get('https://fakestoreapi.com/products');
            this.productsNew = response.data;
        } 
        catch (e) {
            console.log(e);
        } 
    },
    },
  })