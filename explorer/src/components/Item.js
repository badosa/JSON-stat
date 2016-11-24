import React from "react";
import Dimension from "./Dimension";
import {getMessage} from "./XHRUtils";

export default class Item extends React.Component {
  constructor() {
    super();
    this.state = {
      status: "ok"
    };
  }

  onClick(href) {
    this.setState({status: "loading"});
    this.props.changeUrl(href);
  }

  render() {
    const msg=getMessage(this.state.status);

    return (
      <li
        onClick={this.onClick.bind(this, this.props.href)}
      >
        {this.props.label} [{this.props.className}]
        {msg}
      </li>
    );
  }
}
