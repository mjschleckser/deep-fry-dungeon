///////////////////////////////////////////////////////////////////////////////
////////////////////////////// Battle Screen //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
import React from 'react';
import ActionBar from './GameView';
import ProgressBar from '../Utilities';
import {equip_slots} from '../App';

import {default as shieldBlock} from "../svg/equipment-empty/shield.svg";
import {default as swordAttack} from "../svg/equipment-empty/sword.svg";

import '../css/BattleScreen.css';

// Helper function: capitalizes first letter of each word in a string
function capitalizeEachWord(string){
  var words = string.split(" ");
  var result = "";
  for(var i = 0; i < words.length; i++){
    result += words[i].charAt(0).toUpperCase() + words[i].slice(1)+" ";
  }
  return result;
}

//////////////////////////// Action Bar //////////////////////////////////
class BattleActionBar extends React.Component {
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


export default class BattleScreen extends React.Component {
  constructor(props){
    super(props);
    // Calculate starting offset of enemy attack circle
    // 40 = current circle radius
    var enemyCircumference = 40 * 2 * Math.PI;
    var playerCircumference = 40 * 2 * Math.PI;
    this.state = {
      playerAttacking: false,
    }
    // Bind functions
    this.handleAttack = this.handleAttack.bind(this);
    this.battleInterval = this.battleInterval.bind(this);
    this.callShieldBlock = this.callShieldBlock.bind(this);
    this.animateEnemyLunge = this.animateEnemyLunge.bind(this);
    this.hasShieldEquipped = this.hasShieldEquipped.bind(this);
  }

  handleAttack(){
    this.setState({playerAttacking : (!this.state.playerAttacking) })
  }

  hasShieldEquipped(){
    var p = this.props.player;
    return Boolean(p.equipment[equip_slots.MAIN_HAND_TWO] && (p.equipment[equip_slots.MAIN_HAND_TWO].item_type === "SHIELD"));
  }

  callShieldBlock(){
    this.props.functions.shieldBlock();
  }

  animateEnemyLunge(){

  }

  // Handle events that occur every [N] seconds in a battle
  battleInterval(battleIntervalTickRate){
    var maxEnemyNum = this.props.enemy.attack_interval;
    var maxPlayerNum = 1500; // this.props.player.attack_interval;

    // Increment enemy's attack progress by our tickrate
    var enemyNum = this.props.functions.incrementEnemyAttack(battleIntervalTickRate);
    if(enemyNum = 0){
      this.animateEnemyLunge();
    }

    // Handle player attack
    if(this.state.playerAttacking){
      var playerNum = this.props.functions.incrementPlayerAttack(battleIntervalTickRate);
    }

    // Handle player blocking
    if(this.props.player.block_cooldown >= 0 || this.props.player.block_duration >= 0){
      this.props.functions.continueBlocking(battleIntervalTickRate);
    }
  }

  // Begin battle loop here
  componentDidMount(){
    const battleIntervalTickRate = 10;
    var battleInterval = setInterval(() => {
      this.battleInterval(battleIntervalTickRate);
    }, battleIntervalTickRate);
    this.setState({battleInterval: battleInterval});
  };


  componentWillUnmount(){
    //// CLEAN UP ALL BATTLE COMPONENTS
    // Terminate battle loop
    clearInterval(this.state.battleInterval);
    // End shield block cooldown
    this.props.functions.continueBlocking(999999);
  }

  render(){
    var actions = [
      // {text: "Attack", action: this.props.functions.attack},
      {text: "Run Away", action: () => {this.props.functions.dungeonState("You flee from the "+this.props.enemy.name+".")}},
    ]

    var shieldText;
    if(this.props.player.block_duration > 0){
      shieldText = "BLOCKING "+this.props.player.block_duration;
    } else if (this.props.player.block_cooldown > 0){
      shieldText = "BLOCK COOLDOWN "+this.props.player.block_cooldown;
    } else {
      shieldText = "Shield Block";
    }

    var enemyAttackStyle = {
      animationName: "lunging",
      animationDuration: Math.round(this.props.enemy.attack_interval / 2)+"ms",
    }

    var shieldStyle = {
      animationName: "blocking",
      animationDuration: "200ms",
    }

    return (
      <table className="view-battle"><tbody>
        <tr><td className="view-battle-text">The {this.props.enemy.name} jumps out from the shadows!</td></tr>
        <tr><td className="view-battle-enemycontainer">
          <h2 className="view-battle-enemylabel">{capitalizeEachWord(this.props.enemy.name)}</h2>

          <div className="view-battle-enemy" style={(this.props.enemy.attack_progress <= this.props.enemy.attack_interval/2) ? enemyAttackStyle : {}}>
            {this.props.enemy.getImage()}
          </div>
          <div className="view-battle-enemyhp">
            <ProgressBar progress={this.props.enemy.health} progressMax={this.props.enemy.health_max} color="red" bgColor="white" />
          </div>
        </td></tr>
        <tr><td>
          <table className="view-battle-playeractions" style={{width:"100%", height:"100%", tableLayout:"fixed"}}><tbody>
            <tr>
              <td><button>Magic: Fireball</button></td>
              <td>
                { this.state.playerAttacking ? <img src={swordAttack} className="center-absolute size-100" style={shieldStyle} /> : '\u00A0'}
                <button
                  className="center-absolute size-bigbutton"
                  onClick={this.handleAttack}>
                  {this.state.playerAttacking ? "Stop Attacking" : "Attack" }
                </button>
              </td>
              <td>
                { this.props.player.block_duration > 0 ? <img src={shieldBlock} className="center-absolute size-100" style={shieldStyle} /> : '\u00A0'}
                <button
                  onClick={this.callShieldBlock}
                  disabled={(this.props.player.block_cooldown > 0) || (!this.hasShieldEquipped())}
                  className="center-absolute size-bigbutton">
                  {shieldText}
                </button>
                <br/>
              </td>
            </tr>
          </tbody></table>
        </td></tr>
        <tr><td>
          <BattleActionBar
            actions={actions}
          />
        </td></tr>
      </tbody></table>
    );
  }
}
