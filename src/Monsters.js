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
    // TODO: Generate some random items & gold & monster bits
  }
  constructor(monsterConst){
    // TODO: there has to be a better way to do this
    this.name = monsterConst.name;
    this.health = monsterConst.health_max;
    this.health_max = monsterConst.health_max;
    this.image = monsterConst.image;
    this.dps = monsterConst.damage;
    this.attack_interval = monsterConst.attack_interval;
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
  gremlin: {
    name: "gremlin",
    health_max: 200,
    damage: 8,
    attack_interval: 750,
    image: <Gremlin className="monster"/>,
  },
  imp: {
    name: "imp",
    health_max: 150,
    damage: 10,
    attack_interval: 1000,
    image: <Imp className="monster"/>,
  },
  ogre: {
    name: "ogre",
    health_max: 450,
    damage: 20,
    attack_interval: 2500,
    image: <Ogre className="monster"/>,
  },
  zombie: {
    name: "zombie",
    health_max: 300,
    damage: 10,
    attack_interval: 2200,
    image: <Zombie className="monster"/>,
  },
}

// Defines levels and monsters found per level
export const levels = [
  [
    { monster: monsters.gremlin, weight: 50},
    { monster: monsters.imp, weight: 50},
    { monster: monsters.zombie, weight: 50},
    { monster: monsters.ogre, weight: 50},
  ],
];
