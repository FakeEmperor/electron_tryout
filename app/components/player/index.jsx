// Import React
import React from 'react';
import ClassNames from 'classnames';

import styles from './styles.scss';

// Player component class
class Player extends React.Component {

  render(){
    // Dynamic class names with ClassNames
    const playPauseClass = ClassNames({
      'player__main-play': this.props.playStatus != 'PLAYING',
      'player__main-pause': this.props.playStatus == 'PLAYING'
    });

    // Return JSX
    return(
      <div className={ styles.player }>
        {/*Rewind Button*/}
        <div className="player__upper">

        </div>
        <div className="player__main">
          <img src='../assets/icons/rewind-1.svg' onClick={this.props.backward}/>
          <img className={styles.bigger} src={ `../assets/icons/${ this.props.playStatus != 'PLAYING' ? "play-button-1.svg": "pause-1.svg"}`} onClick={this.props.togglePlay}/>
          <img src='../assets/icons/fast-forward-1.svg' onClick={this.props.forward}/>
        </div>
        {/*Forward Button*/}
        <div className="player__lower">
          <img src='../assets/icons/stop-1.svg' onClick={this.props.stop}/>
          <img src='../assets/icons/repeat-1.svg' onClick={this.props.random}/>
        </div>
      </div>
    )
  }

}

// Export Player
export default Player
