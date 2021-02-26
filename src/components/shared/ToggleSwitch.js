import React, { Component } from "react";
import Switch from "react-switch";
 
class ToggleSwitch extends Component {
  constructor(props) {
    super(props);
    this.state = { checked: props.checked };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate(prevProps){
    if(this.props.checked !== prevProps.checked){
      this.setState({checked: this.props.checked})
    }
  }
 
  handleChange(checked) {
    this.setState({ checked });
    this.props.onClicked.call()
  }
 
  render() {
    return (
      <label style={{marginTop:'6px'}}>
        <Switch onChange={this.handleChange} checked={this.state.checked} />
        <span style={{position:'absolute',top:'10px',left:'75px'}}>{this.props.title}</span>
      </label>
    );
  }
}
 
export default ToggleSwitch;