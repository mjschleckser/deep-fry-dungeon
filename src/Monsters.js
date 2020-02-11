import React from 'react';
import { ReactComponent as Slime } from './svg/enemies/slime.svg';

// Monster class
// A monster class is a single instance of a monster, with its own HP/MP
// Pass in a monster constant, and optionally, a list of modifiers
export class Monster {
  getImage(){
    return this.image;
  }
  constructor(monsterConst){
    this.name = monsterConst.name;
    this.health = monsterConst.health_max;
    this.health_max = monsterConst.health_max;
    this.image = monsterConst.image;
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
    name: "dungeon slime",
    health_max: 20,
    image: <Slime/>,
  },
  kobold: {
    name: "kobold",
    health_max: 15,
  },
  giant_spider: {
    name: "giant spider",
    health_max: 30,
  },
  giant_ant: {
    name: "giant ant",
    health_max: 25,
  },

  //// Tier 2 Monsters ////
  animated_armor: {
    name: "animated armor",
    health_max: 25,
  },
}
