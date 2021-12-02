///////////////////////////////////////////////////////////////////////////////
////////////////////////////// Battle Screen //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
import React from 'react';
import ActionBar from './GameView';
import ProgressBar from '../Utilities';
import equip_slots from '../App';

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
    return (p.equipment[equip_slots.MAIN_HAND_TWO] && p.equipment[equip_slots.MAIN_HAND_TWO].item_type === "SHIELD");
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
              <td style={ {backgroundImage: "../svg/equipment/equip-shield.svg"} }>
                <button onClick={this.props.functions.shieldBlock} disabled={(this.props.player.block_cooldown > 0)}>Raise Shield </button>
                <br/>
                <span>{this.props.player.block_duration > 0 ? "Blocking for : "+this.props.player.block_duration : "" }</span>
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
