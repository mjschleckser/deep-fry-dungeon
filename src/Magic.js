export const spell_types = {
  ACTIVE: 1,
  PASSIVE: 2,
}

// Definition file for all spells
export const spells = {
  fireball: {
    name: "Fireball",
    description: "Attacks the enemy with a blast of fire for 30 damage.",
    mana_cost: 30,
    spellfunction: function(){

    }
  },
  magicmissile: {
    name: "Magic Missile",
    description: "An unerring bolt of energy pummels your enemy for 10-15 damage.",
    mana_cost: 4,
    spellfunction: function(){

    }
  },
  shield: {
    name: "Shield",
    description: "A shimmering shield grants you 10 Damage Threshold, but slightly reduces maximum mana.",
    type: spell_types.PASSIVE,
    mana_cost: 10,
    spellfunction: function(){

    },
  }
}
