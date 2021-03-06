'use strict'

import TileData from './TileData'

export {FarmData as default}

class FarmData {
  tiles = null
  
  constructor (height, width) {
    this.width = width
    this.height = height
    this.tiles = new Array(height)
    
    for (let row = 0; row < height; row++) {
      this.tiles[row] = new Array(width)
      for (let col = 0; col < width; col++) {
        this.tiles[row][col] = new TileData(row, col)
      }
    }
  }
  
  getTile (x, y) {
    return this.tiles[x][y]
  }
  
  get tileList () {
    return this.tiles.reduce((acc, tileRow) => acc.concat(tileRow))
  }
}