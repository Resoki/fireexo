<template>
  <div class="popup-overlay">
    <div class="popup-content">
      <h2> {{title}}</h2>
      <p>{{content}}</p>
      <button @click="closePopup">Fermer</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopupRules',
  props: {
    title: String,
    content: String
  },
  methods: {
    closePopup() {
      this.$emit('closePopupEvent');
    }
  }
}
</script>

<style scoped>
.img-button {
    width: 46px;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8); /* Fond semi-transparent */
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  max-width: 80%;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
}

.popup-content h2 {
  margin-bottom: 10px;
}

.popup-content p {
  margin-bottom: 20px;
}

.popup-content button {
  background-color: #007BFF;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
