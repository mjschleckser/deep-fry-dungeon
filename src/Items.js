import React from 'react';
import { equip_slots, rarities } from './App';
import { ReactComponent as Helmet } from './svg/008-helmet-1.svg';
import { ReactComponent as Platemail } from './svg/002-armor.svg';
import { ReactComponent as Bracers } from './svg/006-armor-1.svg';
import { ReactComponent as Sword_Magic } from './svg/003-sword.svg';
import { ReactComponent as Axe } from './svg/005-axe.svg';
import { ReactComponent as Null_SVG } from './svg/null.svg';
// Icons provided by Flatimg

export class Item {
  // export const rarities = [
  //   "common",
  //   "uncommon",
  //   "rare",
  //   "epic",
  //   "legendary",
  //   "mythical",
  //   "arcane"
  // ]
  getImage(){
    // All rarity css classes are structured as "item-<rarity>" e.g. ".item-common"
    var item_classes = "item item-"+this.rarity;
    var svg = <Null_SVG className="item"/>;
    switch(this.slot){
      case equip_slots.ARTIFACT_ONE:
      case equip_slots.ARTIFACT_TWO:
        break;
      case equip_slots.RING_ONE:
      case equip_slots.RING_TWO:
        break;
      case equip_slots.MAIN_HAND_ONE:
      case equip_slots.MAIN_HAND_TWO:
        return <Axe className={item_classes}/>;
      case equip_slots.OFF_HAND_ONE:
      case equip_slots.OFF_HAND_TWO:
        break;
      case equip_slots.HEAD:
        return <Helmet className={item_classes}/>;
      case equip_slots.TORSO:
        return <Platemail className={item_classes}/>;
      case equip_slots.GLOVES:
        return <Bracers className={item_classes}/>;
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
    return <div>NULLIMG</div>
  }
  // Slot: one of the equip_slots enum values
  constructor(name, slot, rarity, effects){
    this.name = name;
    this.slot = slot;
    this.rarity = rarity;
    this.effects = effects;
  }
}
