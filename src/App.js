// Import React & React classes
import React from 'react';
import GameView from './GameView';
import ProgressBar from './Utilities';
// Import classes & enums
import { Monster, monsters, recipes } from './Monsters';
import { Item } from './Items';
import { spells } from './Magic';
//Import CSS
import './css/App.css';
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
  MAIN_HAND_ONE: "main hand one",
  HEAD: "head",
  MAIN_HAND_TWO: "main hand two",
  OFF_HAND_ONE: "off hand one",
  TORSO: "torso",
  OFF_HAND_TWO: "off hand two",
  GLOVES: "gloves",
  BELT: "belt",
  NECK: "neck",
  RING_ONE: "ring one",
  LEGS: "legs",
  ARTIFACT_ONE: "artifact one",
  RING_TWO: "ring two",
  BOOTS: "boots",
  ARTIFACT_TWO: "artifact two",
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
  mana: 66,
  mana_max: 100,

  // Skill cap is 60 for now
  skills: {
    anatomy:    {name: "Anatomy", level: 1, xp: 50, xp_next: 400},
    combat:     {name: "Combat", level: 1, xp: 250, xp_next: 400},
    magic:      {name: "Magic", level: 3, xp: 100, xp_next: 1200},
  },
  inventory: [],
  inventory_slots: 20,
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
// TODO: Collapse the left & right panels at mobile resolutions, make them expandable via button
// TODO: republish entire project to a new, public repo
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
      statusCode: 0,  // Governs which window we're displaying
      player: playerObj,
      enemy: null,
      message: "Welcome to the dungeon.",
      ground_items: [],
    }
  }

  /************ SCREEN TRANSITION FUNCTIONS ************/
  // Go to dungeon; display the selected message
  dungeonState(message){
    this.setState({
      statusCode: gamestates.DUNGEON,
      message: message,
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
    var rand = Math.floor((Math.random() * 100) + 1);
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
  takeDamage(){
    var np = this.state.player;
    np.health -= 10;
    this.setState({ player: np })
  }

  //*************** REACT FUNCTIONS **************/
  // Executes once on component load. Use for testing new code stuff
  componentDidMount(){
    var newSlime = new Monster(monsters.slime);
    var newHat =  new Item("Hat of Cool", equip_slots.HEAD, rarities[6], []);
    var newWeapon =  new Item("Longsword", equip_slots.MAIN_HAND_ONE, rarities[5], []);
    console.log(newSlime);
    console.log(newHat);
    console.log(Object.keys(equip_slots));

    var np = this.state.player;
    np.inventory.push(newHat, newWeapon);
    console.log(np.inventory);
    this.setState({player: np});

  }
  // Draws the game
  render() {
    // Check on our monsters
    // console.log(Object.keys(monsters))
    // Object.keys(monsters).forEach( key => console.log(monsters[key].display_name));

    // Check for player death
    if(this.state.player.health <= 0){
      this.logEvent("You have died.");
      var np = this.state.player;
      this.setState({player: np})
      np.health = 100;
    }

    // Bind and pass functions to the GameView
    var gameViewFunctions = {
      returnToDungeon: this.returnToDungeon.bind(this),
      dungeonState: this.dungeonState.bind(this),
      battleState: this.battleState.bind(this),
      forceGameState: this.forceGameState.bind(this),
      explore: this.explore.bind(this),
      takeDamage: this.takeDamage.bind(this),
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
            message={this.state.message}
            player={this.state.player}
            enemy={this.state.enemy}
            ground_items={this.state.ground_items}
          />
        </div>
        <div className="game-pane-right">
          <InventoryDisplay
            inventory={this.state.player.inventory}
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
    return (
      <div className="menu-status">
          <h1 className="title"> {this.props.player.name} </h1>
          <div className="subtitle">Level {this.props.player.level} {this.props.player.class}</div>
          <br />
          <h2> Health </h2>
            <ProgressBar progress={this.props.player.health} progressMax={this.props.player.health_max} color="red" bgColor="white" />
          <h2> Mana </h2>
            <ProgressBar progress={this.props.player.mana} progressMax={this.props.player.mana_max} color="blue" bgColor="white" />
          <br />
          <button className={this.props.statusCode === gamestates.CHARACTER ? "panel panel-active" : "panel"}
                  onClick={this.props.functions.characterScreen}>Character Sheet</button>
          <button className={this.props.statusCode === gamestates.INVENTORY ? "panel panel-active" : "panel"}
                  onClick={this.props.functions.inventoryScreen}>Inventory</button>
          <button className={this.props.statusCode === gamestates.SPELLBOOK ? "panel panel-active" : "panel"}
                  onClick={this.props.functions.spellbookScreen}>Spellbook</button>
          <button className={this.props.statusCode === gamestates.COOKBOOK ? "panel panel-active" : "panel"}
                  onClick={this.props.functions.cookbookScreen}>Cookbook</button>
      </div>
    );
  }
}


class InventoryDisplay extends React.Component {
  // TODO: properly implement this function
  // Fetches the item equipped in the given slot
  get_equipped(equipSlot){
    for(var i = 0; i < this.props.inventory.length; i++){
      var item = this.props.inventory[i];
      if(item.equip_slot === equipSlot){
        return item.getImage();
      }
    }
    return "";
  }
  render() {
    var createTable = ()=>{
      var equipSlotsArray = Object.keys(equip_slots);
      console.log(equipSlotsArray);
      let table=[];
      for(var i=0; i < equipSlotsArray.length; i+=3){
        var i1 = this.get_equipped(equip_slots[equipSlotsArray[i]])
        var i2 = this.get_equipped(equip_slots[equipSlotsArray[i+1]])
        var i3 = this.get_equipped(equip_slots[equipSlotsArray[i+2]])
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
      <div className="menu-inventory-display">
        <h1 className="title"> Equipment </h1>
        <br />
        <table className="inventory-display-table"><tbody>
          {createTable()}
        </tbody></table>
      </div>
    );
  }
}
