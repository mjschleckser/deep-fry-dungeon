///////////////////////////////////////////////////////////////////////////////
////////////////////////////// Dungeon Screen /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
import React from 'react';
import ProgressBar from '../Utilities';

//////////////////////////// Action Bar //////////////////////////////////
class DungeonActionBar extends React.Component {
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
        <DungeonActionBar
          actions={actions}
        />
      </div>
    )
  }
}
