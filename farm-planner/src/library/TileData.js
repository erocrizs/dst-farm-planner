'use strict';

import PlotData from './PlotData';

export {TileData as default};

class TileData {
    plots = [];
    plotted = false;

    constructor (x, y) {
        this.x = x;
        this.y = y;
        for (let row = 0; row < 3; row++) {
            this.plots[row] = [];
            for (let col = 0; col < 3; col++) {
                this.plots[row][col] = new PlotData(row, col);
            }
        }
    }

    getPlot (x, y) {
        return this.plots[x][y];
    }

    plow () {
        this.plotted = true;
    }

    destroyPlots () {
        this.plotted = false;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                this.plots[row][col].destroy();
            }
        }
    }
}