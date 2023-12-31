<template>
  <div>
    <p>{{message}}</p>
   <SelectComponent
    v-if="!isBurningGrid" 
    :probaProps="probaProps" 
    :options="options" 
    :trad="tradChooseForce" 
    @update:probaProps="switchValueSelect" 
  />
  <div class="btns">
    <button v-if="!isBurningGrid" class="btnrules" @click="seeRules">
      <img class="img-button" src="../../public/images/book.png"/>
      {{ $t('rules') }}
    </button>
    <button v-if="!isBurningGrid" @click="firePropagation()">
      <img class="img-button" src="../../public/images/fireicon.png"/>
      {{ $t('launch') }}
    </button>
  </div>
    <BoardComponent 
       v-if="(isBurningGrid || isFinish) && isDisplayedBoard"
      :options="optionsBoard"
      :title="$t('forceFirePropagation') + probaProps"
      @closePopupEvent="closePopupBoard"
      :isDisplayedCross="!isBurningGrid ? true : false"
    />
    <PopupComponent 
      v-if="isOpenPopupRules" 
      @closePopupEvent="closePopup" 
      :title="$t('rules')" 
      :content="$t('rules_content')"
    />
    <p class="chance-propa" v-if="probaProps">Chance of Propagation = <img class="chance-propa-img" :src="generateLinkImgChance()" /> <b>%</b>
    </p>
    <h3 v-if="isBurningGrid" class="burning-grid-text">
      {{ $t('isBurningGrid') }}
    </h3>
    <button class="reset-grid" v-if="isFinish" @click="resetGrid()">
      <img class="img-button" src="../../public/images/reset.png"/>
      Reset Grid
    </button>
    <div :class="getCssClassGrid()">
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
import PopupComponent from '@/components/PopupComponent.vue';
import SelectComponent from '@/components/SelectComponent.vue';
import BoardComponent from '@/components/BoardComponent.vue'; 

// Config
import config from '../config.json';

export default {
  name: 'GridComponent',
  components: { CaseComponent, PopupComponent, SelectComponent, BoardComponent },
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
      message: '',
      options: [
        { label: 'Minimum', value: 'min' },
        { label: 'Medium', value: 'moy' },
        { label: 'Maximum', value: 'max' }
      ],
      optionsBoard: [],
      tradChooseForce: this.$t('msgChoosePropagation'),
      isDisplayedBoard: false
    }
  },
  created() {
    this.generateInitialState();
  }, 
  methods: {
    getCssClassGrid(){
      if(this.isBurningGrid) return 'grid is-burning-grid'
      return 'grid';
    },
    generateLinkImgChance() {
      if(this.probaProps === 'min') return 'images/25.png';
      if(this.probaProps === 'moy') return 'images/50.png';
      if(this.probaProps === 'max') return 'images/100.png';
    },
    resetGrid() {
        this.grid = Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => ({ isBurning: false, isAsh: false }))
      );
      this.isFinish = false;
    },
    switchValueSelect(proba) {
      if(this.message.length) {
        this.message = '';
      }
      this.probaProps = proba;
      if(proba === "min") return this.probabilityOfPropagation = 0.25;
      if(proba === "moy") return this.probabilityOfPropagation = 0.50;
      if(proba === "max") return this.probabilityOfPropagation = 1;
    },
    seeRules(){
      this.isOpenPopupRules = !this.isOpenPopupRules;
    },
    closePopup() {
      this.isOpenPopupRules = false;
    },
    closePopupBoard() {
      this.isDisplayedBoard = false;
      console.log('set false');
    },
    startTimer() {
      this.startTime = Date.now();
      this.timer = setInterval(() => this.elapsedTime = Date.now() - this.startTime, 100);
    },
    clearTimer() {
      clearInterval(this.timer);
    },
    stopFirePropagation() {
      this.clearTimer();
      this.isFinish = true;
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
       this.optionsBoard = [
        { label:  this.$t('elapsedTime') , value: `${this.msToS() + this.$t('seconds')}` },
        { label: this.$t('burnedTree'), value: this.countBurnedTree },
        { label: this.$t('burnedPercentage'), value: this.pourcentageBurned() + ' %' }
      ]
      if(!this.probaProps) {
        return this.message = this.$t('msgChoosePropagation') ;
      }
      this.isFinish = false;
      if(!this.isBurningGrid) {
        this.generateInitialState();
        this.startTimer(); // Démarrer le chronomètre lorsque la propagation commence
      }
      this.isBurningGrid = true;
      this.isDisplayedBoard = true;
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
  grid-template-columns: repeat(auto-fit, minmax(30px, 1fr));
  gap: 4px;
  margin: 2%;
  margin-top: 4px;
  border: 2px solid black;
  border-radius: 10px;
  background-color: #42b983 !important;
}

.chance-propa {
  display: flex;
  justify-content: center;
  align-items: center;
}

.chance-propa-img {
  width: 40px;
  height: 40px;
}

.burning-grid-text {
  font-size: 28px;
  animation: changeColor 1s infinite alternate; /* Utilisation de l'animation "changeColor" avec un effet infini et en alternance */
  color: red; /* Couleur initiale du texte */
}

.is-burning-grid {
  border: 5px solid red;
  animation: changeColorBorder 1s infinite alternate;
}

@keyframes changeColorBorder {
  0% { border-color: red; } /* Étape de départ de l'animation */
  50% { border-color: orange; } /* Couleur à mi-chemin de l'animation */
  100% { border-color: red; } /* Étape finale de l'animation, revenir à la couleur initiale */
}

@keyframes changeColor {
  0% { color: red; } /* Étape de départ de l'animation */
  50% { color: orange; } /* Couleur à mi-chemin de l'animation */
  100% { color: red; } /* Étape finale de l'animation, revenir à la couleur initiale */
}

/* Add a rule for smaller screens (up to 768px width) */
@media screen and (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(30px, 1fr));
  }
}

/* Add a rule for even smaller screens (up to 480px width) */
@media screen and (max-width: 480px) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(30px, 1fr));
  }
}

.main {
  display: flex;
  justify-content: center;
  align-items: center;
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
  color: white;
  font-weight: 700;
}

.btns {
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
