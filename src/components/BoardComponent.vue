<template>
    <div class="board">
      <div class="menu">
        <p v-for="(option, index) in options" :key="index" :value="option.value">{{ option.label }} {{option.value}}</p>
      </div>
    </div>
</template>


<script>
export default {
  name: 'BoardComponent',
  props: {
    options: Array,
  },
  methods: {
    closePopup() {
      this.$emit('closePopupEvent');
    }
  }
}
</script>

<style scoped>
.board {
  background-color: #f0f0f0;
  border: 3px solid orange;
  border-radius: 5px;
  padding: 10px;
  margin-top: 10px !important;
  width: 200px;
  margin: 0 auto;
}

.menu {
  font-family: Arial, sans-serif;
  font-size: 16px;
}

.menu p {
  margin: 5px 0;
}

.menu b {
  font-weight: bold;
}

</style>
