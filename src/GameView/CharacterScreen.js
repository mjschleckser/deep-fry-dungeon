///////////////////////////////////////////////////////////////////////////////
///////////////////////////// Character Screen ////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
import React from 'react';
import { ReactComponent as CloseIcon } from '../svg/utility-close.svg';

export default class CharacterScreen extends React.Component {
  constructor(props){
    super(props);
    // Make our own temporary skills to modify
    this.state ={
      // candidate for optimization, but effective deep copy
      tempSkills : JSON.parse(JSON.stringify(this.props.player.skills)),
      attribute_points : this.props.player.attribute_points,
      skill_points : this.props.player.skill_points,
      healthpoints : this.props.player.health_max,
      manapoints : this.props.player.mana_max,
    }
    // Bind functions
    this.modifySkill = this.modifySkill.bind(this);
    this.modifyAttribute = this.modifyAttribute.bind(this);
    this.revertChanges = this.revertChanges.bind(this);
    this.confirmChanges = this.confirmChanges.bind(this);
  }

  revertChanges(){
    // Pull state variables back from the parent
    this.setState({
      tempSkills: JSON.parse(JSON.stringify(this.props.player.skills)),
      attribute_points : this.props.player.attribute_points,
      skill_points : this.props.player.skill_points,
      healthpoints : this.props.player.health_max,
      manapoints : this.props.player.mana_max,
    });
  }

  confirmChanges(){
    // Pass state up. No changes should be needed to local vars
    this.props.functions.setPlayerSkills(this.state.tempSkills);
    this.props.functions.setPlayerAttributes(this.state.healthpoints, this.state.manapoints);
    this.props.functions.setPlayerPoints(this.state.skill_points, this.state.attribute_points);
  }

  modifyAttribute( e ){
    // Fetch state variables
    var healthpoints = this.state.healthpoints;
    var manapoints = this.state.manapoints;
    var attribute_points = this.state.attribute_points;
    var player = this.props.player;

    switch(e.currentTarget.innerText) {
      case '+':
          if((e.currentTarget.id === 'hp') && (attribute_points > 0)) {
            healthpoints += 10;
            attribute_points--;
          }
          if((e.currentTarget.id === 'mana') && (attribute_points > 0)) {
            manapoints += 10;
            attribute_points--;
          }
        break;
      case '-':
        if((e.currentTarget.id === 'hp') && (this.state.healthpoints > player.health_max)) {
          healthpoints -= 10;
          attribute_points++;
        }
        if((e.currentTarget.id === 'mana') && (this.state.manapoints > player.mana_max)) {
          manapoints -= 10;
          attribute_points++;
        }
    }

    // Save the changes
    this.setState({
      healthpoints: healthpoints,
      manapoints: manapoints,
      attribute_points: attribute_points,
    });
  }

  modifySkill( e ){
    // Fetch state variables
    var playerSkills = this.state.tempSkills;
    var skillPoints = this.state.skill_points;
    // Increase or decrease based on button clicked
    switch(e.currentTarget.innerText) {
      case '+':
        // Make sure we have points to spend
        if(skillPoints > 0){
          playerSkills[e.currentTarget.id].level += 1;
          skillPoints -= 1;
        }
        break;
      case '-':
        // Make sure we aren't decreasing past original level
        if(playerSkills[e.currentTarget.id].level > this.props.player.skills[e.currentTarget.id].level){
          playerSkills[e.currentTarget.id].level -= 1;
          skillPoints += 1;
        }
        break;
    }
    // Save the changes
    this.setState({
      tempSkills: playerSkills,
      skill_points: skillPoints,
    });
  }


  render(){
    var createSkills = ()=>{
      var table=[];
      var skillKeys = Object.keys(this.state.tempSkills);
      for(let i=0; i < skillKeys.length; i++){
        var skill = this.state.tempSkills[skillKeys[i]];
        var canIncrease = true;
        var canDecrease = true;
        table.push(
          <tr className="skill-outer" key={"skill_"+skill.name}>
            <td className="skill-label">{skill.name}</td>
            <td className="skill-bar">
              <div style={ {backgroundColor: "#f44336", width : (skill.level/2)+"%" } }>{skill.level}</div>
              <div style={ {backgroundColor: "#282c34", width : (100-(skill.level/2))+"%" } }>&nbsp;</div>
            </td>
            <button className="skill-button" id={skillKeys[i]} onClick={this.modifySkill} disabled={!canDecrease}>-</button>
            <button className="skill-button" id={skillKeys[i]} onClick={this.modifySkill} disabled={!canIncrease}>+</button>
          </tr>
        );
      } // End for loop
      return table;
    } // End function

    // Check if we've made any changes
    var changesMade = false;
    if(this.state.healthpoints != this.props.player.health_max) changesMade = true;
    if(this.state.manapoints != this.props.player.mana_max) changesMade = true;
    for (const newItem in this.state.tempSkills) {
      for(const oldItem in this.props.player.skills){
        if(this.state.tempSkills[newItem].name == this.props.player.skills[oldItem].name){
          if(this.state.tempSkills[newItem].level != this.props.player.skills[oldItem].level){
            changesMade = true;
          }
        }
      }
    }


    // TODO: Populate stats page with real data for monsters slain
    return (
      <div className="character">
        <button className="icon-button" onClick={this.props.functions.returnToDungeon}><CloseIcon/></button>
        <h2 className="character-header">
          Attributes
          {(this.state.attribute_points > 0) ? " ("+this.state.attribute_points+" points to spend)" : ""}
        </h2>
        <div>
          <div className="">
            <div className="attribute-label inline">Health</div>
            <div className="attribute-health inline"> {this.state.healthpoints} </div>
            <button className="skill-button inline" id={"hp"} onClick={this.modifyAttribute}>-</button>
            <button className="skill-button inline" id={"hp"} onClick={this.modifyAttribute}>+</button>
          </div>
          <div className="">
            <div className="attribute-label inline">Mana</div>
            <div className="attribute-mana inline"> {this.state.manapoints} </div>
            <button className="skill-button inline" id={"mana"} onClick={this.modifyAttribute}>-</button>
            <button className="skill-button inline" id={"mana"} onClick={this.modifyAttribute}>+</button>
          </div>
        </div>

        <h2 className="character-header">
          Skills
          {(this.state.skill_points > 0) ? " ("+this.state.skill_points+" points to spend)" : ""}
        </h2>
        <table style={{width:"100%"}}>
          <tbody>
            {createSkills()}
          </tbody>
        </table>
        <button className="character-skillbutton" onClick={this.confirmChanges}>&#x2713;</button>
        <button className="character-skillbutton" onClick={this.revertChanges}>&#8634;</button>
        {changesMade ? "Changes made!" : "No changes made."}

        <span>
          <h2>Player Stats</h2>
          <p>Gold Earned: 9,125</p>
          <p>Crits: 358</p>
          <p>Monsters Slain: 77</p>
          <p>Dishes Eaten: 4</p>
        </span>
      </div>
    );
  }
}
