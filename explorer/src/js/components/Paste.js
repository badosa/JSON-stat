import React from "react";
import {fetchJsonStat, getMessage} from "./XHRUtils";

export default class Paste extends React.Component {
  constructor() {
    super();
    this.state = {
      status: "ok"
    };
  }

  reset() {
    this.refs.jsonstat.value="";
  }

  submit() {
    const jsonstat=this.refs.jsonstat;

    if(!jsonstat.value.trim()){
      this.setState({ status: "blank" });
      return;
    }

    fetchJsonStat(
      this,
      this.props.loadData,
      "paste",
      null,
      null,
      jsonstat.value.trim()
    );
  }

  render() {
    return (
      <section id="form">
        <textarea ref="jsonstat" placeholder="JSON-stat code"></textarea>
        <button className="btn btn-primary" onClick={this.submit.bind(this)}>Send</button>
        <button className="btn" onClick={this.reset.bind(this)}>Reset</button>
        {getMessage(this.state.status)}
      </section>
    );
  }
}
