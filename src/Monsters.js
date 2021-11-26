import React from 'react';
import './css/Monsters.css';
// Image imports


////////// MONSTER IMAGES - ORGANIZED BY DUNGEON THEME
// Undead, aquatic, etc.
// CLASSIC DUNGEON MONSTERS
import {ReactComponent as Gremlin} from './svg/enemies/gremlin.svg';
import {ReactComponent as LootGoblin} from './svg/enemies/goblin-loot.svg';
import {ReactComponent as Imp} from './svg/enemies/devil-imp.svg';
import {ReactComponent as Zombie} from './svg/enemies/undead-zombie.svg';
import {ReactComponent as Ogre} from './svg/enemies/giants-ogre.svg';

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
    image: <Imp className="monster"/>,
  },
  ogre: {
    name: "ogre",
    health_max: 45,
    image: <Ogre className="monster"/>,
  },
}
