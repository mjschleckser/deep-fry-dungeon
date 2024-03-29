// Import React & React classes
import React from 'react';
import GameView from './GameView/GameView';
import EquipmentDisplay from './Sidebar/EquipmentDisplay';
import PlayerStatus from './Sidebar/PlayerStatus';

// Import classes & enums
import { Monster, monsters, levels, recipes } from './Monsters';
import { Item, generateItem, generateShield } from './Items';
import { spells } from './Magic';
//Import CSS
import './css/App.css';
// Import SVG images


export default App;
export const gamestates = {
  DUNGEON: 0,
  BATTLE: 1,
  INVENTORY: 2,
  SPELLBOOK: 3,
  COOKBOOK: 4,
  CHARACTER: 5,
}

export const equip_slots = {
  // Row 1
  ARTIFACT_ONE: 0,
  HEAD: 1,
  ARTIFACT_TWO: 2,
  // Row 2
  MAIN_HAND_ONE: 3,
  NECK: 4,
  SHOULDERS: 5, // This can include capes!
  // Row 3
  MAIN_HAND_TWO: 6,
  TORSO: 7,
  BELT: 8,
  // Row 4
  RING_ONE: 9,
  LEGS: 10,
  GLOVES: 11,
  // Row 5
  RING_TWO: 12,
  BOOTS: 13,
  COOKWARE: 14,
}


var playerObj = {
  name: "Rodney",
  level: 1,
  class: "Rogue",

  // Attributes
  health: 85,
  health_max: 100,
  health_regen: 1,  // HP regen per second
  mana: 0,
  mana_max: 100,
  mana_regen: 5,  // MP regen per second
  mana_reserved: 0,  // Amount of mana reserved for passive spells
  // mana + mana_reserved < mana_max (always)

  // Points to spend
  attribute_points: 2,
  skill_points: 10,

  // Skill cap is 20 for now
  skills: {
    // Magic skills
    attackmagic:    {name: "Battlemagic", desc: "", level: 10},
    defensemagic:   {name: "Warding", desc: "", level: 10},
    othermagic:     {name: "Spellcraft", desc: "", level: 10},
    // Combat skills
    blocking:       {name: "Deflection", desc: "", level: 10},
    precision:      {name: "Precision", desc: "", level: 10},
    dodge:          {name: "Dodge", desc: "", level: 10},
    // Other skills
    cooking:        {name: "Cooking", desc: "", level: 10},
    cooking:        {name: "Stealth", desc: "", level: 10},
  },
  // Items can be either in equipment (worn) or in inventory, not both
  // Equipped items do not count towards inventory limit
  inventory: [],
  inventory_slots: 28,

  equipment: {},

  spellbook: [spells.fireball, spells.magicmissile, spells.shield],
  cookbook: [recipes.slime_pudding, recipes.spider_stew],
}

/*************** INTERNET RESOURCES ***************/
// A really good guide:
// https://www.freecodecamp.org/news/learning-javascript-by-making-a-game-4aca51ad9030/
// A super cool library for adding sounds. Let's check it out!
// https://alligator.io/react/adding-sound-to-your-react-apps/
// For when I want to deploy to gh-pages:
// https://github.com/gitname/react-gh-pages

/*************** GENERIC TODOS ***************/
function App() {
  return (
    <div className="App" >
      <header className="App-header">Deep Fry Dungeon </header>
      <Game />
      <footer className="App-footer">
        <a className="App-link" href="https://github.com/mjschleckser/deep-fry-dungeon">Github</a> | &nbsp;
        <a className="App-link" href="https://twitter.com/mjschleckser">Twitter</a> | &nbsp;
        <a className="App-link" href="mailto:mjschleckser@gmail.com">Email</a> &nbsp;
      </footer>
    </div>
  );
}

