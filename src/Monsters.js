// Monster class
// A monster class is a single instance of a monster, with its own HP/MP
// Pass in a monster constant, and optionally, a list of modifiers
export class Monster {
  constructor(monsterConst){
    this.display_name = monsterConst.display_name;
    this.health = monsterConst.health_max;
    this.health_max = monsterConst.health_max;
  }
}

export const recipes = {
  slime_pudding: {
    display_name: "Slime Pudding",
    ingredients: ["Slime sac", "Slime gel", "Cave Moss"],
  },
  spider_stew: {
    display_name: "Spider Leg Stew",
    ingredients: ["Spider Leg", "Spider Meat", "Slime gel"],
  }
}

// Definition for all monster constants
export const monsters = {
  //// Tier 1 Monsters ////
  slime: {
    display_name: "dungeon slime",
    health_max: 20,
  },
  kobold: {
    display_name: "kobold",
    health_max: 15,
  },
  giant_spider: {
    display_name: "giant spider",
    health_max: 30,
  },
  giant_ant: {
    display_name: "giant ant",
    health_max: 25,
  },

  //// Tier 2 Monsters ////
  animated_armor: {
    display_name: "animated armor",
    health_max: 25,
  },
}
