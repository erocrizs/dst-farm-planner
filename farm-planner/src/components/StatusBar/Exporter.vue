<template>
  <div id="exporter" class="column-flex remaining-height">
    <div class="section-header">
      Export
    </div>
    <div id="link-share">
      <label id="link-share-label">
        Export as JSON File
      </label>
      <button
        type="button"
        @click="downloadFieldState">
        Download
      </button>
      
    </div>

    <hr class="section-divider"/>

    <div class="section-header">
      Save in Browser
    </div>

    <div id="local-save" class="column-flex remaining-height">
      <div id="save-slot-list" class="column-flex remaining-height">
        <SaveSlot :selected="false"/>
        <div id="new-save-slot" 
          :class="{'selected-slot': selectedSlot === 'new'}"
          @click="selectSlot('new')">
          + New Save
        </div>
      </div>
      <button
        :disabled="!selectedSlot"
        type="button">
        Save
      </button>
    </div>
  </div>
</template>

<script>
import SaveSlot from './Exporter/SaveSlot'

export default {
  name: 'Exporter',
  props: ['fieldState'],
  components: {SaveSlot},
  data () {
    return {
      selectedSlot: null
    }
  },
  methods: {
    downloadFieldState () {
      const fieldStateString = JSON.stringify(this.fieldState)
      const blob = new Blob([fieldStateString], {type: 'application/json'})
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'test.json'
      document.body.appendChild(a)
      a.click()
      setTimeout(
        () => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);  
        },
        0
      )
    },
    selectSlot (slotIndex) {
      if (slotIndex === this.selectedSlot) {
        this.selectedSlot = null
        return
      }

      this.selectedSlot = slotIndex
    }
  }
}
</script>

<style scoped>
#link-share {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 0.8em;
}

#link-share-label {
  display: block;
  margin-bottom: 10px;
}

button {
  display: block;
  padding: 5px;
  font-size: 1em;
  width: 100%;
  font-weight: bolder;
  font-family: belisa_plumilla;
  border-color: #48321f;
  background-color: #caa76a;
}

button:not([disabled]):hover {
  background-color: #efc67f;
}

#save-slot-list {
  flex-grow: 1;
  margin-bottom: 10px;
}

#save-slot-list > div {
  margin-bottom: 10px;
  border-left: 5px solid #342517;
  padding: 5px;
  user-select: none;
}

#save-slot-list > div:hover {
  background-color: #cccccc88;
}

#save-slot-list > div.selected-slot {
  border-left: 5px solid #ccc;
}

#local-save button {
  flex-grow: 0;
}
</style>