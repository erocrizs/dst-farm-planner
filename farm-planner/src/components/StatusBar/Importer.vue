<template>
  <div id="importer" class="column-flex remaining-height">
    <div class="section-header">
      Import
    </div>
    <div id="file-import">
      <div id="file-import-label">
        Import a JSON File
      </div>
      <label
        for="file-upload"
        id="file-import-button">
        Upload
      </label>
      <input id="file-upload"
        type="file"
        accept="application/JSON"
        @change="uploadFieldState"/>
    </div>

    <hr class="section-divider"/>

    <div class="section-header">
      Load from Browser
    </div>

    <div id="local-load" class="column-flex remaining-height">
      <div id="load-slot-list" class="column-flex remaining-height">
        <SaveSlot
          v-for="summary in saveSummaries"
          :key="summary.index"
          :selected="selectedSlot === summary.index"
          :name="summary.name"
          :season="summary.season"
          :time="summary.time"
          :deletable="false"
          @click="selectSlot(summary.index)"
          />
      </div>
      <button
        :disabled="!selectedSlot"
        type="button"
        @click="loadSavedState">
        Load
      </button>
    </div>
  </div>
</template>

<script>
import SaveSlot from './Exporter/SaveSlot'
import {fetchJSON, keys} from '@/library/storage'
import {verifyFieldState} from '@/library/util'

export default {
  name: 'Importer',
  props: ['fieldState', 'currentSeason', 'farmName'],
  components: {SaveSlot},
  data () {
    const {summaries} = fetchJSON(keys.saveSummary, {})
    return {
      selectedSlot: null,
      saveSummaries: (summaries || []).filter(e => e)
    }
  },
  methods: {
    uploadFieldState (uploadEvent) {
      const [file] = uploadEvent.target.files
      const reader = new FileReader()
      reader.onload = () => {
        const raw = reader.result
        let formatted

        try {
          formatted = JSON.parse(raw)
          if (!verifyFieldState(formatted)) {
            throw new Error('Invalid savefile format')
          }
        }
        catch (e) {
          alert('Imported file is invalid')
          console.error(e)
          return
        }

        this.loadState(formatted, null)
      }

      if (file) {
        reader.readAsText(file)
      }
    },
    selectSlot (slotIndex) {
      if (slotIndex === this.selectedSlot) {
        this.selectedSlot = null
        return
      }

      this.selectedSlot = slotIndex
    },
    fetchSaveSummary () {
      for (let listIndex in this.saveSummaries) {
        if (this.selectedSlot === this.saveSummaries[listIndex].index) {
          return this.saveSummaries[listIndex]
        }
      }
    },
    loadSavedState () {
      if (!this.selectedSlot) {
        return
      }
      
      const saves = fetchJSON(keys.saveData, {})
      const summary = this.fetchSaveSummary()

      if (!saves[this.selectedSlot]) {
        return
      }

      this.loadState(
        saves[this.selectedSlot].data,
        summary
      )
    },
    loadState (fieldState, saveSummary) {
      this.$emit('loadSave', fieldState, saveSummary)
    }
  }
}
</script>

<style scoped>
#file-import {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 0.8em;
}

#file-import-label {
  display: block;
  margin-bottom: 10px;
}

#file-upload {
  display: none;
}

#file-import-button, button {
  display: block;
  padding: 5px;
  font-size: 1em;
  font-weight: bolder;
  font-family: belisa_plumilla;
  border: 2px solid #48321f;
  background-color: #caa76a;
}

button:not([disabled]):hover, #file-import-button:hover {
  background-color: #efc67f;
}

#load-slot-list {
  flex-grow: 1;
  margin-bottom: 10px;
}

#load-slot-list > div {
  margin-bottom: 10px;
  border-left: 5px solid #342517;
  padding: 5px;
  padding-left: 10px;
  user-select: none;
}

#load-slot-list > div:hover {
  background-color: #cccccc88;
}

#load-slot-list > div.selected-slot {
  border-left: 5px solid #ccc;
}

#local-load button {
  flex-grow: 0;
}
</style>