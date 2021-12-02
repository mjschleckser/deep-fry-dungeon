///////////////////////////////////////////////////////////////////////////////
////////////////////////////// Dungeon Screen /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
import React from 'react';
import ActionBar from './GameView';
import ProgressBar from '../Utilities';

export default class DungeonScreen extends React.Component {
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