// Game
// Master controller class. Handles all game-related events & owns player state
class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      gameState: gamestates.DUNGEON,  // Governs which window we're displaying
      statusMessage: "", // Message to display to the player
      player: playerObj,
      ground_items: [],
    }
    // Bind functions
    this.escFunction = this.escFunction.bind(this);

    /***** Loads the state from the cookie instead of a fresh load *****/
    // TODO: break out into a full function?
    // this.state = JSON.parse(document.cookie);
  }

  /************ GAME SAVE/LOAD FUNCTIONS ************/
  saveGameStateToCookies(){
    var stateCookie = JSON.stringify(this.state);
    document.cookie = stateCookie;
  }

  loadGameStateFromCookies(){
    var stateCookie = document.cookie;
    var newState = JSON.parse(stateCookie);
    console.log(newState);
    this.setState(  newState  );
  }

  /************ SCREEN TRANSITION FUNCTIONS ************/
  // Go to dungeon; display the selected message
  dungeonState(message){
    this.setState({
      gameState: gamestates.DUNGEON,
      statusMessage: message
    });
  }
  // Sets state to Battle; sets monsters to the selected monster
  // DO NOT PASS IN MONSTER CONSTANTS - only new instances of Monster class
  battleState(monster){
    if(monster instanceof Monster !== true){
      console.error("Invalid monster passed to battleState!")
      return;
    }
    // Encounter the passed monster
    this.setState({
      gameState: gamestates.BATTLE,
      enemy: monster,
    });
  }
  // if in battle/shop, go there: else dungeon
  returnToDungeon(){
    if(this.state.enemy != null) {  // if we are in a battle go back
      this.setState({ gameState: gamestates.BATTLE });
    } else { // otherwise return to what we were doing
      this.setState({ gameState: gamestates.DUNGEON });
    }
  }
  // Transitions to the selected menu - if already there, returns to dungeon
  menuScreen( newgameState ){
    if(this.state.gameState === newgameState){
      this.returnToDungeon();
    } else {
      this.setState({ gameState: newgameState });
    }
  }
  // Sets the stage to the passed game state, with no checks
  forceGameState( newgameState ){
    this.setState({ gameState: newgameState });
  }

  /************ EXPLORATION FUNCTIONS ************/
  explore(){
    // TODO: Swap this out for the actual level variable
    var currentLevel = this.state.player.level;
    var encounters = levels[currentLevel - 1];

    var weights = encounters.map(a => a.weight);
    var weightSum = weights.reduce( (sum, curVal) => sum+curVal );
    var rand = Math.random()*weightSum;
    for( var i = 0; i < encounters.length; i++ ){
        rand -= encounters[i].weight;
        if (rand <= 0){
          this.battleState(new Monster(encounters[i].monster));
          return;
        }
    }
    // We shouldn't get here - we should've selected a random choice by now
    console.error("Error in random encounter generation!");
  }

  /************ PLAYER FUNCTIONS ************/
  // Modifies the player's current health
  modifyPlayerHealth( amount, isDamage ){
    var np = this.state.player;
    np.health = (isDamage ? np.health - amount : np.health + amount)
    if(np.health <= 0){
      // TODO: State transition to death
      np.health = 0;
      // alert("You died!");
    }
    if(np.health >= np.health_max){
      np.health = np.health_max;
    }
    this.setState({ player: np })
  }

  modifyPlayerMana( amount, isDamage ){
    var np = this.state.player;
    np.mana = (isDamage ? np.mana - amount : np.mana + amount);
    if(np.mana <= 0){
      np.mana = 0;
    }
    if(np.mana >= (np.mana_max - np.mana_reserved)){
      np.mana = np.mana_max - np.mana_reserved;
    }
    this.setState({ player: np });
    return true;
  }

  setPlayerSkills( newSkills ){
    var player = this.state.player;
    player.skills =  JSON.parse(JSON.stringify(newSkills));
    this.setState({player: player});
  }

  setPlayerAttributes( healthPoints, manaPoints ){
    var player = this.state.player;
    player.health_max = healthPoints;
    player.mana_max = manaPoints;
    this.setState({player: player});
  }

  setPlayerPoints( skillPoints, attrPoints ){
    var player = this.state.player;
    player.skill_points = skillPoints;
    player.attribute_points = attrPoints;
    this.setState({player: player});
  }


  unequipItem( item ){
    // To make this easier, just pass in the slot that it's equipped to

  }

  equipItem( newItem ){
    if(newItem instanceof Item !== true){
      console.error("Invalid item passed to equipItem!")
      return;
    }
    var pe = this.state.player.equipment;
    var pi = this.state.player.inventory;
    switch(newItem.item_type){
      case "WEAPON":
        if(pe[equip_slots.MAIN_HAND_ONE]) pi.push(pe[equip_slots.MAIN_HAND_ONE]);
        pe[equip_slots.MAIN_HAND_ONE] = newItem;
        pi.splice(pi.indexOf(newItem), 1); break;
      case "SHIELD":
        if(pe[equip_slots.MAIN_HAND_TWO]) pi.push(pe[equip_slots.MAIN_HAND_TWO]);
        pe[equip_slots.MAIN_HAND_TWO] = newItem;
        pi.splice(pi.indexOf(newItem), 1); break;
      case "HEAD":
        if(pe[equip_slots.HEAD]) pi.push(pe[equip_slots.HEAD]);
        pe[equip_slots.HEAD] = newItem;
        pi.splice(pi.indexOf(newItem), 1); break;
      case "TORSO":
        if(pe[equip_slots.TORSO]) pi.push(pe[equip_slots.TORSO]);
        pe[equip_slots.TORSO] = newItem;
        pi.splice(pi.indexOf(newItem), 1); break;
      case "LEGS":
        if(pe[equip_slots.LEGS]) pi.push(pe[equip_slots.LEGS]);
        pe[equip_slots.LEGS] = newItem;
        pi.splice(pi.indexOf(newItem), 1); break;
      case "BOOTS":
        if(pe[equip_slots.BOOTS]) pi.push(pe[equip_slots.BOOTS]);
        pe[equip_slots.BOOTS] = newItem;
        pi.splice(pi.indexOf(newItem), 1); break;
      case "SHOULDERS":
        if(pe[equip_slots.SHOULDERS]) pi.push(pe[equip_slots.SHOULDERS]);
        pe[equip_slots.SHOULDERS] = newItem;
        pi.splice(pi.indexOf(newItem), 1); break;
      case "NECK":
        if(pe[equip_slots.NECK]) pi.push(pe[equip_slots.NECK]);
        pe[equip_slots.NECK] = newItem;
        pi.splice(pi.indexOf(newItem), 1); break;
      case "BELT":
        if(pe[equip_slots.BELT]) pi.push(pe[equip_slots.BELT]);
        pe[equip_slots.BELT] = newItem;
        pi.splice(pi.indexOf(newItem), 1); break;
      case "GLOVES":
        if(pe[equip_slots.GLOVES]) pi.push(pe[equip_slots.GLOVES]);
        pe[equip_slots.GLOVES] = newItem;
        pi.splice(pi.indexOf(newItem), 1); break;
      case "ARTIFACT":
        if(pe[equip_slots.ARTIFACT_ONE]) pi.push(pe[equip_slots.ARTIFACT_ONE]);
        pe[equip_slots.ARTIFACT_ONE] = newItem;
        pi.splice(pi.indexOf(newItem), 1); break;
      case "RING":
        if(pe[equip_slots.RING_ONE]) pi.push(pe[equip_slots.RING_ONE]);
        pe[equip_slots.RING_ONE] = newItem;
        pi.splice(pi.indexOf(newItem), 1); break;
      case "COOKWARE":
        if(pe[equip_slots.COOKWARE]) pi.push(pe[equip_slots.COOKWARE]);
        pe[equip_slots.COOKWARE] = newItem;
        pi.splice(pi.indexOf(newItem), 1); break;
    }

    var newPlayer = this.state.player;
    newPlayer.equipment = pe;
    newPlayer.inventory = pi;
    this.setState({ player : newPlayer });
  }

  //*************** REACT FUNCTIONS **************/
  escFunction(event){
    if(event.keyCode === 27) {
      this.returnToDungeon();
    }
  }
  componentWillUnmount(){
    // Cleanup listeners. Game should not unmount, but this is best practice.
    document.removeEventListener("keydown", this.escFunction, false);
  }
  componentDidMount(){
    // Add event listener for specified keypresses
    document.addEventListener("keydown", this.escFunction, false);

    ///// Player generation FUNCTIONS
    var np = this.state.player;
    // Generate & equip a shield, for blocking test
    var newItem = generateShield();
    np.equipment[equip_slots.MAIN_HAND_TWO] = newItem;
    // Add n random items to player inventory
    for(var i = 0; i < 9; i++){
      var newItem = generateItem();
      // TODO: Make this use an actual inventory function, check against max limit
      np.inventory.push(newItem);
    }
    this.setState({player: np});

    // *************** PRIMARY GAME LOOP ************** //
    // Begin an interval for the game clock.
    const gameIntervalTickRate = 50;
    var count = 0;
    var gameInterval = setInterval(() => {
      var gs = this.state.gameState;
      // If the game is running, run the clock.
      if(gs == gamestates.DUNGEON || gs == gamestates.BATTLE ){
        // Increment our count
        count += gameIntervalTickRate;
        // Every 500 MS, apply a regeneration tick and reset the count. Regen faster out of combat
        if(count >= 500 || (count >= 200 && gs == gamestates.DUNGEON)){
          var hp_regen = this.state.player.health_regen;
          var mp_regen = this.state.player.mana_regen;
          this.modifyPlayerHealth(hp_regen, false);
          this.modifyPlayerMana(mp_regen, false);
          count = 0;
        }
      }
      // Even if the game's not running, save cookies.
      this.saveGameStateToCookies();

    }, gameIntervalTickRate);
    this.setState({gameInterval: gameInterval});
  }


  // Draws the game
  render() {
    // Bind and pass functions to the GameView
    var gameViewFunctions = {
      returnToDungeon: this.returnToDungeon.bind(this),
      dungeonState: this.dungeonState.bind(this),
      battleState: this.battleState.bind(this),
      forceGameState: this.forceGameState.bind(this),
      explore: this.explore.bind(this),
      modifyPlayerHealth: this.modifyPlayerHealth.bind(this),
      modifyPlayerMana: this.modifyPlayerMana.bind(this),
      setPlayerSkills: this.setPlayerSkills.bind(this),
      setPlayerAttributes: this.setPlayerAttributes.bind(this),
      setPlayerPoints: this.setPlayerPoints.bind(this),
      equipItem: this.equipItem.bind(this),
    }
    var statusFunctions = {
      inventoryScreen: this.menuScreen.bind(this, gamestates.INVENTORY),
      spellbookScreen: this.menuScreen.bind(this, gamestates.SPELLBOOK),
      cookbookScreen: this.menuScreen.bind(this, gamestates.COOKBOOK),
      characterScreen: this.menuScreen.bind(this, gamestates.CHARACTER),
    }
    var equipmentFunctions = {
      unequipItem: this.unequipItem.bind(this),
    }

    return (
      <div className="game-container">
        <div className="game-pane-left">
          <PlayerStatus
            functions={statusFunctions}
            player={this.state.player}
            gameState={this.state.gameState}
          />
        </div>
        <div className="game-pane-center">
          <GameView
            functions={gameViewFunctions}
            gameState={this.state.gameState}
            statusMessage={this.state.statusMessage}
            player={this.state.player}
            enemy={this.state.enemy}
            ground_items={this.state.ground_items}
          />
        </div>
        <div className="game-pane-right">
          <EquipmentDisplay
            functions={equipmentFunctions}
            equipment={this.state.player.equipment}
          />
        </div>
      </div>
    );
  } // End of render()
} // End of Game class
