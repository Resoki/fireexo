<template>
  <div>
    <select class="menu-select" v-model="selectedValue" @change="handleSelectChange">
      <option disabled hidden value="">{{trad}}</option>
      <option v-for="(option, index) in options" :key="index" :value="option.value">{{ option.label }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'SelectComponent',
  props: {
    options: Array,
    trad: String
  },
  data() {
    return {
      selectedValue: ''
    };
  },
  methods: {
   handleSelectChange() {
      // Emit the selected value to the parent component
      this.$emit('update:probaProps', this.selectedValue);
    }
  }
}
</script>
<style scoped>
.menu-select {
  width: 200px;
  height: 30px;
  border-radius: 10px;
  color: black;
}

select {
  margin-right: 10px;
  cursor: pointer;
}

option {
  cursor: pointer;
}
</style>
