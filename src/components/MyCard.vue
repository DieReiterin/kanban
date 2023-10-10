<template>
    <div ref="card" class="card" @mousedown="(e)=>cardMousedown(e)"  @mouseup.capture="cardMouseup()" :style="`border:${edit ? '2px solid red' : 'none'}`">
      <div class="card__header" :style="`background-color: ${currentColor}`">
          <p class="card__header-title">{{ card.title }}</p>
          <div class="card__btns">
            <button class="card__btn" @click="toggleEdit()" :style="`background-color:${edit ? 'green' : 'blue'}`" v-show="showDetails">{{ edit ? 'Save' : 'Edit'}}</button>
            <button class="card__btn" @click="deleteCard(card.id)">Delete</button>
          </div>
        </div>
        <div class="card__center">
          
          <button v-show="this.columns[0].type !== currentColumn" class="card__btn"
          @click="currentColumn === 'productsInProcess' ? 
          this.changeColumn(currentColumn, this.columns[0].type,card) : 
          this.changeColumn(currentColumn, this.columns[1].type,card)"
          >{{ '<' }}</button>
          

          <div class="card__rating">
            <p class="card__rate">Rate:{{ card.rating.rate }}</p>
            <p class="card__count">(count:{{ card.rating.count }})</p>
          </div>
          <img class="card__img" :src="card.image"/>

          <button 
          v-show="this.columns[columns.length - 1].type !== currentColumn" class="card__btn"
          @click="currentColumn === 'productsInProcess' ? 
          this.changeColumn(currentColumn, this.columns[2].type,card) : 
          this.changeColumn(currentColumn, this.columns[1].type,card)"
          >{{ '>' }}</button>

        </div>

        <button class="card__btn" 
        @click="toggleShowDetails()" 
        :style="`background-color:${showDetails ? 'green' : 'blue'}`">Show details</button>

        <div class="field" v-for="field in this.fields" v-if="showDetails">
            <div class="card__row" v-if="notObject(card[field]) && field != 'image'">

                <p class="card__row-title">{{ field+':' }}</p>
                <p v-if="!edit" :key="field" class="card__row-textarea">{{ card[field] }}</p>
                <textarea v-if="edit" :key="field+'_edit'" class="card__row-textarea" v-model="card[field]"></textarea>

            </div>
        </div>

    </div>
</template>
<script>
import { storeProductsManager } from '@/store/index.js'
import { columnTypes } from '@/constants/columns.js'
export default {
  props: ['card','currentColumn', 'currentColor'],
  data(){
    return {
      move: false,
      cardPositionTop: true,
      cardPositionLeft: true,
      edit: false,
      afterEdit:false,
      showDetails: false,
      handler: (e) => {
              this.cardMousemove(e);
            }
    }
  },
  setup(props){
    const useStore = storeProductsManager();
    const fields = Object.keys(props.card);
    const columns = columnTypes;
    return {
        useStore,
        fields,
        columns,
    }
  },
    methods: {
      toggleEdit(){
        this.edit = !this.edit;
        this.afterEdit = true
      },
      toggleShowDetails(){
        this.showDetails = !this.showDetails;
      },
      notObject(item){
        return typeof item != 'object'
      },
      cardMousedown(e) {
        if (e.target.tagName === 'BUTTON') {return}
        if(!this.afterEdit){
          const self = this;
          setTimeout(()=>{
            self.move = true;
            
            const desk = this.useStore.deskRef;
            desk.addEventListener('mousemove', this.handler)


          },100)          
        } else {
          const self = this;
          setTimeout(()=>{
            self.afterEdit = false
          },100)
        }

      
      },
      cardMousemove(e){
        if (this.move && !this.edit && !this.afterEdit) {
          const card = this.$refs['card'];
          
          const resultTop = (card.offsetTop + e.movementY);
          const resultLeft = (card.offsetLeft + e.movementX);
          
          card.style.position = 'absolute';
          card.style.top = resultTop+'px';
          card.style.left = resultLeft+'px';
          
          this.cardPositionTop = resultTop + (card.offsetHeight / 2);
          this.cardPositionLeft = resultLeft + (card.offsetWidth / 2);
        }
        
      },
     async cardMouseup() {

       this.move = false       

        if(!this.edit && !this.afterEdit) {
          for(let i = 0;i<columnTypes.length;i++){
            const col = this.useStore[columnTypes[i].type+'Size']
           
            if(await this.checkColumn(col,this.cardPositionLeft,this.cardPositionTop)){
              if(this.currentColumn === columnTypes[i].type) 
              this.$emit('refresh')
              await this.changeColumn(this.currentColumn,columnTypes[i].type,this.card)
              return
            } 
          }
          this.$emit('refresh')
        }
      },
     async changeColumn(old,target,card){
        this.useStore[old] = this.useStore[old].filter(item=> item.id !== card.id)
        this.useStore[target].unshift(card)
      },
     async checkColumn(size, x, y){
        let trueTop = false;
        let trueLeft = false;
        if (size.top < y && size.top+size.height > y) trueTop = true
        if (size.left < x && size.left+size.width > x) trueLeft = true
        if(trueTop && trueLeft) return true
         
      },
      deleteCard(cardId) {
        this.useStore[this.currentColumn] = this.useStore[this.currentColumn].filter(item => item.id !== cardId)         
      }
    }
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  width: 300px;
  min-height: 100px;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 15px;
  background-color: #fff;
}
.card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 30px;
  padding: 5px 5px;
  border-radius: 5px;
  background-color: rgb(155, 219, 245);
}
.card__header-title {
  width: 60%;
  font-size: 14px;
}
.card__center {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card__img {
  width: 50px;
  height: 50px;
  margin: 5px auto;
}
.card__row {
  display: flex;
  font-size: 14px;
  font-weight: bold;
  margin: 5px;
  justify-content: space-between;    
  background-color: #fff;
  align-items: center;
}
.card__row-title {
  text-transform: capitalize;

}
.card__row-textarea {
  all: unset;
  box-sizing: content-box;
  width: 200px;
  /* min-height: 5px; */
  word-break: break-word;
  font-size: 10px;
  background-color: transparent;
  border: 1px solid lightgray
}
.card__rating {
  display: flex;
  align-items: center;
  margin-left: 5px;
}
.card__rate {
  font-size: 14px;
  margin-right: 5px;
  font-weight: bold;
}
.card__count {
  font-size: 12px;
}
.card__btn {
  all: unset;
  min-width: 10px;
  height: 20px;
  margin: 5px;
  padding: 0 5px;
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  color: #fff;
  font-family: Arial, Verdana, sans-serif;
  border-radius: 5px;
  background-color: rgb(42, 42, 255);
  box-shadow: 0px 0px 3px black;;
  cursor: pointer;
}
.card__btn:nth-child(2n) {
  margin-left: 5px;
}
</style>
