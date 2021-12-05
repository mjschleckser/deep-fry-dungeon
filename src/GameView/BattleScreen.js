///////////////////////////////////////////////////////////////////////////////
////////////////////////////// Battle Screen //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
import React from 'react';
import ActionBar from './GameView';
import ProgressBar from '../Utilities';
import { equip_slots } from '../App';
import { spells, damage_types, buffs, debuffs} from '../Magic';

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

    this.state = {
      enemy: this.props.enemy,
      enemyHasAttacked: false,
      enemyAttackProgress: 0,
      playerAttacking: false,
      playerAttackProgress: 0,
      playerAttackInterval: 1000,
      playerBlockDuration: 0,
      playerBlockCooldown: 0,
    }
    // Bind functions
    this.castSpell = this.castSpell.bind(this);
    this.shieldBlock = this.shieldBlock.bind(this);
    this.continueBlocking = this.continueBlocking.bind(this);
    this.handleAttack = this.handleAttack.bind(this);
    this.battleInterval = this.battleInterval.bind(this);
    this.modifyEnemyHealth = this.modifyEnemyHealth.bind(this);
    this.incrementEnemyAttack = this.incrementEnemyAttack.bind(this);
    this.incrementPlayerAttack = this.incrementPlayerAttack.bind(this);
    this.playerHasShieldEquipped = this.playerHasShieldEquipped.bind(this);

  }

  handleAttack(){
    this.setState({playerAttacking : (!this.state.playerAttacking) })
  }

  playerHasShieldEquipped(){
    var p = this.props.player;
    return Boolean(p.equipment[equip_slots.MAIN_HAND_TWO] && (p.equipment[equip_slots.MAIN_HAND_TWO].item_type === "SHIELD"));
  }



  /************ COMBAT - ENEMY FUNCTIONS ************/
  incrementEnemyAttack( amount ){
    var p = this.props.player;
    var e = this.state.enemy;
    var eap = this.state.enemyAttackProgress;
    // Increment attack timer, but don't attack while dead
    if(e.health > 0) eap += amount;
    // Trigger attack if we reach threshold
    if(eap >= e.attack_interval){
      var damage = e.dps * (e.attack_interval / 1000);  // Calculate damage from DPS and attack_interval
      if(this.state.playerBlockDuration > 0){ // Reduce damage if player is blocking
        // TODO: add visual cue to block
        // TODO: use player's shield stats and active buffs to reduce damage
        damage = Math.round(damage / 2);
      }
      this.props.functions.modifyPlayerHealth(damage, true);
      this.setState({enemyHasAttacked: true});
      eap = 0;
    }
    this.setState({enemy: e, enemyAttackProgress: eap});
    return eap;
  }

  modifyEnemyHealth( amount, isDamage ){
    var e = this.state.enemy;
    e.health = (isDamage ? e.health - amount : e.health + amount)
    if(e.health <= 0){ // check for enemy death
      e.health = 0;
      setTimeout(()=>{ // After animation plays, remove enemy and change stage
        this.props.functions.dungeonState("You vanquish the "+e.name+"!");
      }, 350);
    } else if(e.health >= e.health_max){
      e.health = e.health_max;
    }
    this.setState({ enemy: e })
  }



  /************ COMBAT - PLAYER FUNCTIONS ************/
  incrementPlayerAttack( amount ){
    var rand = Math.floor((Math.random() * 100) + 1); // 1-100
    var damage = 10;
    var pap = this.state.playerAttackProgress + amount;
    if(pap >= this.state.playerAttackInterval){ // TODO: use an actual attack interval
      // Trigger the attack
      pap = 0;
      this.modifyEnemyHealth(damage, true);
    }
    this.setState({playerAttackProgress: pap});
    return pap;
  }

  castSpell( e ){
    var spellNum = parseInt(e.target.id.replace("spell_num_", ""));
    var spell = this.props.player.spellbook[spellNum];
    //// BEGIN SPELL CASTING PROCESS
    // First, check to make sure we have sufficient mana
    if(this.props.player.mana >= spell.mana_cost){
      // Subtratct the mana cost
      this.props.functions.modifyPlayerMana(spell.mana_cost, true);
      // Apply direct damage
      var randDamage = Math.random() * spell.damage_variation * 2;
      var damage = Math.round(spell.damage - spell.damage_variation + randDamage);
      this.props.functions.modifyEnemyHealth(spell.damage, true);
      // Apply debuffs
    } else {
      // TODO: Probably just disable any spell button without enough mana
      console.error("Not enough mana!");
    }
  }

  shieldBlock(){
    var p = this.props.player;
    var blockDuration = 750;
    var blockCooldown = 1200;
    if(this.playerHasShieldEquipped()){
      this.setState({
        playerBlockDuration: blockDuration,
        playerBlockCooldown: blockCooldown,
      });
    } else {
      console.error("No shield to block with!");
    }
  }

  continueBlocking( duration ){
    var blockDuration = this.state.playerBlockDuration - duration;
    var blockCooldown = this.state.playerBlockCooldown - duration;
    this.setState({
      playerBlockDuration: blockDuration,
      playerBlockCooldown: blockCooldown,
    });
  }



  ////////////////// BATTLE INTERVAL - MAIN BATTLE LOOP //////////////////
  // Handle events that occur every [N] seconds in a battle
  battleInterval(battleIntervalTickRate){
    // Increment enemy's attack progress by our tickrate
    this.incrementEnemyAttack(battleIntervalTickRate);
    // Handle player attack
    if(this.state.playerAttacking){
      this.incrementPlayerAttack(battleIntervalTickRate);
    }
    // Handle player blocking
    if(this.state.playerBlockCooldown > 0 || this.state.playerBlockDuration > 0){
      this.continueBlocking(battleIntervalTickRate);
    }
    // TODO: Decrement & apply buffs and debuffs
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
    clearInterval(this.state.battleInterval); // Terminate battle loop
  }

  render(){
    /*********************** Action bar ***********************/
    var actions = [
      // {text: "Attack", action: this.props.functions.attack},
      {text: "Run Away", action: () => {this.props.functions.dungeonState("You flee from the "+this.props.enemy.name+".")}},
    ]

    /*********************** Button Text ***********************/
    var shieldText;
    if(this.state.playerBlockDuration > 0){
      shieldText = "BLOCKING "+this.state.playerBlockDuration;
    } else if (this.state.playerBlockCooldown > 0){
      shieldText = "BLOCK COOLDOWN "+this.state.playerBlockCooldown;
    } else {
      shieldText = "Shield Block";
    }

    /*********************** CSS Styles ***********************/
    var attackStyle = {
      animationName: "blocking",
      animationDuration: Math.round(this.state.playerAttackInterval / 2)+"ms",
    }
    var blockStyle = {
      animationName: "blocking",
      animationDuration: "200ms",
    }
    var lungeStyle = {
      animationName: "lunging",
      animationDuration: Math.round(this.props.enemy.attack_interval / 2)+"ms",
    }

    /*********************** List Creation ***********************/
    var createSpells = ()=>{
      var table=[];
      var spellbook = this.props.player.spellbook;
      for(let i=0; i < spellbook.length; i++){
        table.push(
          <div key={"spell_num_"+i}>
            <button className="size-medbutton" id={"spell_num_"+i}
            disabled={(this.props.player.spell_cooldown_active > 0) || (this.props.player.mana < spellbook[i].mana_cost)}
            onClick={this.castSpell} >
              {spellbook[i].name}
            </button>
          </div>
        );
      } // End for loop
      return table;
    } // End createSpells

    return (
      <table className="view-battle"><tbody>
        <tr><td className="view-battle-text">The {this.props.enemy.name} jumps out from the shadows!</td></tr>
        <tr><td className="view-battle-enemycontainer">
          <h2 className="view-battle-enemylabel">{capitalizeEachWord(this.props.enemy.name)}</h2>

          <div className="view-battle-enemy"
            style={((this.state.enemyAttackProgress <= this.state.enemy.attack_interval/2) && this.state.enemyHasAttacked) ? lungeStyle : {}}>
            {this.props.enemy.getImage()}
          </div>
          <div className="view-battle-enemyhp">
            <ProgressBar progress={this.props.enemy.health} progressMax={this.props.enemy.health_max} color="red" bgColor="white" />
          </div>
        </td></tr>
        <tr><td>
          <table className="view-battle-playeractions" style={{width:"100%", height:"100%", tableLayout:"fixed"}}><tbody>
            <tr>
              <td>{createSpells()}</td>
              <td>
                {
                  this.state.playerAttacking ?
                    <img src={swordAttack} className="center-absolute size-100"
                      style={(this.state.playerAttackProgress <= this.state.playerAttackInterval/2) ? attackStyle : {}} />
                    : '\u00A0'
                }
                <button
                  className="center-absolute size-bigbutton"
                  onClick={this.handleAttack}>
                  {this.state.playerAttacking ? "Stop Attacking" : "Attack" }
                </button>
              </td>
              <td>
                { this.state.playerBlockDuration > 0 ? <img src={shieldBlock} className="center-absolute size-100" style={blockStyle} /> : '\u00A0'}
                <button
                  onClick={this.shieldBlock}
                  disabled={(this.props.player.block_cooldown > 0) || (!this.playerHasShieldEquipped())}
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
