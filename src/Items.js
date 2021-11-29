import React from 'react';
import { equip_slots, rarities } from './App';
import { Tooltip } from './Utilities';

////////// EQUIPMENT IMAGES BY CATEGORY
// Artifacts, rings, weapons/shields
// Head, torso, legs, boots
// Shoulders, neck, belt, gloves
// Cookware
//// Artifacts
import { ReactComponent as Gemstone01 } from './svg/equipment/equip-gemstone-01.svg';
import { ReactComponent as Gemstone02 } from './svg/equipment/equip-gemstone-02.svg';

//// Rings
import { ReactComponent as Ring01 } from './svg/equipment/equip-ring-sparkles.svg';

//// Weapons & shields
import { ReactComponent as Axe01 } from './svg/equipment/weapon-axe.svg';
import { ReactComponent as Axe02 } from './svg/equipment/weapon-axe-golden.svg';
import { ReactComponent as Shield01 } from './svg/equipment/equip-shield.svg';

//// Headgear
import { ReactComponent as Head01 } from './svg/equipment/armor-head-mohawk.svg';
import { ReactComponent as Head02 } from './svg/equipment/armor-head-goggles.svg';

//// Torso
import { ReactComponent as Torso01 } from './svg/equipment/armor-torso-plate.svg';
import { ReactComponent as Torso02 } from './svg/equipment/armor-torso-platemail.svg';

//// Legs
import { ReactComponent as Leg01 } from './svg/equipment/armor-leg-1.svg';
import { ReactComponent as Leg02 } from './svg/equipment/armor-leg-2.svg';

//// Boots
import { ReactComponent as Boot01 } from './svg/equipment/armor-boots.svg';

//// Shoulders/back
import { ReactComponent as Cloak01 } from './svg/equipment/armor-shoulder-cloak.svg';

//// Neck
import { ReactComponent as Neck01 } from './svg/equipment/equip-neck-money.svg';

//// Belt
import { ReactComponent as Belt01 } from './svg/equipment/armor-belt.svg';

//// Gloves
import { ReactComponent as Gloves01 } from './svg/equipment/armor-gloves-bracelet.svg';
import { ReactComponent as Gloves02 } from './svg/equipment/armor-gloves-metal.svg';

//// Cookware
import { ReactComponent as Pot01 } from './svg/equipment/equip-cauldron.svg';

// Images for random generation. Not used for unique images
const item_weights = [5, 1, 1, 1, 1, 1, 1, 1, 1, .5, .5, .5]
const item_types = {
  WEAPON: [Axe01, Axe02,],
  SHIELD: [Shield01],
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
    // TODO: Generate a real name
    var newItem = new Item("Iron Axe", item_type, image, rarities[rarity], []);
    return newItem;
}

//// TODO: Remove function. Only needed for testing
export function generateShield(){
    // First, declare all the vars we need to fill.
    var item_type, rarity, image, effects;
    item_type = "SHIELD";

    // Generate the other stuff
    var rand_image = Math.floor(Math.random() * item_types[item_type].length);
    image = item_types[item_type][rand_image];
    rarity = Math.floor(Math.random() * rarities.length);
    var newItem = new Item("Iron Shield", item_type, image, rarities[rarity], []);
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
