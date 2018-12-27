import React, { Component } from 'react';
import Peaks from 'peaks.js';

const PlayButton = ({ onPlayButtonClick, isPlaying }) => (
  <button
    type="button"
    className="btn btn-outline-dark px-5 m-3"
    onClick={onPlayButtonClick}>
    {isPlaying ? <i className="fas fa-pause"/> : <i className="fas fa-play" />}
  </button>
);

const ZoomInButton = ({ onZoomInButtonClick }) => (
  <button
    type="button"
    className="btn btn-outline-dark m-1"
    onClick={onZoomInButtonClick}>
    <i className="fas fa-search-plus" />
  </button>
);

const ZoomOutButton = ({ onZoomOutButtonClick }) => (
  <button
    type="button"
    className="btn btn-outline-dark m-1"
    onClick={onZoomOutButtonClick}>
    <i className="fas fa-search-minus" />
  </button>
);

const SeekTimeButton = ({ onTimeSeekButtonClick, timestamp }) => (
  <button
    type="button"
    className="btn btn-outline-dark"
    onClick={onTimeSeekButtonClick}
    disabled={!timestamp}>
    Go
  </button>
);

const SeekTimeInput = ({ onTimeSeekChange, onTimeSeekButtonClick, timestamp }) => {
  const inputChanged = e => {
    e.preventDefault();
    onTimeSeekChange(e.target.value);
  };
  return (
    <div className="input-group mb-3">
      <input
        type="number"
        step="0.01"
        className="form-control"
        placeholder="Timestamp in seconds, e.g. 5.85"
        aria-label="Timestamp in seconds, e.g. 5.85"
        aria-describedby="button"
        value={timestamp}
        onChange={inputChanged}/>
      <div className="input-group-append">
        <SeekTimeButton
          onTimeSeekButtonClick={onTimeSeekButtonClick}
          timestamp={timestamp}/>
      </div>
    </div>
  );
};

const PeaksJSChart = ({ audioFilePath }) => (
  <div>
    <div id="peaks-container"/>
    <audio>
      <source src={audioFilePath} type="audio/wav"/>
    </audio>
  </div>
);

const PeaksJSControls = ({ handlePlayPauseClick, handleZoomInClick, handleZoomOutClick, handleSeekTimeChange, handleSeekTimeClick, isPlaying, timestamp }) => (
  <div>
    <PlayButton
      onPlayButtonClick={handlePlayPauseClick}
      isPlaying={isPlaying}/>
    <ZoomInButton
      onZoomInButtonClick={handleZoomInClick}/>
    <ZoomOutButton
      onZoomOutButtonClick={handleZoomOutClick}/>
    <SeekTimeInput
      onTimeSeekChange={handleSeekTimeChange}
      onTimeSeekButtonClick={handleSeekTimeClick}
      timestamp={timestamp}/>
  </div>
);

class AudioChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peaksInstance: {},
      isPlaying: false,
      timestamp: ''
    };
  }

  componentDidMount() {
    const audioJSONPath = `/audio-files/${this.props.convertedFileName}.json`;
    const peaksInstance = Peaks.init({
      container: document.querySelector('#peaks-container'),
      mediaElement: document.querySelector('audio'),
      dataUri: audioJSONPath,
      zoomLevels: [128, 256, 512, 1024, 2048]
    });

    this.setState({ peaksInstance });
  }

  handlePlayPauseClick = () => {
    if (this.state.isPlaying) {
      this.state.peaksInstance.player.pause();
      this.setState({ isPlaying: false });
    } else {
      this.state.peaksInstance.player.play();
      this.setState({ isPlaying: true });
    }
  };

  handleZoomInClick = () => {
    this.state.peaksInstance.zoom.zoomIn();
  };

  handleZoomOutClick = () => {
    this.state.peaksInstance.zoom.zoomOut();
  };

  handleSeekTimeClick = () => {
    const time = parseInt(this.state.timestamp, 10);
    this.state.peaksInstance.player.seek(time);
  };

  handleSeekTimeChange = (time) => {
    this.setState({ timestamp: time });
  };

  render() {
    const audioFilePath = `/audio-files/${this.props.convertedFileName}.wav`;
    const { peaksInstance } = this.state;
    return (
      <div className="row">
        <div className="col">
          <PeaksJSChart
            audioFilePath={audioFilePath}/>
          {peaksInstance.player &&
          <PeaksJSControls
            handlePlayPauseClick={this.handlePlayPauseClick}
            handleZoomInClick={this.handleZoomInClick}
            handleZoomOutClick={this.handleZoomOutClick}
            handleSeekTimeChange={this.handleSeekTimeChange}
            handleSeekTimeClick={this.handleSeekTimeClick}
            isPlaying={this.state.isPlaying}
            timestamp={this.state.timestamp}
          />}
        </div>
      </div>
    );
  }
}

export default AudioChart;
