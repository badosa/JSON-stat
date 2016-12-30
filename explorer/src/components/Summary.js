import React from "react";

export default class Summary extends React.Component {
  render() {
    return (
      <header id="summary">
        <div><strong>{this.props.label}</strong></div>
        <div>{
          !this.props.bundle ?
          this.props.className :
          this.props.bundle===1 ?
        "First and only dataset in the bundle" : "First dataset (of " + this.props.bundle + ") in the bundle"} ({this.props.size})</div>
        {this.props.source ? <div>{this.props.source}</div> : null}
        {this.props.updated ? <div>{this.props.updated}</div> : null}
        {this.props.extension ? <div>Extension information found <pre>{JSON.stringify(this.props.extension, null, 3).replace(/:("|{|\[)/g, ': $1')}</pre></div> : null}
      </header>
    );
  }
}
