<template>
  <div class="board">
    <div v-if="isDisplayedCross" class="close-btn" @click="closePopup">×</div>
    <h2 class="title">{{ title }}</h2>
    <table class="statistic-table">
      <tr v-for="(option, index) in options" :key="index">
        <td class="label">{{ option.label }}:</td>
        <td class="value">{{ option.value }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'BoardComponent',
  props: {
    options: Array,
    title: String,
    isDisplayedCross: Boolean
  },
  methods: {
    closePopup() {
      this.$emit('closePopupEvent');
    },
  },
};
</script>

<style scoped>
.board {
  position: relative;
  background-color: #f0f0f0;
  border: 3px solid orange;
  border-radius: 40px;
  padding: 10px;
  margin-top: 10px !important;
  width: 225px;
  margin: 0 auto;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 32px;
  font-weight: bold;
  cursor: pointer;
  color: rgb(214, 85, 85);
}

.close-btn:hover {
    color: red;
}

.title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.statistic-table {
  width: 100%;
  border-collapse: collapse;
}

tr {
  border-bottom: 1px solid #ddd;
}

td {
  padding: 8px;
}

.label {
  font-weight: bold;
}

.value {
  color: #0066cc; /* Couleur pour la valeur de la statistique */
}

</style>
