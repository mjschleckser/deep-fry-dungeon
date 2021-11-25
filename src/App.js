// Import React & React classes
import React from 'react';
import GameView from './GameView';
import ProgressBar from './Utilities';
// Import classes & enums
import { Monster, monsters, recipes } from './Monsters';
import { Item, generateItem } from './Items';
import { spells } from './Magic';
//Import CSS
import './css/App.css';
// Import SVG images
import {
  EmptyBelt, EmptyTorso, EmptyHand, EmptyBoots, EmptyArtifact, EmptyRing,
  EmptyHead, EmptyNeck, EmptyShoulder, EmptyCookware, EmptyLegs, EmptyGloves
} from './SVG';

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

export const rarities = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythical",
  "arcane"
]

var playerObj = {
  name: "Ser Bearington",
  level: 1,
  class: "bearbarian",

  health: 85,
  health_max: 100,
  health_regen: 1,
  mana: 33,
  mana_max: 100,
  mana_regen: 2,
  mana_reserved: 20,  // Amount of mana reserved for passive spells
  // mana + mana_reserved < mana_max (always)

  // Skill cap is 60 for now
  skills: {
    anatomy:    {name: "Anatomy", level: 1, xp: 50, xp_next: 400},
    combat:     {name: "Combat", level: 1, xp: 250, xp_next: 400},
    magic:      {name: "Magic", level: 3, xp: 100, xp_next: 1200},
  },
  // Items can be either in equipment (worn) or in inventory, not both
  // Equipped items do not count towards inventory limit
  inventory: [],
  equipment: [],
  inventory_slots: 20,
  spellbook: [spells.fireball, spells.magicmissile, spells.shield],
  active_spells: [spells.shield],
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
    <div className="App">
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
      statusCode: gamestates.DUNGEON,  // Governs which window we're displaying
      statusMessage: "", // Message to display to the player
      player: playerObj,
      enemy: null,
      ground_items: [],
    }
  }

  /************ SCREEN TRANSITION FUNCTIONS ************/
  // Go to dungeon; display the selected message
  dungeonState(message){
    this.setState({
      statusCode: gamestates.DUNGEON,
      statusMessage: message
    });
  }
  // Sets state to Battle; sets monsters to the selected monster
  // DO NOT PASS IN MONSTER CONSTANTS - only new instances of Monster class
  battleState(monster){
    if(monster instanceof Monster !== true){
      alert("Bzzt! Wrongo!");
      return;
    }
    console.log("Encountered!");
    this.setState({
      statusCode: gamestates.BATTLE,
      enemy: monster,
    });
  }
  // if in battle/shop, go there: else dungeon
  returnToDungeon(){
    if(this.state.enemy != null) {  // if we are in a battle go back
      this.setState({ statusCode: gamestates.BATTLE });
    } else { // otherwise return to what we were doing
      this.setState({ statusCode: gamestates.DUNGEON });
    }
  }
  // Transitions to the selected menu - if already there, returns to dungeon
  menuScreen( newStatusCode ){
    if(this.state.statusCode === newStatusCode){
      this.returnToDungeon();
    } else {
      this.setState({ statusCode: newStatusCode });
    }
  }
  // Sets the stage to the passed game state, with no checks
  forceGameState( newStatusCode ){
    this.setState({ statusCode: newStatusCode });
  }


  /************ EXPLORATION FUNCTIONS ************/
  explore(){
    var rand = Math.floor((Math.random() * 100) + 1); // 1-100 inclusive
    console.log("Generated a " + rand + " on encounter roll");
    this.battleState(new Monster(monsters.slime));
  }

  /************ COMBAT FUNCTIONS ************/
  attack(){
    var rand = Math.floor((Math.random() * 100) + 1); // 1-100
    var damage = 8;
    if(rand < this.state.player.skills.anatomy.value)// check for crit
      damage = (damage * 2);

    var e = this.state.enemy;
    e.health -= damage;
    if(e.health <= 0){  // check for enemy death
      // Play health CSS animation
      e.health=0;
      this.setState({enemy: e});
      // After animation plays, remove enemy and change stage
      setTimeout(()=>{
        // TODO: Randomly generate a message, instead of always using this one
        this.dungeonState("You vanquish the "+e.name+"!");
        this.setState({enemy: null});
      }, 350);
    } else { // continue combat
      this.setState({enemy: e});
    }
  }


  /************ PLAYER STAT MODIFIERS ************/
  modifyHealth( amount, isDamage ){
    var np = this.state.player;
    np.health = (isDamage ? np.health - amount : np.health + amount)

    if(np.health <= 0){
      // TODO: State transition to death
    }

    if(np.health >= np.health_max){
      np.health = np.health_max;
    }
    this.setState({ player: np })
  }

  modifyMana( amount, isDamage ){
    var np = this.state.player;
    np.mana = (isDamage ? np.mana - amount : np.mana + amount)

    if(np.mana <= 0){
      // TODO: Spell fails, return "False"
    }

    if(np.mana >= (np.mana_max - np.mana_reserved)){
      np.mana = np.mana_max - np.mana_reserved;
    }
    this.setState({ player: np })
  }

  removeReservedMana(){
    var np = this.state.player;
    np.mana_reserved -= 10;
    this.setState({ player: np })
  }

  //*************** REACT FUNCTIONS **************/
  // Executes once on component load. Use for testing new code stuff
  componentDidMount(){
    // Function to test randomness
    // var results = {};
    // for(var i = 0; i < 30; i++){
    //   var result = generateItem();
    //   if(results[result] === undefined){
    //     results[result] = 1;
    //   } else {
    //     results[result] = results[result] + 1;
    //   }
    // }
    // console.log(results);

    // Add n random items to player inventory
    var np = this.state.player;
    for(var i = 0; i < 1; i++){
      var newItem = generateItem();
      np.inventory.push(newItem);
    }
    this.setState({player: np});
    console.log(this.state.player.inventory)

    // *************** PRIMARY GAME LOOP ************** //
    // Begin an interval for the game clock. Runs 4/second.
    setInterval(() => {
      console.log("Tock.")
      this.modifyHealth(1, false);
      this.modifyMana(2, false)
    }, 250);
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
      modifyHealth: this.modifyHealth.bind(this),
      attack: this.attack.bind(this),
    }
    var statusFunctions = {
      inventoryScreen: this.menuScreen.bind(this, gamestates.INVENTORY),
      spellbookScreen: this.menuScreen.bind(this, gamestates.SPELLBOOK),
      cookbookScreen: this.menuScreen.bind(this, gamestates.COOKBOOK),
      characterScreen: this.menuScreen.bind(this, gamestates.CHARACTER),
    }

    return (
      <div className="game-container">
        <div className="game-pane-left">
          <Status
            functions={statusFunctions}
            player={this.state.player}
            statusCode={this.state.statusCode}
          />
        </div>
        <div className="game-pane-center">
          <GameView
            functions={gameViewFunctions}
            statusCode={this.state.statusCode}
            statusMessage={this.state.statusMessage}
            player={this.state.player}
            enemy={this.state.enemy}
            ground_items={this.state.ground_items}
          />
        </div>
        <div className="game-pane-right">
          <EquipmentDisplay
            equipment={this.state.player.equipment}
          />
        </div>
      </div>
    );
  } // End of render()
} // End of Game class

