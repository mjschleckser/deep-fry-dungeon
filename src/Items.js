import React from 'react';
import { equip_slots } from './App';
import { Tooltip } from './Utilities';
////////////// SVG Imports //////////////
////// Icons provided by Flatimg
// Head Armor
import { ReactComponent as HelmetNorse } from './svg/armor-helmet-norse.svg';
import { ReactComponent as HelmetRoman } from './svg/armor-helmet-roman.svg';
// Torso Armor
import { ReactComponent as Platemail } from './svg/armor-torso-platemail.svg';
// Hand Armor
import { ReactComponent as Bracers } from './svg/armor-hands-bracers.svg';
// Leg Armor
import { ReactComponent as Greaves } from './svg/armor-legs-leggings.svg';
// Weapons
import { ReactComponent as SwordDripping } from './svg/weapon-sword-dripping.svg';
import { ReactComponent as Axe } from './svg/weapon-axe.svg';
// Rings
import { ReactComponent as RingMedium } from './svg/armor-ring-medium.svg';

export { ReactComponent as EmptyBelt } from './svg/equipment-empty/belt.svg';
export { ReactComponent as EmptyTorso } from './svg/equipment-empty/chest.svg';
export { ReactComponent as EmptyLegs } from './svg/equipment-empty/leggings.svg';
export { ReactComponent as EmptyHand } from './svg/equipment-empty/fist.svg';
export { ReactComponent as EmptyGloves } from './svg/equipment-empty/gloves.svg';
export { ReactComponent as EmptyBoots } from './svg/equipment-empty/foot.svg';
export { ReactComponent as EmptyArtifact } from './svg/equipment-empty/gem.svg';
export { ReactComponent as EmptyRing } from './svg/equipment-empty/ring.svg';
export { ReactComponent as EmptyHead } from './svg/equipment-empty/helmet.svg';
export { ReactComponent as EmptyNeck } from './svg/equipment-empty/necklace.svg';
export { ReactComponent as EmptyShoulder } from './svg/equipment-empty/shoulder.svg';
export { ReactComponent as EmptyCookware } from './svg/equipment-empty/cauldron.svg';

export class Item {
  // Randomly generates an item of the selected rarity
  generateItem(rarity){

  }
  // Gets the empty, placeholder item image for the given slot

  // Renders the item for display
  // TODO: Break this into Equipment display & Inventory display
  // TODO: Add tooltips, inventory functions (equip/drop/sell)
  getImage(){
    // All rarity css classes are structured as "item-<rarity>" e.g. ".item-common"
    var item_classes = "item item-"+this.rarity;
    var svg, tooltip = [];
    switch(this.equip_slot){
      case equip_slots.ARTIFACT_ONE:
      case equip_slots.ARTIFACT_TWO:
        break;
      case equip_slots.RING_ONE:
      case equip_slots.RING_TWO:
        svg = <RingMedium className={item_classes}/>; break;
      case equip_slots.MAIN_HAND_ONE:
      case equip_slots.MAIN_HAND_TWO:
        svg = <Axe className={item_classes}/>; break;
      case equip_slots.HEAD:
        svg = <HelmetRoman className={item_classes}/>; break;
      case equip_slots.TORSO:
        svg = <Platemail className={item_classes}/>; break;
      case equip_slots.GLOVES:
        svg = <Bracers className={item_classes}/>; break;
      case equip_slots.BELT:
        break;
      case equip_slots.NECK:
        break;
      case equip_slots.SHOULDERS:
        break;
      case equip_slots.COOKWARE:
        break;
      case equip_slots.LEGS:
        svg = <Greaves className={item_classes}/>; break;
      case equip_slots.BOOTS:
        break;
      default:
        break;
    }
    tooltip = <span>Tooltip.</span>
    // svg = <Tooltip content={svg} tooltip={tooltip}/>
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
