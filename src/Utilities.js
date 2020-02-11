/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * UTILITY CLASSES * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
import React from 'react';
import './css/Utilities.css';

// ProgressBar
// Utility class to render a progress bar
// PARAMETERS: progress, progressMax, color, bgColor
// TODO: Allow displaying any text on the bar, not just percentage
export default class ProgressBar extends React.Component {
  render(){
    var outerBarStyle = {
      backgroundColor: this.props.bgColor,
      height: '24px'
    }
    var innerBarStyle = {
      backgroundColor: this.props.color,
      height: '100%',
      transition: 'width 0.3s ease',
      width: (this.props.progress / this.props.progressMax)* 100+"%",
      textAlign: 'left',
    }
    // TODO: Code the color of the text to always contrast both other colors
    var textStyle = {
      color: 'black',
      position: 'relative',
      top: '-24px'
    }
    return (
      <div style={outerBarStyle}>
        <div style={innerBarStyle}></div>
        <div style={textStyle}> &nbsp; {this.props.progress} / {this.props.progressMax} </div>
      </div>
    )
  }
}

// Collapsible
// Renders its contents in a collapsible div
// PARAMETERS: startOpen, title
export class Collapsible extends React.Component {
  constructor(props){
    super(props);
    var openState = (this.props.startOpen) ? true : false
    this.state = { open : openState }
  }
  handleClick(){
    this.setState({open: !(this.state.open)});
  }

  render(){
    // TODO: Finish adding active styles, maybe add transition
    // https://www.w3schools.com/howto/howto_js_collapsible.asp
    return (
      <div>
        <button className="panel" onClick={this.handleClick.bind(this)}>
          {this.props.title}
        </button>
        <div className={this.state.open ? "panel-content-open" : "panel-content-closed"}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
