'use strict'

export default {    
  plotSizePx: 50,
  plotRowsPerTile: 3,
  plotColsPerTile: 3,
  defaultTileRows: 5,
  defaultTileCols: 5,
  defaultSeason: 'autumn',
  minFarmSize: 1,
  maxFarmSize: 10,
  cropBasis: {
    plant: 'asparagus',
    giant: 'garlic'
  },
  minimumFamily: 3,
  maxNeighborDistance: 3.1,
  plantGrowthStages: 5,
  cropYieldTiers: [
    {
      minStress: 0,
      maxStress: 1,
      cropYield: 2.75,
      seedYield: 2.25,
      remark: 'giant'
    },
    {
      minStress: 2,
      maxStress: 6,
      cropYield: 1,
      seedYield: 2,
      remark: 'good'
    },
    {
      minStress: 7,
      maxStress: 11,
      cropYield: 1,
      seedYield: 1,
      remark: 'bad'
    },
    {
      minStress: 12,
      maxStress: Infinity,
      cropYield: 1,
      seedYield: 0,
      remark: 'horrible'
    }
  ],
  growthSpeed: {
    inSeason: 1,
    offSeason: 0.5
  }
}