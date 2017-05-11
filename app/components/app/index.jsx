import React, { Component } from 'react';
import electron, { ipcRenderer } from 'electron';
import moment from 'moment';
import styles from './styles.scss';
import BookList from '../book-list';
import Search from '../search'
import Details from '../details'
import Player from "../player";
import Progress from "../progress";
import Footer from "../footer";
import Axios from 'axios';
import Sound from 'react-sound';

import config from '../../config'

const AppAudioContext = (window.AudioContext || window.webkitAudioContext)

export default class App extends Component {

  constructor(props) {
    super(props);
    this._audioContext = (() => {
      if (AppAudioContext) {
        return new AppAudioContext()
      }
      throw new Error('Web Audio API is not supported.')
    })();
    // Client ID
    // Initial State
    this.state = {
      last_client_id_index: 0,
      // What ever is returned, we just need these 3 values
      track: {stream_url: '', title: '', artwork_url: ''},
      playStatus: Sound.status.STOPPED,
      elapsed: '00:00',
      total: '00:00',
      position: 0,
      playFromPosition: 0,
      autoCompleteValue: '',
      tracks: [],
      audio: null
    }
  }

  handleSelect(value, item){
    this.setState({ autoCompleteValue: value, track: item });
  }

  loadUrl(url) {
    //Request for a playlist via Soundcloud using a client id
    const onError = (err) => {
      const retry = this.state.last_client_id_index < config.client_ids.length;
      console.error(`Load url error (retrying: ${retry} ):  ${err}`);
      if( retry ) {
        this.state.last_client_id_index ++;
        return this.loadUrl(url)
      }
    };
    return Axios.get(`${url}?client_id=${config.client_ids[this.state.last_client_id_index]}`)
      .catch(onError)
  }


  handleChange(event, value) {

    // Update input box
    this.setState({autoCompleteValue: event.target.value});
    let _this = this;

    //Search for song with entered value
    Axios.get(`https://api.soundcloud.com/tracks?client_id=${config.client_ids[this.state.last_client_id_index]}&q=${value}`)
      .then(function (response) {
        // Update track state
        _this.setState({tracks: response.data});
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  static formatMilliseconds(milliseconds) {
    // Format hours
    var hours = Math.floor(milliseconds / 3600000);
    milliseconds = milliseconds % 3600000;

    // Format minutes
    var minutes = Math.floor(milliseconds / 60000);
    milliseconds = milliseconds % 60000;

    // Format seconds
    var seconds = Math.floor(milliseconds / 1000);
    milliseconds = Math.floor(milliseconds % 1000);

    // Return as string
    return (minutes < 10 ? '0' : '') + minutes + ':' +
      (seconds < 10 ? '0' : '') + seconds;
  }

  randomTrack () {
    this.loadUrl('https://api.soundcloud.com/playlists/209262931')
      .then((response) => {
        // Store the length of the tracks
        const trackLength = response.data.tracks.length;

        // Pick a random number
        const randomNumber = Math.floor((Math.random() * trackLength) + 1);

        // Set the track state with a random track from the playlist
        this.setState({track: response.data.tracks[randomNumber]});
      })
  }

  // componentDidMount lifecycle method. Called once a component is loaded
  componentDidMount() {

    this.randomTrack();
  }
  // Makes a request to the server (simulated for this tutorial)
  handleSubmit() {
    postRequest(this.state.value);
  }
  prepareUrl(url) {
    // Attach client id to stream url


    this.loadUrl(url);
    this.state.audio = new window.Audio(url);
    this.state.audio.addEventListener('loadstart', () => {
      this._sourceNode = this._audioContext.createMediaElementSource(this._audio)
      this._sourceNode.connect(this._sourceEffectNode)
    });

    this.state.audio.addEventListener('loadedmetadata', () => {
      console.log('loaded metadata');
    });
    this.state.audio.addEventListener('error', () => {
      const err = new Error('Unsupported music file: ' + url);
    });
    this.state.audio.play();
    return `${url}?client_id=${config.client_ids[this.state.last_client_id_index]}`
  }

  handleSongPlaying(audio) {
    this.setState({  elapsed: App.formatMilliseconds(audio.position),
      total: App.formatMilliseconds(audio.duration),
      position: audio.position / audio.duration })
  }

  handleSongFinished () {
    // Call random Track
    this.randomTrack();
  }

  togglePlay(){
    // Check current playing state
    if(this.state.playStatus === Sound.status.PLAYING){
      // Pause if playing
      this.setState({playStatus: Sound.status.PAUSED})
    } else {
      // Resume if paused
      this.setState({playStatus: Sound.status.PLAYING})
    }
  }

  stop(){
    // Stop sound
    this.setState({playStatus: Sound.status.STOPPED});
  }

  forward(){
    this.setState({playFromPosition: this.state.playFromPosition+=1000*10});
  }

  backward(){
    this.setState({playFromPosition: this.state.playFromPosition-=1000*10});
  }

  xlArtwork(url){
    if (url)
      return url.replace(/large/, 't500x500');
  }

  render() {
    let content;

    const scotchStyle = {

      backgroundImage: `url(${this.xlArtwork(this.state.track.artwork_url)})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center center'

  };

    return (

      <div className={ `${styles.wrapper} ${styles.main}` } >
        <div className={styles.bg} style={scotchStyle}>
        </div>
        <div className={ `${styles.wrapper} ${styles.main}` } >
          <div className={ styles["menu-bar"] }>
            <h1>Electron Tryout: Music Player</h1>
            <div className={ styles["controls"] }>
              <div className={ styles["controls__close"] }/>
              <div className={ styles["controls__hide"] }/>
              <div className={ styles["controls__maximize"] }/>
            </div>
          </div>
          <div className={ styles["wrapper-center"] }>
            {content}

            <div>
              <Search
                autoCompleteValue={this.state.autoCompleteValue}
                tracks={this.state.tracks}
                handleSelect={this.handleSelect.bind(this)}
                handleChange={this.handleChange.bind(this)}/>

              {/* Added Details Component */}
              <Details
                title={this.state.track.title}/>
              <Progress
                elapsed={this.state.elapsed}
                total={this.state.total}
                position={this.state.position}/>
              <Player
                togglePlay={this.togglePlay.bind(this)}
                stop={this.stop.bind(this)}
                playStatus={this.state.playStatus}
                forward={this.forward.bind(this)}
                backward={this.backward.bind(this)}
                random={this.randomTrack.bind(this)}/>

            </div>

          </div>


          <Sound
          url={this.prepareUrl(this.state.track.stream_url)}
          playStatus={this.state.playStatus}
          onPlaying={this.handleSongPlaying.bind(this)}
          playFromPosition={this.state.playFromPosition}
          onFinishedPlaying={this.handleSongFinished.bind(this)} />
          <Footer/>
        </div>
      </div>
    );
  }


}
