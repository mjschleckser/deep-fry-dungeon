////// Player Status //////
// Renders all properties of the player - statistics, items, magic, etc.
import React from 'react';
import ProgressBar from '../Utilities';
import { gamestates } from '../App';

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

    var reservedMana = this.props.player.mana_reserved;
    return (
      <div className="mana-bar-outer">
        <div className="mana-bar-inner" style={innerBarStyle}></div>
        <span className="mana-bar-reserved" style={reservedStyle}> {reservedMana > 0 ? reservedMana : ""} &nbsp;</span>
        <span className="mana-bar-text"> &nbsp; {this.props.player.mana} / {this.props.player.mana_max} </span>
      </div>
    )
  }
}


export default class PlayerStatus extends React.Component {
  render() {
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
          <button className={this.props.gameState === gamestates.CHARACTER ? "panel panel-active" : "panel"}
                  onClick={this.props.functions.characterScreen}>Character Sheet</button>
          <button className={this.props.gameState === gamestates.INVENTORY ? "panel panel-active" : "panel"}
                  onClick={this.props.functions.inventoryScreen}>Inventory</button>
          <button className={this.props.gameState === gamestates.COOKBOOK ? "panel panel-active" : "panel"}
                  onClick={this.props.functions.cookbookScreen}>Cookbook</button>
          <button className={this.props.gameState === gamestates.SPELLBOOK ? "panel panel-active" : "panel"}
                  onClick={this.props.functions.spellbookScreen}>Spellbook</button>
      </div>
    );
  }
}