// Status
// Renders all properties of the player - statistics, items, magic, etc.
class Status extends React.Component {
  render() {
    // const skills = Object.entries(this.props.player.skills).map(([key, obj]) => {
    //     return <h4 key={key}> {obj.display_name} : {obj.value} </h4>
    // })

    // var roundedHP = Math.round(this.props.player.health);
    var roundedHP = (this.props.player.health);

    return (
      <div className="menu-status">
          <h1 className="title"> {this.props.player.name} </h1>
          <div className="subtitle">Level {this.props.player.level} {this.props.player.class}</div>
          <br />
          <h2> Health </h2>
            <ProgressBar progress={roundedHP} progressMax={this.props.player.health_max} color="red" bgColor="white" />
          <h2> Mana </h2>
            <ManaBar player={this.props.player} />
          <br />
          <button className={this.props.statusCode === gamestates.CHARACTER ? "panel panel-active" : "panel"}
                  onClick={this.props.functions.characterScreen}>Character Sheet</button>
          <button className={this.props.statusCode === gamestates.INVENTORY ? "panel panel-active" : "panel"}
                  onClick={this.props.functions.inventoryScreen}>Inventory</button>
          <button className={this.props.statusCode === gamestates.COOKBOOK ? "panel panel-active" : "panel"}
                  onClick={this.props.functions.cookbookScreen}>Cookbook</button>
          <button className={this.props.statusCode === gamestates.SPELLBOOK ? "panel panel-active" : "panel"}
                  onClick={this.props.functions.spellbookScreen}>Spellbook</button>
      </div>
    );
  }
}

