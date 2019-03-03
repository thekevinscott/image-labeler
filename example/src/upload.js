import React from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';

class Upload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      src: null,
    };
  }

  onDrop = (acceptedFiles) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      this.setState({
        src: e.target.result,
      });

      this.props.onUpload(e.target.result);
    }

    reader.readAsDataURL(acceptedFiles[0]);
  }

  render() {
    return (
      <Dropzone onDrop={this.onDrop}>
        {({getRootProps, getInputProps, isDragActive}) => {
          return (
            <div
              {...getRootProps()}
              className={classNames('dropzone', {'dropzone--isActive': isDragActive})}
            >
              <input {...getInputProps()} />
              {this.state.src ? (
        <img src={this.state.src} />
              ) : 
                isDragActive ?
                  <p>Drop files here...</p> :
                  <p>Try dropping some files here, or click to select files to upload.</p>
              }
            </div>
          )
        }}
      </Dropzone>
    );
  }
}

export default Upload;
