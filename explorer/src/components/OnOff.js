import React from "react";

export default class OnOff extends React.Component {
  render() {
    return (
      <div
        aria-controls={this.props.aria}
        tabindex="0"
        title={`${this.props.checked ? "Hide" : "Show"} ${this.props.text}`}
        onClick={this.props.toggle.bind(this)}
        onKeyPress={e=>{if(e.key==="Enter"){this.props.toggle(e);}}}
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