// Renders the player's mana bar
class ManaBar extends React.Component {
  render(){
    var innerBarStyle = {
      width: (this.props.player.mana / this.props.player.mana_max)* 100+"%",
    }
    var reservedStyle = {
      width: (this.props.player.mana_reserved / this.props.player.mana_max)* 100+"%",
    }
    // TODO: Code the color of the text to always contrast both other colors

    return (
      <div className="mana-bar-outer">
        <div className="mana-bar-inner" style={innerBarStyle}></div>
        <span className="mana-bar-reserved" style={reservedStyle}> {this.props.player.mana_reserved} &nbsp;</span>
        <span className="mana-bar-text"> &nbsp; {this.props.player.mana} / {this.props.player.mana_max} </span>
      </div>
    )
  }
}

class EquipmentDisplay extends React.Component {
  // TODO: properly implement this function
  // Fetches the item equipped in the given slot
  getEmpty(slot){
    var svg = <div></div>
    switch(slot){
      case equip_slots.ARTIFACT_ONE: case equip_slots.ARTIFACT_TWO:
        svg = <EmptyArtifact className="empty-item item-small"/>; break;
      case equip_slots.RING_ONE: case equip_slots.RING_TWO:
        svg = <EmptyRing className="empty-item item-small"/>; break;
      case equip_slots.MAIN_HAND_ONE: case equip_slots.MAIN_HAND_TWO:
        svg = <EmptyHand className="empty-item item-small"/>; break;
      case equip_slots.HEAD:
        svg = <EmptyHead className="empty-item"/>; break;
      case equip_slots.NECK:
        svg = <EmptyNeck className="empty-item"/>; break;
      case equip_slots.SHOULDERS:
        svg = <EmptyShoulder className="empty-item"/>; break;
      case equip_slots.TORSO:
        svg = <EmptyTorso className="empty-item"/>; break;
      case equip_slots.BELT:
        svg = <EmptyBelt className="empty-item"/>; break;
      case equip_slots.LEGS:
        svg = <EmptyLegs className="empty-item"/>; break;
      case equip_slots.BOOTS:
        svg = <EmptyBoots className="empty-item item-small"/>; break;
      case equip_slots.GLOVES:
        svg = <EmptyGloves className="empty-item"/>; break;
      case equip_slots.COOKWARE:
        svg = <EmptyCookware className="empty-item"/>; break;
      }
    return svg;
  }
  getEquipped(equipSlot){
    for(var i = 0; i < this.props.equipment.length; i++){
      var item = this.props.equipment[i];
      if(item.equip_slot === equipSlot){
        return item.getImage();
      }
    }
    return this.getEmpty(equipSlot);
  }
  render() {
    var createTable = ()=>{
      var equipSlotsArray = Object.keys(equip_slots);
      let table=[];
      for(var i=0; i < equipSlotsArray.length; i+=3){
        var i1 = this.getEquipped(equip_slots[equipSlotsArray[i]])
        var i2 = this.getEquipped(equip_slots[equipSlotsArray[i+1]])
        var i3 = this.getEquipped(equip_slots[equipSlotsArray[i+2]])
        table.push(
          <tr key={i}>
            <td>{i1}</td>
            <td>{i2}</td>
            <td>{i3}</td>
          </tr>
        );
      } // End for loop
      return table;
    } // End arrow function

    return (
      <div className="equipment-display">
        <h1 className="title"> Equipment </h1>
        <br />
        <table className="equipment-display-table"><tbody>
          {createTable()}
        </tbody></table>
      </div>
    );
  }
}
