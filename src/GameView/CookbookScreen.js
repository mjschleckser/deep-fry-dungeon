//////////////////////////////////////////////////////////////////////////////
///////////////////////////// Cookbook Screen ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
import React from 'react';
import { ReactComponent as CloseIcon } from '../svg/utility-close.svg';

export default class CookbookScreen extends React.Component {
  render(){
    var createCookbook = ()=>{
      var table=[];
      var cb = this.props.player.cookbook;
      for(let i=0; i < cb.length; i++){
        var ingredients = [];
        for(let x=0; x < cb[i].ingredients.length; x++){
          ingredients.push(<td>{cb[i].ingredients[x]}</td>)
        }
        table.push(
          <tr>
            <td>{cb[i].name}</td>
            <br/>
            {ingredients}
          </tr>
        );
      } // End for loop
      return table;
    } // End function
    return (
      <div className="cookbook">
        <button className="icon-button" onClick={this.props.functions.returnToDungeon}><CloseIcon/></button>
        <h2>Cookbook</h2>
        <table className="cookbook-container">
          {createCookbook()}
        </table>
      </div>
    );
  }
}
