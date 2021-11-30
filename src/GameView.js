import React from 'react';
// import ProgressBar, { Tooltip } from './Utilities';
import ProgressBar from './Utilities';
import equip_slots from './App';
import { ReactComponent as CloseIcon } from './svg/utility-close.svg';
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
    switch(this.props.gameState){
      case 0: // gamestates.DUNGEON
        currentGameView = <DungeonScreen
          statusMessage={this.props.statusMessage}
          player={this.props.player}
          functions={this.props.functions}
          loot={this.props.ground_items}
        />;
        break;
      case 1: // gamestates.BATTLE
        currentGameView = <BattleScreen
          player={this.props.player}
          functions={this.props.functions}
          enemy={this.props.enemy}
          loot={this.props.loot}
        />;
        break;
      case 2: // gamestates.INVENTORY
        currentGameView = <InventoryScreen
          player={this.props.player}
          functions={this.props.functions}
        />
        break;
      case 3: // gamestates.SPELLBOOK
        currentGameView = <SpellbookScreen
        player={this.props.player}
        functions={this.props.functions}
        />
        break;
      case 4: // gamestates.COOKBOOK
        currentGameView = <CookbookScreen
          player={this.props.player}
          functions={this.props.functions}
        />
        break;
      case 5: // gamestates.CHARACTER
        currentGameView = <CharacterScreen
          player={this.props.player}
          functions={this.props.functions}
        />
        break;
      default:
        currentGameView = (
          <div>Invalid game state! How did you get here?</div>
        );
    } // End of switch
    return (
      <div className="menu-gameview">
        { currentGameView }
      </div>
    );

  }
}


//////////////////////////////////////////////////////////////////////////
//////////////////////////// Action Bar //////////////////////////////////
//////////////////////////////////////////////////////////////////////////

