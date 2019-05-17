import React, { Component } from 'react';

class Timer extends Component {
  render() {
    return (
      <div className="Timer flex-please">
        <span id="time-left" style={this.props.alarmColor}> {this.props.minutes}:{this.props.secs} </span>
        <span id="timer-label"> {this.props.cycleMessage} </span>
        <div id="Tbutton-container">
          <button id="reset" className="Tbutton" onClick={this.props.reset}>Reset</button>
          <button id="start_stop" className="Tbutton" onClick={this.props.startStop}>{this.props.buttonText}</button>
        </div>
      </div>
    );
  }
}

export default Timer;