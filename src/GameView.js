import React from 'react';
import ProgressBar from './Utilities';
import { ReactComponent as Close_Icon } from './svg/utility-close.svg';
import './css/GameView.css';

// Helper function: capitalizes first letter of each word in a string
function capitalizeEachWord(string){
  var words = string.split(" ");
  var result = "";
  for(var i = 0; i < words.length; i++){
    result += words[i].charAt(0).toUpperCase() + words[i].slice(1)+" ";
  }
  return result;
}

// GameWindow
// This window renders the actual game view - monsters, rooms, etc
export default class GameView extends React.Component {
  render() {
    var currentGameView;
    var actions;
    switch(this.props.statusCode){
      case 0:
        currentGameView = <DungeonScreen message={this.props.message} loot={this.props.ground_items} />
        actions = [
          {text: "Explore the Dungeon", action: this.props.functions.explore},
        ]
        break;
      case 1:
        currentGameView = <BattleScreen enemy={this.props.enemy} loot={this.props.loot}/>
        actions = [
          {text: "Attack", action: this.props.functions.attack},
          {text: "Run Away", action: () => {this.props.functions.dungeonState("You flee from the "+this.props.enemy.name+".")}},
        ]
        break;
      case 2:
        currentGameView = <InventoryScreen player={this.props.player} functions={this.props.functions} />
        actions = []
        break;
      case 3:
        currentGameView = <SpellbookScreen player={this.props.player} functions={this.props.functions} />
        actions = []
        break;
      case 4:
        currentGameView = <CookbookScreen player={this.props.player} functions={this.props.functions} />
        actions = []
        break;
      case 5:
        currentGameView = <CharacterScreen player={this.props.player} functions={this.props.functions} />
        actions = []
        break;
      default:
        currentGameView = (
          <div>OOPSIE WOOPSIE!! Uwu We made a fucky wucky!! A wittle fucko boingo! The code monkeys at our headquarters are working VEWY HAWD to fix this!</div>
        );
    } // End of switch
    return (
      <div className="menu-gameview">
        { currentGameView }
        <ActionBar actions={ actions }/>
      </div>
    );

  }
}

//// Old ActionBar code
// <button onClick={this.props.levelEvent}>Random Skill Level</button>
// <button onClick={this.props.takeDamage}>Take 10hp damage</button>
// <button className="hoveritem">
//   Cast a spell...
//   <div className="hovermenu hovermenu-above">
//     <button onClick={this.props.levelEvent}>Random Skill Level</button>
//     <button onClick={this.props.levelEvent}>Random Skill Level</button>
//   </div>
// </button>
class ActionBar extends React.Component {
  render() {
    var actions;
    if(this.props.actions != null){
      actions = Object.entries(this.props.actions).map(([key, obj]) => {
          return <button key={key} onClick={obj.action}> {obj.text} </button>
      })
    }
    return (
      <div className="menu-actionbar">
        {actions}
      </div>
    );
  }
}

// EventLog
// This div logs all game events as text & creates a scrollable history of actions.
// class EventLog extends React.Component {
//   render() {
//     const events = Object.entries(this.props.events).reverse().map(([key, value]) => {
//         return <div key={key}> {value} </div>
//     })
//     return (
//       <div className="menu-eventlog">
//         {events}
//       </div>
//     );
//   }
// }


class DungeonScreen extends React.Component {
  render(){
    let renderLoot = ()=> {
      var lootTable=[];
      if(this.props.loot != null){

      } else {
        // TODO: select a randomly generated empty set dressing when loot is empty
        lootTable.push(<div>The empty cavern floor stretches out before you.</div>);
      }
      return lootTable;
    }
    return (
      <div className="view-dungeon">
        <div className="view-dungeon-text">{this.props.message}</div>
        {renderLoot()}
      </div>
    )
  }
}

