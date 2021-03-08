<template>
  <div id="exporter" class="column-flex remaining-height">
    <div class="section-header">
      Export
    </div>
    <div id="file-export">
      <label id="file-export-label">
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
        <SaveSlot
          v-for="summary in saveSummaries"
          :key="summary.index"
          :selected="selectedSlot === summary.index"
          :name="summary.name"
          :season="summary.season"
          :time="summary.time"
          :deletable="true"
          @click="selectSlot(summary.index)"
          @delete="deleteSave(summary)"
          />
        <div id="new-save-slot" 
          :class="{'selected-slot': selectedSlot === 'new'}"
          @click="selectSlot('new')">
          + New Save
        </div>
      </div>
      <button
        :disabled="!selectedSlot"
        type="button"
        @click="saveState">
        Save
      </button>
    </div>
  </div>
</template>

<script>
import SaveSlot from './Exporter/SaveSlot'
import {saveJSON, fetchJSON, keys} from '@/library/storage'

export default {
  name: 'Exporter',
  props: ['fieldState', 'currentSeason', 'farmName'],
  components: {SaveSlot},
  data () {
    const {summaries, lastIndex} = fetchJSON(keys.saveSummary, {})
    return {
      selectedSlot: null,
      saveSummaries: (summaries || []).filter(e => e),
      lastIndex: lastIndex || 0
    }
  },
  methods: {
    downloadFieldState () {
      const fieldStateString = JSON.stringify(this.fieldState)
      const blob = new Blob([fieldStateString], {type: 'application/json'})
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${this.farmName}.json`
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
    },
    storeSummary () {
      const summary = {
          name: this.farmName,
          season: this.currentSeason,
          index: this.selectedSlot,
          time: new Date().getTime()
      }
      const {summaries} = fetchJSON(keys.saveSummary, {})
      const filteredSummaries = (summaries || []).filter(e => e)

      let saved = false
      for (let listIndex in filteredSummaries) {
        if (this.selectedSlot === filteredSummaries[listIndex].index) {
          filteredSummaries[listIndex] = summary
          saved = true
        }
      }

      if (!saved) {
        filteredSummaries.push(summary)
      }

      saveJSON(
        keys.saveSummary,
        {
          summaries: filteredSummaries,
          lastIndex: this.lastIndex
        }
      )

      this.saveSummaries = filteredSummaries
    },
    saveState () {
      if (this.selectedSlot === 'new') {
        this.lastIndex++
        this.selectedSlot = this.lastIndex
      }
      
      const saveData = {
        index: this.selectedSlot,
        data: this.fieldState
      }

      const saves = fetchJSON(keys.saveData, {})
      saves[this.selectedSlot] = saveData
      saveJSON(keys.saveData, saves)
      this.storeSummary()
    },
    deleteSave (summary) {
      const saveName = summary.name
      const saveIndex = summary.index
      if (this.selectedSlot === saveIndex) {
        this.selectedSlot = null
      }

      const continueDelete = confirm(
        `Are you sure you want to delete your save "${saveName}"?`
      )

      if (!continueDelete) {
        return
      }

      for (let listIndex in this.saveSummaries) {
        if (saveIndex === this.saveSummaries[listIndex].index) {
          this.saveSummaries.splice(listIndex, 1)
          break
        }
      }

      saveJSON(
        keys.saveSummary,
        {
          summaries: this.saveSummaries,
          lastIndex: this.lastIndex
        }
      )

      const saves = fetchJSON(keys.saveData, {})
      delete saves[saveIndex]
      saveJSON(keys.saveData, saves)
    }
  }
}
</script>

<style scoped>
#file-export {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 0.8em;
}

#file-export-label {
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