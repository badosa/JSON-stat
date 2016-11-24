import React from "react";

export default class OnOff extends React.Component {
  render() {
    return (
      <div
        title={`Show ${this.props.text}`}
        onClick={this.props.toggle.bind(this)}
        className={`${this.props.text} ${this.props.checked ? "on" : "off"}`}>
        <span className={`cntrl ${this.props.circle ? "circle" : ""}`}></span>
        {" "}
        <span className="cntrllabel">{this.props.text}</span>
      </div>
    );
  }
}

OnOff.defaultProps = {
  circle: true
};