class ActionBar extends React.Component {
  render() {
    // TODO: comment this, uncomment next line
    var actions = <button> Sample Text </button>
    // var actions;

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


///////////////////////////////////////////////////////////////////////////////
////////////////////////////// Dungeon Screen /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

class DungeonScreen extends React.Component {
  render(){
    var actions = [
      {text: "Explore the Dungeon", action: this.props.functions.explore},
    ]
    let renderMessage = ()=> {
      if(this.props.statusMessage != null && this.props.statusMessage.length > 1){
        // Loot exists, render it
        return(<blockquote>{this.props.statusMessage}</blockquote>)
      } else {
        // TODO: select a randomly generated empty set dressing when loot is empty
        return(<blockquote>The empty cavern floor stretches out before you.</blockquote>);
      }
    }
    return (
      <div className="view-dungeon">
        <h3>Dungeon - Level 1</h3>
        {renderMessage()}
        <ActionBar
          actions={actions}
        />
      </div>
    )
  }
}


///////////////////////////////////////////////////////////////////////////////
////////////////////////////// Battle Screen //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

class BattleScreen extends React.Component {
  constructor(props){
    super(props);
    // Calculate starting offset of enemy attack circle
    // 40 = current circle radius
    var enemyCircumference = 40 * 2 * Math.PI;
    var playerCircumference = 40 * 2 * Math.PI;
    this.state = {
      playerAttacking: false,
      playerCircleStyle: {
        transform: "rotate(-90deg)",
        transformOrigin: "50% 50%",
        strokeDasharray : playerCircumference, playerCircumference,
        strokeDashoffset : playerCircumference
      },
      enemyCircleStyle: {
        transform: "rotate(-90deg)",
        transformOrigin: "50% 50%",
        strokeDasharray : enemyCircumference, enemyCircumference,
        strokeDashoffset : enemyCircumference
      }
    }
    // Bind functions
    this.handleAttack = this.handleAttack.bind(this);
  }

  handleAttack(){
    this.setState({playerAttacking : (!this.state.playerAttacking) })
  }

  hasShieldEquipped(){
    var p = this.props.player;
    return (p.equipment[equip_slots.MAIN_HAND_TWO] && p.equipment[equip_slots.MAIN_HAND_TWO].item_type == "SHIELD");
  }

  // Begin battle loop here
  componentDidMount(){
    const battleIntervalTickRate = 10;
    var maxEnemyNum = this.props.enemy.attack_interval;
    var maxPlayerNum = 1500; // this.props.player.attack_interval;
    var battleInterval = setInterval(() => {
      // Handle enemy attack
      var enemyNum = this.props.functions.incrementEnemyAttack(battleIntervalTickRate);
      // Adjust enemy attack circle
      var circumference = 40 * 2 * Math.PI;
      var offset = circumference + ((enemyNum / maxEnemyNum) * circumference);
      var enemyCircleStyle = Object.assign({}, this.state.enemyCircleStyle);
      enemyCircleStyle.strokeDashoffset = offset;
      this.setState( {enemyCircleStyle: enemyCircleStyle})

      // Handle player attack
      if(this.state.playerAttacking){
        var playerNum = this.props.functions.incrementPlayerAttack(battleIntervalTickRate);
        // Adjust player attack circle
        circumference = 40 * 2 * Math.PI;
        offset = circumference + ((playerNum / maxPlayerNum) * circumference);
        var playerCircleStyle = Object.assign({}, this.state.playerCircleStyle);
        playerCircleStyle.strokeDashoffset = offset;
        playerCircleStyle.visibility = "visible";
        this.setState( {playerCircleStyle: playerCircleStyle});
      } else{
        // If not attacking, hide attack
        var playerCircleStyle = Object.assign({}, this.state.playerCircleStyle);
        playerCircleStyle.visibility = "hidden";
        this.setState( {playerCircleStyle: playerCircleStyle})
      }

      // Handle player blocking
      if(this.props.player.block_cooldown >= 0 || this.props.player.block_duration >= 0){
        this.props.functions.continueBlocking(battleIntervalTickRate);
      }

    }, battleIntervalTickRate);
    this.setState({battleInterval: battleInterval});
  };


  componentWillUnmount(){
    // Terminate battle loop, clean up
    clearInterval(this.state.battleInterval);
    // End shield block cooldown
    this.props.functions.continueBlocking(999999);
  }

  render(){
    var actions = [
      // {text: "Attack", action: this.props.functions.attack},
      {text: "Run Away", action: () => {this.props.functions.dungeonState("You flee from the "+this.props.enemy.name+".")}},
    ]

    return (
      <table className="view-battle"><tbody>
        <tr><td className="view-battle-text">The {this.props.enemy.name} jumps out from the shadows!</td></tr>
        <tr><td className="view-battle-enemycontainer">
          <h2 style={{ margin: ".5em" }}>{capitalizeEachWord(this.props.enemy.name)}</h2>
          <div className="view-battle-enemy">
            {this.props.enemy.getImage()}
            <svg className="attack-circle-wrapper" height="100" width="100">
              <circle
                style={this.state.enemyCircleStyle}
                cx="50" cy="50" r="40"
                stroke="black" strokeWidth="6"
                fill="transparent"/>
            </svg>
          </div>
          <ProgressBar progress={this.props.enemy.health} progressMax={this.props.enemy.health_max} color="red" bgColor="white" />
        </td></tr>
        <tr><td>
          <table className="view-battle-playeractions" style={{width:"100%", height:"100%", tableLayout:"fixed"}}><tbody>
            <tr>
              <td><button>Magic: Fireball</button></td>
              <td>
                <button style={{fontSize:"2.5em"}} onClick={this.handleAttack}>Attack</button>
                <svg className="attack-circle-wrapper" height="100" width="100">
                  <circle
                    style={this.state.playerCircleStyle}
                    cx="50" cy="50" r="40"
                    stroke="black" strokeWidth="6"
                    fill="transparent"/>
                </svg>
              </td>
              <td>
                <button onClick={this.props.functions.shieldBlock} disabled={(this.props.player.block_cooldown > 0)}>Raise Shield </button>
                <br/>
                <span>{this.props.player.block_duration > 0 ? "Blocking for : "+this.props.player.block_duration : "" }</span>
              </td>
            </tr>
          </tbody></table>
        </td></tr>
        <tr><td>
          <ActionBar
            actions={actions}
          />
        </td></tr>
      </tbody></table>
    );
  }
}


///////////////////////////////////////////////////////////////////////////////
///////////////////////////// Character Screen ////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

class CharacterScreen extends React.Component {
  constructor(props){
    super(props);
    // Make our own temporary skills to modify
    this.state ={
      tempSkills : Object.assign({}, this.props.player.skills),
    }
    // Bind functions
    this.increaseSkill = this.increaseSkill.bind(this);
    this.decreaseSkill = this.decreaseSkill.bind(this);
    this.confirmChanges = this.confirmChanges.bind(this);
  }

  increaseSkill( e ){
    var playerSkills = this.state.tempSkills;
    playerSkills[e.currentTarget.id].level += 1;
    this.setState({tempSkills: playerSkills});

    // this.tempSkills;
  }

  decreaseSkill( e ){

  }

  confirmChanges(){
    // Pass the changes back up to the game state
  }

  componentWillUnmount(){
    this.setState({tempSkills: Object.assign({}, this.props.player.skills)});
  }
  componentDidMount(){
    this.setState({tempSkills: Object.assign({}, this.props.player.skills)});
  }

  render(){
    var createSkills = ()=>{
      var table=[];
      var skillKeys = Object.keys(this.state.tempSkills);
      for(let i=0; i < skillKeys.length; i++){
        var skill = this.state.tempSkills[skillKeys[i]];

        table.push(
          <tr className="skill-outer" key={"skill_"+skill.name}>
            <td className="skill-label">{skill.name}</td>
            <td className="skill-bar">
              <div style={ {backgroundColor: "#f44336", width : (skill.level/2)+"%" } }>{skill.level}</div>
              <div style={ {backgroundColor: "#282c34", width : (100-(skill.level/2))+"%" } }>&nbsp;</div>
            </td>
            <td className="skill-button" id={skillKeys[i]} onClick={this.decreaseSkill}>-</td>
            <td className="skill-button" id={skillKeys[i]} onClick={this.increaseSkill}>+</td>
          </tr>
        );
      } // End for loop
      return table;
    } // End function

    // TODO: Populate stats page with real data for monsters slain
    return (
      <div className="character">
        <button className="icon-button" onClick={this.props.functions.returnToDungeon}><CloseIcon/></button>
        <h2>Attributes</h2>
        <div className="character-attributes">
          <span></span>
          <span></span>
        </div>
        <h2>Skills</h2>
        <table className="character-skills"><tbody>
          {createSkills()}
        </tbody></table>
        <h2>Monsters Slain</h2>
        <div className="character-stats"> PLACEHOLDER STATS
          <div>Slimes: {this.props.player.skills.attackmagic.level}</div>
          <div>Kobolds: 0</div>
          <div>Behirs: 1</div>
        </div>
      </div>
    );
  }
}


///////////////////////////////////////////////////////////////////////////////
///////////////////////////// Inventory Screen ////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

class InventoryScreen extends React.Component {
  constructor (props){
    super(props);
    this.equipInventoryItem = this.equipInventoryItem.bind(this);

  }
  equipInventoryItem(e){
    var item = this.props.player.inventory[e.currentTarget.id];
    this.props.functions.equipItem(item);
  }
  render(){
    var createInventory = ()=>{
      var table=[];
      for(let i=0; i < this.props.player.inventory_slots; i++){
        var item = this.props.player.inventory[i];
        table.push(
          <div onClick={this.equipInventoryItem} id={i} key={i}>{item!=null?item.getImage():" "}</div>
        );
      } // End for loop
      return table;
    } // End arrow function

    return (
      <div className="inventory">
        <button className="icon-button" onClick={this.props.functions.returnToDungeon}><CloseIcon/></button>
        <h2>Inventory</h2>
        <div className="inventory-container">
          {createInventory()}
        </div>
      </div>
    );
  }
}


///////////////////////////////////////////////////////////////////////////////
///////////////////////////// Spellbook Screen ////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

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
        <button className="icon-button" onClick={this.props.functions.returnToDungeon}><CloseIcon/></button>
        <h2>Spellbook</h2>
        <table className="spellbook-container">
          {createSpellbook()}
        </table>
      </div>
    );
  }
}


//////////////////////////////////////////////////////////////////////////////
///////////////////////////// Cookbook Screen ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

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
        <button className="icon-button" onClick={this.props.functions.returnToDungeon}><CloseIcon/></button>
        <h2>Cookbook</h2>
        <table className="cookbook-container">
          {createCookbook()}
        </table>
      </div>
    );
  }
}
