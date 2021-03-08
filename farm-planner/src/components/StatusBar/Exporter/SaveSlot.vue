<template>
  <div 
    class="save-slot"
    :class="{'selected-slot': selected}" @click="emitClick">
    <div class="save-details">
      <img class="save-icon brown-icon" :src="imgSrc" />
      <div class="save-name">{{name || 'Unnamed Save'}}</div>
    </div>
    <div v-if="deletable" style="text-align: right;">
      <div class="save-delete" @click.stop="deleteSave">Delete</div>
    </div>
  </div>
</template>

<script>
import seasons from '@/library/seasons'

export default {
  name: 'SaveSlot',
  props: ['selected', 'name', 'season', 'deletable'],
  data () {
    return {}
  },
  methods: {
    emitClick () {
      this.$emit('click')
    },
    deleteSave () {
      this.$emit('delete')
    }
  },
  computed: {
    imgSrc () {
      return './static/' + seasons[this.season].symbol
    }
  }
}
</script>

<style scoped>
.save-details {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
}

.save-details .save-icon {
  height: 1.2em;
  width: 1.2em;
  margin-right: 10px;
}

.save-details .save-name {
  font-size: 0.8em;
  flex-grow: 1;
  min-height: 100%;
}

.save-delete {
  display: inline;
  font-size: 0.5em;
  color: rgb(83, 13, 13);
}

.save-delete:hover {
  color: rgb(136, 22, 22);
}
</style>