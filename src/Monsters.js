import React from 'react';
import './css/Monsters.css';
// Image imports
import {
  Gremlin,
} from './SVG';

// Monster class
// A monster class is a single instance of a monster, with its own HP/MP
// Pass in a monster constant, and optionally, a list of modifiers
export class Monster {
  getImage(){
    return this.image;
  }
  getLoot(){

  }
  constructor(monsterConst){
    this.name = monsterConst.name;
    this.health = monsterConst.health_max;
    this.health_max = monsterConst.health_max;
    this.image = monsterConst.image;
    this.loot = this.getLoot(monsterConst.level);
  }
}

export const recipes = {
  slime_pudding: {
    name: "Slime Pudding",
    ingredients: ["Slime sac", "Slime gel", "Cave Moss"],
  },
  spider_stew: {
    name: "Spider Leg Stew",
    ingredients: ["Spider Leg", "Spider Meat", "Slime gel"],
  }
}

// Definition for all monster constants
export const monsters = {
  //// Tier 1 Monsters ////
  slime: {
    name: "gremlin",
    health_max: 20,
    image: <Gremlin className="monster"/>,
  },
  imp: {
    name: "imp",
    health_max: 15,
    image: <Gremlin className="monster"/>,
  },
}
