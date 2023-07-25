<template>
   <div :class="getCssClass()">
    <img class="img-case" :src="image" />
  </div>
</template>

<script>
export default {
  name: 'CaseComponent',
  props: {
    isBurning: Boolean,
    isAsh: Boolean,
    image: String
  },
  methods: {
    getCssClass() {
      return this.isBurning ? 'is-burning flex-size' : this.isAsh ? 'is-ash flex-size' : 'case flex-size';
    }
  }
}
</script>

<style scoped>
.img-case {
  width: 50px;
}

.flex-size {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
}

.is-burning {
  background: none !important;
}

.is-ash {
  background: none;
}

.case {
  background: #42b983 !important;
}
</style>
