import React from 'react';

import '../css/GameView.css';
import CookbookScreen from './CookbookScreen';
import SpellbookScreen from './SpellbookScreen';
import InventoryScreen from './InventoryScreen';
import DungeonScreen from './DungeonScreen';
import BattleScreen from './BattleScreen';
import CharacterScreen from './CharacterScreen';


// GameWindow
// This window renders the actual game view - monsters, rooms, etc
export default class GameView extends React.Component {
  render() {
    var currentGameView;
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
