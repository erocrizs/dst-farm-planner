<template>
  <div id="startup" :style="seasonalBgImage">
    <div id="startup-box">
      <h2>Create your farm!</h2>
      <div id="create-farm-form">
        <div id="width-field" class="dim-field">
          <label class="dim-field-label">Columns:</label>
          <input
            required
            ref="widthForm"
            type="number"
            step="1"
            class="dim-field-input"
            :min="minSize"
            :max="maxSize"
            v-model="inputWidth"
            />
          <p v-if="inputWidthError" class="dim-field-error">
            {{inputWidthError}}
          </p>
        </div>
        <div id="height-field" class="dim-field">
          <label class="dim-field-label">Rows:</label>
          <input
            required
            ref="heightForm"
            type="number"
            step="1"
            class="dim-field-input"
            :min="minSize"
            :max="maxSize"
            v-model="inputHeight"
            />
          <p v-if="inputHeightError" class="dim-field-error">
            {{inputHeightError}}
          </p>
        </div>
        <button
          id="dim-submit"
          type="button"
          @click="submitSize">
          START
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import seasons from '@/library/seasons'
import field from '@/library/field'
import {isInteger, valueBetweenInclusive} from '@/library/util'

export default {
  name: 'Startup',
  props: ['width', 'height', 'season'],
  data () {
    const minSize = field.minFarmSize;
    const maxSize = field.maxFarmSize;
    return {
      tiles: {},
      inputWidth: `${field.defaultTileCols}`, // input v-model must be string
      inputHeight: `${field.defaultTileRows}`,
      inputWidthError: null,
      inputHeightError: null,
      minSize,
      maxSize
    }
  },
  methods: {
    submitSize () {
      this.inputWidthError = null
      this.inputHeightError = null
      

      this.inputWidthError = this.getDimensionInputError(+this.inputWidth)
      this.inputHeightError = this.getDimensionInputError(+this.inputHeight)

      if (this.inputWidthError || this.inputHeightError) {
        return
      }

      const fieldData = {
        width: +this.inputWidth,
        height: +this.inputHeight,
        season: this.season,
        tiles: {}
      }

      this.$emit('finishSetup', fieldData)
    },
    getDimensionInputError (inputDim) {
      let error = null

      if (!isInteger(inputDim)) {
        error = 'Must be an integer'
      }
      else if (!valueBetweenInclusive(inputDim, this.minSize, this.maxSize)) {
        error = `Must be between ${this.minSize} and ${this.maxSize}`
      }

      return error
    }
  },
  computed: {
    seasonalBgImage () {
      const {turf} = seasons[this.season]
      return {
        backgroundImage: `url(../static/${turf})`,
        backgroundSize: '768px',
        backgroundRepeat: 'repeat',
        transition: 'background-image 0.5s ease-in-out'
      }
    }
  }
}
</script>

<style scoped>
#startup {
  height: 100%;
  position: relative;
}

#startup-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  box-sizing: border-box;
  width: 350px;
  max-width: calc(100vw - 30px);
  border: ridge #48321f;
  border-width: 4px;
  padding: 15px;
  background-color: #9b7b5d;

  font-size: 0.75em;
  color: #342517;
}

#startup-box h2 {
  margin: 10px;
  text-align: center;
  font-family: belisa_plumilla;
}

.dim-field {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
}

.dim-field .dim-field-label {
  flex: 0 0 80px;
  text-align: right;
  margin-right: 10px;
}

.dim-field .dim-field-input {
  flex: 0 0 50px;

  font-family: inherit;
  font-size: inherit;
  color: inherit;
  font-weight: bold;
  background-color: transparent;
  border: 0px;
  border-bottom: 2px solid;
  text-align: right;
}

.dim-field .dim-field-error {
  flex-grow: 1;
  color: rgb(83, 13, 13);
  font-size: 0.8em;
  text-align: right;
  margin: 0px;
}

#dim-submit {
  display: block;
  width: 100%;
  padding: 15px;
  font-size: 1em;
  font-weight: bolder;
  font-family: belisa_plumilla;
  border-color: #48321f;
  background-color: #caa76a;
  letter-spacing: 5px;
}

#dim-submit:hover {
  background-color: #efc67f;
}
</style>