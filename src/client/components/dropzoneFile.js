import React from 'react';
import Dropzone from 'react-dropzone';

const UploadButton = ({ fileToBeConverted, onConvertedFileChange }) => (
    <button
      type="button"
      className="btn btn-outline-dark"
      onClick={onConvertedFileChange}
      disabled={!fileToBeConverted.name}>Upload File</button>
);

const DropzoneMainText = ({ isDragActive, isDragAccept, isDragReject, acceptedFiles }) => {
  if (isDragActive) {
    if (isDragAccept) {
      return (
        <p className="lead m-0 text-success">Drop your .wav file here</p>
      );
    } else if (isDragReject) {
      return (
        <p className="lead m-0 text-danger">Wrong file format, please choose a .wav file</p>
      );
    }
  } else if (acceptedFiles[0]) {
    return (
      <p className="lead m-0 text-success"> Received file: {acceptedFiles[0].name}</p>
    );
  }
  return (
    <p className="lead m-0">Drag your .wav file here</p>
  );
};

const DropzoneSubtext = ({ isDragActive, acceptedFiles }) => (
  <p className={isDragActive || acceptedFiles[0] ? 'invisible' : 'visible'}>
    <small>or <a className="text-primary" style={{ cursor: 'pointer' }}>browse</a> to choose a file.
    </small>
  </p>
);

const DropzoneText = (props) => (
  <div>
    <DropzoneMainText {...props} />
    <DropzoneSubtext {...props} />
  </div>
);

const DropzoneFile = ({ fileToBeConverted, onConvertedFileChange, onFileToBeConvertedChange }) => (
  <div className="row">
    <div className="col">
      <Dropzone
        accept="audio/wav"
        multiple={false}
        onDrop={onFileToBeConvertedChange}>
        {(dropzoneProps) => {
          const { getRootProps, getInputProps } = dropzoneProps;
          return (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <div className="jumbotron shadow bg-white p-5">
                <i className="fas fa-file-upload fa-3x m-3"/>
                <DropzoneText {...dropzoneProps}/>
              </div>
            </div>
          );
        }}
      </Dropzone>
      <UploadButton
        fileToBeConverted={fileToBeConverted}
        onConvertedFileChange={onConvertedFileChange}/>
    </div>
  </div>
);

export default DropzoneFile;
