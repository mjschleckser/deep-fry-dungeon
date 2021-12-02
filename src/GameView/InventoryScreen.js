///////////////////////////////////////////////////////////////////////////////
///////////////////////////// Inventory Screen ////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
import React from 'react';
import { ReactComponent as CloseIcon } from '../svg/utility-close.svg';

export default class InventoryScreen extends React.Component {
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
