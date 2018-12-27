import React, { Component } from 'react';
import AudioChart from './components/audioChart';
import DropzoneFile from './components/dropzoneFile';

const Spinner = ({ isConverting }) => (
  <div> {isConverting && <i className="fas fa-circle-notch fa-3x fa-spin text-dark"/>} </div>
);

const Header = () => (
  <div className="row m-3">
    <div className="col">
      <h1 className="display-4 m-0">Wav File Converter</h1>
      <p>
        <small>Converting a wav file to waveform is suuuuuper easy.</small>
      </p>
    </div>
  </div>
);

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      fileToBeConverted: {},
      convertedFileName: '',
      isConverting: false
    };

    this.handleFileToBeConverted = this.handleFileToBeConverted.bind(this);
    this.handleConvertedFile = this.handleConvertedFile.bind(this);
  }

  handleFileToBeConverted(files) {
    if (files.length === 1) {
      this.setState({
        fileToBeConverted: files[0],
      });
    }
  }

  handleConvertedFile() {
    this.setState({ isConverting: true });

    let data = new FormData();
    data.append('file', this.state.fileToBeConverted);
    // might need to polyfill this in case browser does not support fetch
    fetch('/api/file', {
      method: 'POST',
      body: data
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        const err = res.body;
        throw new Error(err);
      })
      .then(file => {
        this.setState({
          convertedFileName: file.fileName,
          isConverting: false,
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    let app;

    if (this.state.convertedFileName) {
      app = <AudioChart convertedFileName={this.state.convertedFileName}/>;
    } else if (this.state.isConverting) {
      app = <Spinner isConverting={this.state.isConverting}/>;
    } else {
      app = <DropzoneFile
        fileToBeConverted={this.state.fileToBeConverted}
        onFileToBeConvertedChange={this.handleFileToBeConverted}
        onConvertedFileChange={this.handleConvertedFile}/>;
    }

    return (
      <div className="container-fluid d-flex justify-content-center bg-light"
           style={{ minHeight: '100%' }}>
        <div className="row text-center">
          <div className="col my-auto">
            <Header />
            {app}
          </div>
        </div>
      </div>
    );
  }
};
