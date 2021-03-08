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
  
  getTile (x, y) {
    return this.tiles[x][y]
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
}