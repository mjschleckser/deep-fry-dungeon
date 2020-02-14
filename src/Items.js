import React from 'react';
import { equip_slots, rarities } from './App';
import { Tooltip } from './Utilities';

// Artifacts, rings, weapons/shields
// Head, torso, legs, boots
// Shoulders, neck, belt, gloves
// Cookware
import {
  Gemstone01, Gemstone02,
  Ring01,
  Axe01, Axe02,
  Head01, Head02,
  Torso01, Torso02,
  Leg01, Leg02,
  Boot01,
  Cloak01,
  Neck01,
  Belt01,
  Gloves01, Gloves02,
  Pot01
} from './SVG';

// Images for random generation. Not used for unique images
const item_weights = [5, 1, 1, 1, 1, 1, 1, 1, 1, .5, .5, .5]
const item_types = {
  WEAPON: [Axe01, Axe02,],
  HEAD: [Head01, Head02,],
  TORSO: [Torso01, Torso02,],
  LEGS: [Leg01, Leg02,],
  BOOTS: [Boot01,],
  SHOULDERS: [Cloak01,],
  NECK: [Neck01,],
  BELT: [Belt01,],
  GLOVES: [Gloves01, Gloves02,],
  ARTIFACT: [Gemstone01, Gemstone02],
  RING: [Ring01,],
  COOKWARE: [Pot01,],
}

// Generates an item completely randomly
// Equal proportions for all equipment
// 4 proportions for Weapons
// 1/2 proportions for rings, artifacts, cookware
export function generateItem(dungeon_level){
    // First, declare all the vars we need to fill.
    var item_type, rarity, image, effects;

    // Randomly determine item type from weights
    // We decrement towards zero; our rand is less than the sum of weights,
    // so we will always reach 0 before ending.
    var item_sum = item_weights.reduce( (sum, curVal)=>sum+curVal );
    var rand = Math.random()*item_sum;
    for(var i = 0; i < item_weights.length; i++){
      rand -= item_weights[i];
      if(rand <= 0) {
        item_type = Object.keys(item_types)[i]; break;
      }
    }

    // Given our item type, select a random image
    var rand_image = Math.floor(Math.random() * item_types[item_type].length);
    image = item_types[item_type][rand_image];

    // Select a random rarity
    // TODO: Make a more weighted distribution, based on dungeon level
    rarity = Math.floor(Math.random() * rarities.length);

    // TODO: Implement effects/damage/etc.

    var newItem = new Item("Iron Axe", item_type, image, rarities[rarity], []);
    return newItem;
}

export class Item {
  constructor(name, item_type, image, rarity, effects){  // rarity, item_type, name, effects
    this.name = name;
    this.image = image;
    this.item_type = item_type;
    this.rarity = rarity;
    this.effects = effects;

  }
  getImage(){
    // TODO: Break this into Equipment display & Inventory display
    // TODO: Add tooltips, inventory functions (equip/drop/sell)
    var item_classes = "item item-"+this.rarity;
    return React.createElement(this.image, {className: item_classes });
  }
}

export class Ingredient {
  constructor(name, rarity, image){
    this.name = name;
    this.rarity = rarity;
  }
}


export const ingredients = {
  basic_meat: {
    name: "Stringy meat",
  }
}
