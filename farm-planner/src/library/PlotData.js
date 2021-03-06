'use strict'

export {PlotData as default}

class PlotData {
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