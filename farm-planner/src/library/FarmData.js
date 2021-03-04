'use strict';

import TileData from './TileData';

export {FarmData as default};

class FarmData {
    tiles = [];

    constructor (height, width) {
        this.width = width;
        this.height = height;

        for (let row = 0; row < height; row++) {
            this.tiles[row] = [];
            for (let col = 0; col < width; col++) {
                this.tiles[row][col] = new TileData(row, col);
            }
        }
    }

    getTile (x, y) {
        return this.tiles[x][y];
    }
}