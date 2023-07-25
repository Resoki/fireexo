<template>
  <div>
    <div class="">
    <p>{{message}}</p>
    <select class="menu-select" v-model="probaProps" @change="switchValueSelect()">
      <option disabled value="">Choose Force Fire Propagation</option>
      <option value="min">Minimum</option>
      <option value="moy">Moyen</option>
      <option value="max">Maximum</option>
    </select><br>
    <button v-if="!isBurningGrid" @click="firePropagation()">
      <img class="img-button" src="../../public/images/fireicon.png"/>
      Launch
    </button>
     <div v-if="isBurningGrid || isFinish"  class="board">
      <div class="menu">
        <p>Temps écoulé : <b>{{ msToS() }} seconds</b></p>
        <p>Arbres brûlés: <b>{{ countBurnedTree}}</b></p>
        <p>Pourcentage brûlés: <b>{{ pourcentageBurned() }}%</b></p>
      </div>
    </div>
    <button class="btnrules" @click="seeRules">
       <img class="img-button" src="../../public/images/book.png"/>
       See rules
    </button>
    <PopupRules v-if="isOpenPopupRules" @closePopupEvent="closePopup"/>
    </div>
    <p v-if="probaProps">Chance of Propagation = <b>{{probabilityOfPropagation*100}}%</b></p>
    <div class="grid">
      <div v-for="(row, rowIndex) in grid" :key="rowIndex">
          <CaseComponent 
            v-for="(cell, colIndex) in row" 
            :key="colIndex"
            :image="generateImage(cell)" 
            :isBurning="cell.isBurning" 
            :isAsh="cell.isAsh" 
          />
      </div>
    </div>
  </div>
</template>

<script>
// Components
import CaseComponent from '@/components/CaseComponent.vue';
import PopupRules from '@/components/PopupRules.vue';

// Config
import config from '../config.json';

export default {
  name: 'GridComponent',
  components: { CaseComponent, PopupRules },
  data() {
    return {
      grid: [],
      isBurningGrid: false,
      isFinish: false,
      isOpenPopupRules: false,
      elapsedTime: 0,
      countBurnedTree: 0,
      timer: 0,
      probabilityOfPropagation: config.probabilityOfPropagation,
      probaProps: '',
      message: ''
    }
  },
  created() {
    this.generateInitialState();
  },
  methods: {
    switchValueSelect() {
      if(this.message.length) {
        this.message = '';
      }
      if(this.probaProps === "min") return this.probabilityOfPropagation = 0.25;
      if(this.probaProps === "moy") return this.probabilityOfPropagation = 0.50;
      if(this.probaProps === "max") return this.probabilityOfPropagation = 1;
    },
    seeRules(){
      this.isOpenPopupRules = !this.isOpenPopupRules;
    },
    closePopup() {
      this.isOpenPopupRules = false;
    },
    startTimer() {
      this.startTime = Date.now();
      this.timer = setInterval(() => this.elapsedTime = Date.now() - this.startTime, 100);
    },
    clearTimer() {
      clearInterval(this.timer);
    },
    msToS() {
      return parseInt(this.elapsedTime /1000);
    },
    pourcentageBurned() {
      return ((this.countBurnedTree / 81) * 100).toFixed(2);
    },
    getRandomBoolean(probability) {
      return Math.random() < probability;
    },
    generateImage(cell) {
      if(cell.isBurning) return '../../images/fire.png';
      if(cell.isAsh) return '../../images/ash.png';
      return '../../images/tree.png';
    },
    generateInitialState() {
      this.countBurnedTree = 0;
      // Créer une grille vide
      this.grid = Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => ({ isBurning: false, isAsh: false }))
      );

      // Génère la première case en feu, tiré aléatoirement
      const rd = Math.random();
      const rd1 = Math.floor(rd * (9 - 1)) + 1;
      const rd2 = Math.floor(rd * (9 - 1)) + 1;

      this.grid[rd1][rd2].isBurning = true;
      this.countBurnedTree += 1
    },
    firePropagation() {
      if(!this.probaProps) {
        return this.message = "You must choose an option";
      }
      this.isFinish = false;
      if(!this.isBurningGrid) {
        this.generateInitialState();
        this.startTimer(); // Démarrer le chronomètre lorsque la propagation commence
      }
      this.isBurningGrid = true;
      // Utilisez requestAnimationFrame pour effectuer la propagation à chaque étape
      requestAnimationFrame(() => {
        let changedCells = [];
        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            if (this.grid[row][col].isBurning) {
              this.grid[row][col].isBurning = false;
              this.grid[row][col].isAsh = true;
              if (row > 0) changedCells.push({ row: row - 1, col }); // Cellule au-dessus
              if (row < 8) changedCells.push({ row: row + 1, col }); // Cellule en-dessous
              if (col > 0) changedCells.push({ row, col: col - 1 }); // Cellule à gauche
              if (col < 8) changedCells.push({ row, col: col + 1 }); // Cellule à droite
            }
          }
        }

        // Mettez à jour l'état des cellules adjacentes qui ont changé
        for (const cell of changedCells) {
          const { row, col } = cell;
          if (row >= 0 && row < 9 && col >= 0 && col < 9 && !this.grid[row][col].isBurning && !this.grid[row][col].isAsh) {
            this.grid[row][col].isBurning = this.getRandomBoolean(this.probabilityOfPropagation);
            if( this.grid[row][col].isBurning) this.countBurnedTree ++;
          }
        }

        // Vérifiez si la simulation est terminée (plus aucune case en feu)
        if (!this.grid.some(row => row.some(cell => cell.isBurning))) {
          this.isBurningGrid = false;
          this.isFinish = true;
          this.clearTimer();
          return;
        }

        // Continuez la propagation à la prochaine étape
        setTimeout(()=> this.firePropagation(), 1200);
      });
  }
  }
}
</script>
<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  margin: 10%;
  margin-top: 4px;
  border: 2px solid black;
  border-radius: 8px;
  background-color: #42b983 !important;
}

.board {
  background-color: #f0f0f0;
  border: 3px solid orange;
  border-radius: 5px;
  padding: 10px;
  margin-top: 10px !important;
  width: 200px;
  margin: 0 auto;
}

select {
  margin-right: 10px;
  cursor: pointer;
}

option {
  cursor: pointer;
}

.menu {
  font-family: Arial, sans-serif;
  font-size: 16px;
}

.main {
  display: flex;
  justify-content: center;
  align-items: center;
}
.menu p {
  margin: 5px 0;
}

.menu b {
  font-weight: bold;
}

.menu-select {
  width: 200px;
  height: 30px;
  border-radius: 10px;
}

button {
  width: 200px;
  height: 45px;
  background-color: #42b983;
  border-radius: 10px;
  margin-top: 10px !important;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

button:hover {
  cursor: pointer;
  width: 240px;
  height: 50px;
  transition: 0.3s;
  background-color: #6cd0a3;
  font-weight: bold;
}

.btnrules {
  margin-left: 10px;
  margin: 0 auto;
  margin-top: 10px;
}

.img-button {
  width: 36px;
}

</style>
