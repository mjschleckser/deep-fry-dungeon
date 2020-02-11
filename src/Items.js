import React from 'react';
import { equip_slots, rarities } from './App';
import { ReactComponent as Helmet } from './svg/armor-helmet-norse.svg';
import { ReactComponent as Platemail } from './svg/armor-torso-platemail.svg';
import { ReactComponent as Bracers } from './svg/armor-hands-bracers.svg';
import { ReactComponent as Sword_Dripping } from './svg/weapon-sword-dripping.svg';
import { ReactComponent as Axe } from './svg/weapon-axe.svg';
import { ReactComponent as Null_SVG } from './svg/utility-null.svg';
// Icons provided by Flatimg

export class Item {
  getImage(){
    // All rarity css classes are structured as "item-<rarity>" e.g. ".item-common"
    var item_classes = "item item-"+this.rarity;
    var svg = <Null_SVG className="item"/>;
    switch(this.equip_slot){
      case equip_slots.ARTIFACT_ONE:
      case equip_slots.ARTIFACT_TWO:
        break;
      case equip_slots.RING_ONE:
      case equip_slots.RING_TWO:
        break;
      case equip_slots.MAIN_HAND_ONE:
      case equip_slots.MAIN_HAND_TWO:
        svg = <Axe className={item_classes}/>; break;
      case equip_slots.OFF_HAND_ONE:
      case equip_slots.OFF_HAND_TWO:
        break;
      case equip_slots.HEAD:
        svg = <Helmet className={item_classes}/>; break;
      case equip_slots.TORSO:
        svg = <Platemail className={item_classes}/>; break;
      case equip_slots.GLOVES:
        svg = <Bracers className={item_classes}/>; break;
      case equip_slots.BELT:
        break;
      case equip_slots.NECK:
        break;
      case equip_slots.LEGS:
        break;
      case equip_slots.BOOTS:
        break;
      default:
        break;
    }
    return svg;
  }
  // Slot: one of the equip_slots enum values
  constructor(name, slot, rarity, effects){
    this.name = name;
    this.equip_slot = slot;
    this.rarity = rarity;
    this.effects = effects;
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
