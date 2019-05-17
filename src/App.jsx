import React from 'react';
import accurate from 'accurate-interval';
import './App.css';
import Timer from './components/Timer';
import SpecialControls from './components/SpecialControls';
import accurateInterval from 'accurate-interval';

class Pomodoro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: 'fresh',
      timerState: 'none',
      sessionMins: 25,
      breakMins: 5,
      displayMins: 25,
      secs: 0,
      cycleCount: 0,
      alarmColor: { color: '#84ef45' }
    }
    this.resetAll = this.resetAll.bind(this);

    this.handleTimer = this.handleTimer.bind(this);
    this.runTimer = this.runTimer.bind(this);
    this.cycleHandler = this.cycleHandler.bind(this);

    this.handleSeshUp = this.handleSeshUp.bind(this);
    this.handleSeshDown = this.handleSeshDown.bind(this);
    this.handleBreakUp = this.handleBreakUp.bind(this);
    this.handleBreakDown = this.handleBreakDown.bind(this);
  }

  resetAll() {
    this.intervalHandle.clear();
    this.setState({
      appState: 'fresh',
      timerState: 'none',
      sessionMins: 25,
      breakMins: 5,
      displayMins: 25,
      secs: 0,
      cycleCount: 0,
      alarmColor: { color: '#84ef45' }
    });
  }

  handleTimer() {
    switch (this.state.timerState) {
      case 'none':
        this.setState({
          appState: 'session',
          timerState: 'running'
        });
        this.intervalHandle = accurateInterval(this.runTimer, 1000);
        break;
      case 'paused':
        this.setState({
          timerState: 'running'
        });
        this.intervalHandle = accurateInterval(this.runTimer, 1000);
        break;
      case 'running':
        this.setState({
          timerState: 'paused'
        });
        this.intervalHandle.clear();
        break;
      default:
        alert('handleTimer error');
    }
  }
  runTimer() {
    if (this.state.displayMins == 1 && this.state.secs == 0) {
      this.setState({
        alarmColor: { color: '#cf6679' }
      });
    }
    if (this.state.displayMins == 0 && this.state.secs == 0) {
      this.cycleHandler();
    } else if (this.state.secs == 0) {
      this.setState({
        secs: 59,
        displayMins: this.state.displayMins - 1,
      });
    } else {
      this.setState({
        secs: this.state.secs - 1
      });
    }
  }
  cycleHandler() { // even == 'session' , odd == 'break'
    if (this.state.cycleCount == 7) {
      this.resetAll();
      clearInterval(this.intervalHandle);
    } else if (this.state.cycleCount % 2 == 0) {
      this.setState({
        appState: 'break',
        displayMins: this.state.breakMins,
        cycleCount: this.state.cycleCount + 1,
        alarmColor: { color: '#7eeedb' }
      });
    } else {
      this.setState({
        appState: 'session',
        displayMins: this.state.sessionMins,
        cycleCount: this.state.cycleCount + 1,
        alarmColor: { color: '#84ef45' }
      });
    }
  }

  handleSeshUp() {
    if (this.state.sessionMins < 60) {
      switch (this.state.appState) {
        case 'fresh':
          this.setState({
            sessionMins: this.state.sessionMins + 1,
            displayMins: this.state.displayMins + 1
          });
          break;
        case 'session':
          this.setState({
            displayMins: this.state.displayMins + 1,
            alarmColor: { color: '#84ef45' }
          });
          break;
        case 'break':
          this.setState({
            sessionMins: this.state.sessionMins + 1
          });
          break;
        default:
          alert('handleSeshUp broken')
      }
    }
  }
  handleSeshDown() {
    if (this.state.sessionMins >= 1) {
      if (this.state.appState == 'fresh' && this.state.displayMins > 1) {
        this.setState({
          displayMins: this.state.displayMins - 1,
          sessionMins: this.state.sessionMins - 1
        });
      }
      if (this.state.appState == 'session' && this.state.displayMins > 0) {
        this.setState({
          displayMins: this.state.displayMins - 1
        });
        if (this.state.displayMins == 1) {
          this.setState({
            alarmColor: { color: '#cf6679' }
          });
        }
      }
      if (this.state.appState == 'break' && this.state.sessionMins > 1) {
        this.setState({
          sessionMins: this.state.sessionMins - 1
        });
      }
    }
  }
  handleBreakUp() {
    if (this.state.breakMins < 30) {
      if (this.state.appState == 'fresh' || this.state.appState == 'session') {
        this.setState({
          breakMins: this.state.breakMins + 1
        });
      } else if (this.state.appState == 'break') {
        this.setState({
          displayMins: this.state.displayMins + 1,
          alarmColor: { color: '#7eeedb' }
        });
      }
    }
  }
  handleBreakDown() {
    if (this.state.breakMins >= 1) {
      if ((this.state.appState == 'fresh' || this.state.appState == 'session') && this.state.breakMins > 1) {
        this.setState({
          breakMins: this.state.breakMins - 1
        });
      }
      if (this.state.appState == 'break' && this.state.displayMins > 0) {
        this.setState({
          displayMins: this.state.displayMins - 1,
        });
        if (this.state.displayMins == 1) {
          this.setState({
            alarmColor: { color: '#cf6679' }
          });
        }
      }
    }
  }

  render() {
    return (
      <div className="Main flex-please">
        <h1>Pomodoro Timer</h1>
        <Timer
          alarmColor={this.state.alarmColor}
          minutes={this.state.displayMins}
          secs={(this.state.appState == 'fresh') ? '00' : (this.state.secs < 10) ? '0' + this.state.secs : this.state.secs}
          cycleMessage={(this.state.appState == 'fresh') ? 'Press Start' : (this.state.appState == 'session') ? 'Session' : 'Break'}
          buttonText={(this.state.timerState == 'running') ? 'Pause' : 'Start'}
          reset={this.resetAll}
          startStop={this.handleTimer}
        />
        <div className="Settings-container">
          <SpecialControls
            type='Session'
            s={(this.state.sessionMins > 1) ? 's' : ''}
            length={this.state.sessionMins}
            decrement={this.handleSeshDown}
            increment={this.handleSeshUp}
          />
          <SpecialControls
            type='Break'
            s={(this.state.breakMins > 1) ? 's' : ''}
            length={this.state.breakMins}
            decrement={this.handleBreakDown}
            increment={this.handleBreakUp}
          />
        </div>
      </div>
    );
  }
}

export default Pomodoro;