'use strict'

export default {
  carrot: {
    crop: 'carrot',
    name: 'Carrot',
    src: {
      normal: 'crop_normal/carrot.png',
      giant: 'crop_giant/carrot.png',
      seeds: 'crop_seeds/Oblong_Seeds.png',
      plant: 'crop_plant/Carrot_Plant.png'
    },
    nutrients: {
      growthFormula: -4,
      compost: 2,
      manure: 2
    },
    seasons: ['autumn', 'winter', 'spring'],
    drink: 0.75
  },
  corn: {
    crop: 'corn',
    name: 'Corn',
    src: {
      normal: 'crop_normal/corn.png',
      giant: 'crop_giant/corn.png',
      seeds: 'crop_seeds/Clustered_Seeds.png',
      plant: 'crop_plant/Corn_Stalk.png'
    },
    nutrients: {
      growthFormula: 2,
      compost: -4,
      manure: 2
    },
    seasons: ['autumn', 'spring', 'summer'],
    drink: 0.75
  },
  potato: {
    crop: 'potato',
    name: 'Potato',
    src: {
      normal: 'crop_normal/potato.png',
      giant: 'crop_giant/potato.png',
      seeds: 'crop_seeds/Fluffy_Seeds.png',
      plant: 'crop_plant/Potato_Plant.png'
    },
    nutrients: {
      growthFormula: 2,
      compost: 2,
      manure: -4
    },
    seasons: ['autumn', 'winter', 'spring'],
    drink: 0.75
  },
  tomaRoot: {
    crop: 'tomaRoot',
    name: 'Toma Root',
    src: {
      normal: 'crop_normal/toma-root.png',
      giant: 'crop_giant/toma-root.png',
      seeds: 'crop_seeds/Spiky_Seeds.png',
      plant: 'crop_plant/Toma_Root_Plant.png'
    },
    nutrients: {
      growthFormula: -2,
      compost: -2,
      manure: 4
    },
    seasons: ['autumn', 'spring', 'summer'],
    drink: 3.5
  },
  asparagus: {
    crop: 'asparagus',
    name: 'Asparagus',
    src: {
      normal: 'crop_normal/asparagus.png',
      giant: 'crop_giant/asparagus.png',
      seeds: 'crop_seeds/Tubular_Seeds.png',
      plant: 'crop_plant/Asparagus_Fern.png'
    },
    nutrients: {
      growthFormula: 2,
      compost: -4,
      manure: 2
    },
    seasons: ['winter', 'spring'],
    drink: 0.75
  },
  eggplant: {
    crop: 'eggplant',
    name: 'Eggplant',
    src: {
      normal: 'crop_normal/eggplant.png',
      giant: 'crop_giant/eggplant.png',
      seeds: 'crop_seeds/Swirly_Seeds.png',
      plant: 'crop_plant/Eggplant_Stalk.png'
    },
    nutrients: {
      growthFormula: 2,
      compost: 2,
      manure: -4
    },
    seasons: ['autumn', 'spring'],
    drink: 2
  },
  pumpkin: {
    crop: 'pumpkin',
    name: 'Pumpkin',
    src: {
      normal: 'crop_normal/pumpkin.png',
      giant: 'crop_giant/pumpkin.png',
      seeds: 'crop_seeds/Sharp_Seeds.png',
      plant: 'crop_plant/Pumpkin_Plant.png'
    },
    nutrients: {
      growthFormula: -4,
      compost: 2,
      manure: 2
    },
    seasons: ['autumn', 'winter'],
    drink: 2
  },
  watermelon: {
    crop: 'watermelon',
    name: 'Watermelon',
    src: {
      normal: 'crop_normal/watermelon.png',
      giant: 'crop_giant/watermelon.png',
      seeds: 'crop_seeds/Square_Seeds.png',
      plant: 'crop_plant/Watermelon_Plant.png'
    },
    nutrients: {
      growthFormula: 4,
      compost: -2,
      manure: -2
    },
    seasons: ['spring', 'summer'],
    drink: 3.5
  },
  dragonFruit: {
    crop: 'dragonFruit',
    name: 'Dragon Fruit',
    src: {
      normal: 'crop_normal/dragon-fruit.png',
      giant: 'crop_giant/dragon-fruit.png',
      seeds: 'crop_seeds/Bulbous_Seeds.png',
      plant: 'crop_plant/Dragon_Fruit_Vine.png'
    },
    nutrients: {
      growthFormula: 4,
      compost: 4,
      manure: -8
    },
    seasons: ['spring', 'summer'],
    drink: 2
  },
  durian: {
    crop: 'durian',
    name: 'Durian',
    src: {
      normal: 'crop_normal/durian.png',
      giant: 'crop_giant/durian.png',
      seeds: 'crop_seeds/Brittle_Seed_Pods.png',
      plant: 'crop_plant/Durian_Vine.png'
    },
    nutrients: {
      growthFormula: 4,
      compost: -8,
      manure: 4
    },
    seasons: ['spring'],
    drink: 0.75
  },
  garlic: {
    crop: 'garlic',
    name: 'Garlic',
    src: {
      normal: 'crop_normal/garlic.png',
      giant: 'crop_giant/garlic.png',
      seeds: 'crop_seeds/Seed_Pods.png',
      plant: 'crop_plant/Garlic_Plant.png'
    },
    nutrients: {
      growthFormula: 4,
      compost: -8,
      manure: 4
    },
    seasons: ['autumn', 'winter', 'spring', 'summer'],
    drink: 0.75
  },
  onion: {
    crop: 'onion',
    name: 'Onion',
    src: {
      normal: 'crop_normal/onion.png',
      giant: 'crop_giant/onion.png',
      seeds: 'crop_seeds/Pointy_Seeds.png',
      plant: 'crop_plant/Onion_Plant.png'
    },
    nutrients: {
      growthFormula: -8,
      compost: 4,
      manure: 4
    },
    seasons: ['autumn', 'spring', 'summer'],
    drink: 2
  },
  pepper: {
    crop: 'pepper',
    name: 'Pepper',
    src: {
      normal: 'crop_normal/pepper.png',
      giant: 'crop_giant/pepper.png',
      seeds: 'crop_seeds/Lumpy_Seeds.png',
      plant: 'crop_plant/Pepper_Plant.png'
    },
    nutrients: {
      growthFormula: 4,
      compost: 4,
      manure: -8
    },
    seasons: ['autumn', 'summer'],
    drink: 0.75
  },
  pomegranate: {
    crop: 'pomegranate',
    name: 'Pomegranate',
    src: {
      normal: 'crop_normal/pomegranate.png',
      giant: 'crop_giant/pomegranate.png',
      seeds: 'crop_seeds/Windblown_Seeds.png',
      plant: 'crop_plant/Pomegranate_Branch.png'
    },
    nutrients: {
      growthFormula: -8,
      compost: 4,
      manure: 4
    },
    seasons: ['spring', 'summer'],
    drink: 2
  }
}