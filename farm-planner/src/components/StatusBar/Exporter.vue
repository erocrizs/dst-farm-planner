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
        <SaveSlot
          v-for="summary in saveSummaries"
          :key="summary.index"
          :selected="selectedSlot === summary.index"
          :summary="summary"
          @click="selectSlot(summary.index)"
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
  props: ['fieldState', 'currentSeason'],
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
    },
    storeSummary (summary) {
      const {index, season} = summary
      const {summaries} = fetchJSON(keys.saveSummary, {})
      const filteredSummaries = (summaries || []).filter(e => e)

      let saved = false
      for (let listIndex in this.saveSummaries) {
        if (index === this.saveSummaries[listIndex].index) {
          this.saveSummaries[listIndex] = {index, season}
          saved = true
        }
      }

      if (!saved) {
        filteredSummaries.push({index, season})
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
      let summary;
      if (this.selectedSlot === 'new') {
        this.lastIndex++
        this.selectedSlot = this.lastIndex
        summary = {
          season: this.currentSeason,
          index: this.selectedSlot
        }
      }
      else {
        summary = {
          season: this.currentSeason,
          index: this.selectedSlot
        }
      }

      console.log(this.saveSummaries)
      
      const saveData = {
        index: this.selectedSlot,
        data: this.fieldState
      }

      const saves = fetchJSON(keys.saveData, {})
      saves[this.selectedSlot] = saveData
      saveJSON(keys.saveData, saves)
      this.storeSummary(summary)
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