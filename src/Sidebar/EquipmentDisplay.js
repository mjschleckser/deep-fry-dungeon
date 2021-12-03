////// Equipment Display //////
// Quick view of all the player's equipped items, and a brief stats overview.
import React from 'react';
import { equip_slots } from '../App';
import { ReactComponent as EmptyBelt } from '../svg/equipment-empty/belt.svg';
import { ReactComponent as EmptyTorso } from '../svg/equipment-empty/chest.svg';
import { ReactComponent as EmptyLegs } from '../svg/equipment-empty/leggings.svg';
import { ReactComponent as EmptyHand } from '../svg/equipment-empty/fist.svg';
import { ReactComponent as EmptyGloves } from '../svg/equipment-empty/gloves.svg';
import { ReactComponent as EmptyBoots } from '../svg/equipment-empty/foot.svg';
import { ReactComponent as EmptyArtifact } from '../svg/equipment-empty/gem.svg';
import { ReactComponent as EmptyRing } from '../svg/equipment-empty/ring.svg';
import { ReactComponent as EmptyHead } from '../svg/equipment-empty/helmet.svg';
import { ReactComponent as EmptyNeck } from '../svg/equipment-empty/necklace.svg';
import { ReactComponent as EmptyShoulder } from '../svg/equipment-empty/shoulder.svg';
import { ReactComponent as EmptyCookware } from '../svg/equipment-empty/cauldron.svg';

import '../css/EquipmentDisplay.css';


export default class EquipmentDisplay extends React.Component {
  constructor (props){
    super(props);
  }
  // TODO: properly implement this function
  // Fetches the item equipped in the given slot
  getEmpty(slot){
    var svg = <div></div>
    switch(slot){
      case equip_slots.ARTIFACT_ONE: case equip_slots.ARTIFACT_TWO:
        svg = <EmptyArtifact className="empty-item item-small"/>; break;
      case equip_slots.RING_ONE: case equip_slots.RING_TWO:
        svg = <EmptyRing className="empty-item item-small"/>; break;
      case equip_slots.MAIN_HAND_ONE: case equip_slots.MAIN_HAND_TWO:
        svg = <EmptyHand className="empty-item item-small"/>; break;
      case equip_slots.HEAD:
        svg = <EmptyHead className="empty-item"/>; break;
      case equip_slots.NECK:
        svg = <EmptyNeck className="empty-item"/>; break;
      case equip_slots.SHOULDERS:
        svg = <EmptyShoulder className="empty-item"/>; break;
      case equip_slots.TORSO:
        svg = <EmptyTorso className="empty-item"/>; break;
      case equip_slots.BELT:
        svg = <EmptyBelt className="empty-item"/>; break;
      case equip_slots.LEGS:
        svg = <EmptyLegs className="empty-item"/>; break;
      case equip_slots.BOOTS:
        svg = <EmptyBoots className="empty-item item-small"/>; break;
      case equip_slots.GLOVES:
        svg = <EmptyGloves className="empty-item"/>; break;
      case equip_slots.COOKWARE:
        svg = <EmptyCookware className="empty-item"/>; break;
      }
    return svg;
  }
  getEquipped(equipSlot){
    if(this.props.equipment[equipSlot] == null){
      return this.getEmpty(equipSlot);
    } else {
      return this.props.equipment[equipSlot].getImage();
    }
  }
  render() {
    var createTable = ()=>{
      var equipSlotsArray = Object.keys(equip_slots);
      let table=[];
      for(var i=0; i < equipSlotsArray.length; i+=3){
        var i1 = this.getEquipped(equip_slots[equipSlotsArray[i]])
        var i2 = this.getEquipped(equip_slots[equipSlotsArray[i+1]])
        var i3 = this.getEquipped(equip_slots[equipSlotsArray[i+2]])
        table.push(
          <tr key={i}>
            <td>{i1}</td>
            <td>{i2}</td>
            <td>{i3}</td>
          </tr>
        );
      } // End for loop
      return table;
    } // End arrow function

    return (
      <div>
        <table className="equipment-display-table">
          <tbody>
            {createTable()}
          </tbody>
        </table>
        <div className="equipment-display">
          <h2>Equipment Stats</h2>
          <span>Attack interval: 1.5 seconds</span> <br/>
          <span>Shield block cooldown: .8 seconds</span> <br/>
          <span></span> <br/>
          <span></span> <br/>
          <span></span> <br/>
        </div>
      </div>
    );
  }
}
