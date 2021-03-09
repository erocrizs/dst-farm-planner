'use strict'

export {PlotData as default}

class PlotData {
  growthFormula = null
  compost = null
  manure = null

  family = null

  season = null

  constructor (x, y) {
    this.x = x
    this.y = y
    this.crop = null
  }
  
  plant (crop) {
    this.crop = crop
  }

  destroy () {
    this.crop = null
  }
}