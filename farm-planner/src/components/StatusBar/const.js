'use strict';

const nutrients = {
    growthFormula: {
        name: 'growthFormula',
        imgSrc: 'nutrients/growth_formula_symbol.png'
    },
    compost: {
        name: 'compost',
        imgSrc: 'nutrients/compost_symbol.png'
    },
    manure: {
        name: 'manure',
        imgSrc: 'nutrients/manure_symbol.png'
    },
};

const intakes = {
    '0': {
        imgSrc: 'nutrients/nutrient-neutral.png'
    },
    '2': {
        imgSrc: 'nutrients/nutrient-one-down.png'
    },
    '-2': {
        imgSrc: 'nutrients/nutrient-one-up.png'
    },
    '4': {
        imgSrc: 'nutrients/nutrient-two-down.png'
    },
    '-4': {
        imgSrc: 'nutrients/nutrient-two-up.png'
    },
    '-8': {
        imgSrc: 'nutrients/nutrient-four-up.png'
    }
};

export {nutrients, intakes};