class BattleScreen extends React.Component {
  render(){
    return (
      <div className="view-battle">
        <div className="view-battle-text">A {this.props.enemy.name} jumps out from the shadows!</div>
        <br />
        <div className="view-battle-health">
          <h2>{capitalizeEachWord(this.props.enemy.name)}</h2>
          {this.props.enemy.getImage()}
          <ProgressBar progress={this.props.enemy.health} progressMax={this.props.enemy.health_max} color="red" bgColor="white" />
        </div>
      </div>
    );
  }
}
class CharacterScreen extends React.Component {
  render(){
    var createSkills = ()=>{
      var table=[];
      var skillKeys = Object.keys(this.props.player.skills);
      for(let i=0; i < skillKeys.length; i++){
        var skill = this.props.player.skills[skillKeys[i]];
        var skill_name = skill.name;
        var level = skill.level;
        var percent = Math.floor((skill.xp / skill.xp_next)*100);
        var innerBarStyle = { width: (percent)+"%", }
        table.push(
          <div className="progressbar-outer">
            <div className="progressbar-text"> {skill_name}: Level {level} ({percent}% to next level) </div>
            <div className="progressbar-inner" style={innerBarStyle}></div>
          </div>
        );
      } // End for loop
      return table;
    } // End function

    // TODO: Populate stats page with real data for monsters slain
    return (
      <div className="character">
        <button className="icon-button" onClick={this.props.functions.returnToDungeon}><Close_Icon/></button>
        <h2>Player Skills</h2>
        <div className="character-skills">
          {createSkills()}
        </div>
        <h2>Monsters Slain</h2>
        <div classname="character-stats"> PLACEHOLDER STATS
          <div>Slimes: 16</div>
          <div>Kobolds: 0</div>
          <div>Behirs: 1</div>
        </div>
      </div>
    );
  }
}
class InventoryScreen extends React.Component {
  render(){
    var createInventory = ()=>{
      var table=[];
      for(let i=0; i < this.props.player.inventory_slots; i++){
        var item = this.props.player.inventory[i];
        table.push(
          <div>{item!=null?item.getImage():" "}</div>
        );
      } // End for loop
      return table;
    } // End arrow function

    return (
      <div className="inventory">
        <button className="icon-button" onClick={this.props.functions.returnToDungeon}><Close_Icon/></button>
        <h2>Items in Backpack ({this.props.player.inventory_slots} slots)</h2>
        <div className="inventory-container">
          {createInventory()}
        </div>
      </div>
    );
  }
}
class SpellbookScreen extends React.Component {
  render(){
    var createSpellbook = ()=>{
      var table=[];
      var sb = this.props.player.spellbook;
      for(let i=0; i < sb.length; i++){
        table.push(
          <tr>
            <td className="spelltitle">{sb[i].name}</td>
            <td className="spelltext">{sb[i].description}</td>
          </tr>);
      } // End for loop
      return table;
    } // End function
    return (
      <div className="spellbook">
        <button className="icon-button" onClick={this.props.functions.returnToDungeon}><Close_Icon/></button>
        <h2>Spellbook</h2>
        <table className="spellbook-container">
          {createSpellbook()}
        </table>
      </div>
    );
  }
}
class CookbookScreen extends React.Component {
  render(){
    var createCookbook = ()=>{
      var table=[];
      var cb = this.props.player.cookbook;
      for(let i=0; i < cb.length; i++){
        var ingredients = [];
        for(let x=0; x < cb[i].ingredients.length; x++){
          ingredients.push(<td>{cb[i].ingredients[x]}</td>)
        }
        table.push(
          <tr>
            <td>{cb[i].name}</td>
            <br/>
            {ingredients}
          </tr>
        );
      } // End for loop
      return table;
    } // End function
    return (
      <div className="cookbook">
        <button className="icon-button" onClick={this.props.functions.returnToDungeon}><Close_Icon/></button>
        <h2>Cookbook</h2>
        <table className="cookbook-container">
          {createCookbook()}
        </table>
      </div>
    );
  }
}
