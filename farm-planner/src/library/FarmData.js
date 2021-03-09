'use strict'

import TileData from './TileData'

export {FarmData as default}

class FarmData {
  tiles = null
  
  constructor (width, height, season) {
    this.width = width
    this.height = height
    this.season = season
    this.tiles = new Array(height)
    
    for (let row = 0; row < height; row++) {
      this.tiles[row] = new Array(width)
      for (let col = 0; col < width; col++) {
        this.tiles[row][col] = new TileData(col, row)
      }
    }
  }
  
  getTile (col, row) {
    return this.tiles[row][col]
  }
  
  get tileList () {
    return this.tiles.reduce((acc, tileRow) => acc.concat(tileRow))
  }  

  toJSON () {
    const tiles = {}

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        if (this.tiles[row][col].plotted) {
          tiles[`${col},${row}`] = this.tiles[row][col].toJSON()
        }
      }
    }

    return {
      width: this.width,
      height: this.height,
      season: this.season,
      tiles
    }
  }

  get seedUsed () {
    const tally = {}

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const tile = this.tiles[row][col]
        
        if (!tile.plotted) {
          continue
        }

        const tileSeeds = tile.seedUsed

        for (let cropName in tileSeeds) {
          tally[cropName] = (tally[cropName] || 0) + tileSeeds[cropName]
        }
      }
    }

    return tally
  }

  get optimalYield () {
    const tally = {}

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const tile = this.tiles[row][col]
        
        if (!tile.plotted) {
          continue
        }

        const tileYield = tile.getOptimalYield(this.season)

        for (let cropName in tileYield) {
          let cropTally = tally[cropName]

          if (!cropTally) {
            cropTally = {crop: 0, seed: 0}
            tally[cropName] = cropTally
          }

          cropTally.crop += tileYield[cropName].crop
          cropTally.seed += tileYield[cropName].seed
        }
      }
    }

    return tally
  }

  inspectReport () {
    return {
      seeds: this.seedUsed,
      yield: this.optimalYield
    }
  }

  debugLog () {
    console.log('==============INSPECT=FARM!==============')
    
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const tile = this.tiles[row][col]
        
        if (!tile.plotted) {
          continue
        }

        tile.debugLog(this.season)
      }
    }

    console.log('-----------------OVERALL-----------------')
    console.log(this.inspectReport())
  }
}