<template>
  <div 
    class="save-slot"
    :class="{'selected-slot': selected}" @click="emitClick">
    <div class="save-details">
      <img class="save-icon brown-icon" :src="imgSrc" />
      <div class="save-name">{{name || 'Unnamed Save'}}</div>
    </div>
    <div class="save-footer">
      <div class="save-time">{{timeString}}</div>
      <div 
        v-if="deletable"
        class="save-delete"
        @click.stop="deleteSave">
        Delete
      </div>
    </div>
  </div>
</template>

<script>
import seasons from '@/library/seasons'
import {getResourcePath} from '@/library/util'

export default {
  name: 'SaveSlot',
  props: ['selected', 'name', 'season', 'time', 'deletable'],
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
      return getResourcePath(seasons[this.season].symbol)
    },
    timeString () {
      return new Date(this.time).toLocaleString()
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
  margin-bottom: 5px;
}

.save-details .save-name {
  font-size: 0.8em;
  flex-grow: 1;
  min-height: 100%;
}

.save-footer {
  font-size: 0.5em;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
}

.save-footer .save-time {
  flex-grow: 1;
}

.save-footer .save-delete {
  color: rgb(83, 13, 13);
}

.save-footer .save-delete:hover {
  color: rgb(136, 22, 22);
}
</style>