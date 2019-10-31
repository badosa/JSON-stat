import React from "react";

export default class Summary extends React.Component {
  render() {
    const className=this.props.className;

    return (
      <header id="summary">
        {this.props.label ? <div><h1>{this.props.label}</h1></div> : null}
        <div>{this.props.type}. {
          !this.props.bundle ?
          className.charAt(0).toUpperCase() + className.slice(1) :
          this.props.bundle===1 ?
        "First and only dataset in the bundle" : "First dataset (of " + this.props.bundle + ") in the bundle"} ({this.props.size})
        </div>
        {this.props.source ? <div>{this.props.source}</div> : null}
        {this.props.updated ? <div>{this.props.updated}</div> : null}
        {this.props.extension ? <div>Extension information found <pre>{JSON.stringify(this.props.extension, null, 3).replace(/:("|{|\[)/g, ': $1')}</pre></div> : null}
      </header>
    );
  }
}
