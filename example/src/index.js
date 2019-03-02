import React from 'react';
import ReactDOM from 'react-dom';
import Upload from './upload';
import Labels from './labels';
import ImageLabeler from '../../dist';

const imageLabeler = new ImageLabeler();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      labels: [],
    };
  }

  onUpload = src => {
    this.setState({
      loading: true,
    });
    const img = new Image();
    img.src = src;
    img.onload = () => {
      imageLabeler.label(img, {
        numberOfLabels: 200,
        filters: [1, 0.5, 0.25],
        includeConfidence: true,
      }).then(labels => {
        this.setState({
          loading: false,
          labels,
        });
      });
    }
  }

  render() {
    return (
      <div className="container">
        <div className="left">
          <Upload onUpload={this.onUpload} />
        </div>
        <div className="right">
          {this.state.loading && <p>Loading</p>}
          <Labels labels={this.state.labels} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
