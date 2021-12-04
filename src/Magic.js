// Definition file for all spells
export const damage_types = {
  FIRE: 1,
  ICE: 2,
  FORCE: 3,
  NECROTIC: 4,
}

export const buffs = {
  HEALING: 0,
  HP_REGEN: 1,
  MP_REGEN: 2,
  WARDED: 3,
  SHIELDED: 4,
}

export const debuffs = {
  STUNNED: 0,
  POISONED: 1,
  BURNING: 2,
}

// BUFF/DEBUFF FORMAT: Array with 3 variables
// [0] : Buff/Debuff type
// [1] : Magnitude (usually # of healing/damage per 1000 ms)
// [2] : Duration (in MS)

export const spells = {
  fireball: {
    name: "Fireball",
    description: "Attacks the enemy with a blast of fire for 30 damage, and 30 more damage over 6 seconds.",
    cast_time: 1500,
    mana_cost: 40,
    damage: 30,
    damage_variation: 0,
    damage_type: damage_types.FIRE,
    buffs: [],
    debuffs: [ [debuffs.BURNING, 5, 6000] ],
  },
  magicmissile: {
    name: "Magic Missile",
    description: "An unerring bolt of energy pummels your enemy for 10-15 damage.",
    cast_time: 500,
    mana_cost: 20,
    damage: 12.5,
    damage_variation: 2.5,
    damage_type: damage_types.FORCE,
    buffs: [],
    debuffs: [],
  },
  shield: {
    name: "Shield",
    description: "A shimmering shield grants you 18 Damage Threshold for 10 seconds, but slightly reduces maximum mana.",
    cast_time: 0,
    mana_cost: 10,
    damage: 0,
    damage_variation: 0,
    // No damage_type - only necessary on damaging spells
    buffs: [ [buffs.SHIELDED, 18, 10000] ],
    debuffs: [],
  },
  heal: {
    name: "Heal",
    description: "Restores ",
    cast_time: 0,
    mana_cost: 10,
    damage: 0,
    damage_variation: 0,
    // No damage_type - only necessary on damaging spells
    buffs: [ [buffs.HP_REGEN, 50, 1] ],
    debuffs: [],
  }
}
