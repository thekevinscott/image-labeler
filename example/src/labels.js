import React from 'react';

class Label extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };
  }

  componentDidMount() {
    let timeout = this.props.index * 50;
    if (timeout > 1500) {
      timeout = 1500;
    }

    setTimeout(() => {
      this.setState({
        show: true,
      });
    }, timeout);
  }

  render() {
    return (
      <li className={this.state.show ? 'show' : ''}><span>{this.props.label.label}</span> <span>({(this.props.label.confidence * 100).toFixed(2)}%)</span></li>
    );
  }
}

class Labels extends React.Component {
  render() {
    return (
      <ul>
        {this.props.labels.map((label, key) => (
          <Label
            key={key}
            index={key}
            label={label}
          />
        ))}
      </ul>
    );
  }
}

export default Labels;
