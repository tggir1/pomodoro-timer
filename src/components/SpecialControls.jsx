import React, { Component } from 'react';

class SpecialControls extends Component {
  render() {
    return (
      <div className="SpecControls flex-please">
        <span id="label">{this.props.type} Length:</span>
        <div className="SpecButton-container">
          <button id="decButton" className="SpecButton" onClick={this.props.decrement}>-</button>
          <span id="length" className="SettingReadout">{this.props.length}</span>
          <button id="incButton" className="SpecButton" onClick={this.props.increment}>+</button>
        </div>
      </div>
    );
  }
}

export default SpecialControls;