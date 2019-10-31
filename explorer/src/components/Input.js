import React from "react";
import Retrieve from "./Retrieve";
import Paste from "./Paste";

export default class Input extends React.Component {
  constructor() {
    super();
    this.state = {
      tab: "retrieve"
    };
  }

  handleTab(e) {
    this.setState({ tab: e.currentTarget.dataset.id });
  }

  render() {
    return (
      <nav>
        <div role="tablist" aria-label="Input mode">
          <div aria-controls="form" role="tab" aria-selected={this.state.tab==="retrieve"} tabindex={this.state.tab==="retrieve" ? null : "0"} className={`tab ${this.state.tab==="retrieve" ? "selected" : ""}`} data-id="retrieve" onClick={this.handleTab.bind(this)} onKeyPress={e=>{if(e.key==="Enter"){this.handleTab(e);}}}>Retrieve</div>
          <div aria-controls="form" role="tab" aria-selected={this.state.tab==="paste"} tabindex={this.state.tab==="paste" ? null : "0"} className={`tab ${this.state.tab==="paste" ? "selected" : ""}`} data-id="paste" onClick={this.handleTab.bind(this)} onKeyPress={e=>{if(e.key==="Enter"){this.handleTab(e);}}}>Paste</div>
          {" "} some JSON-stat
        </div>
        {
          this.state.tab==="retrieve" ?
            <Retrieve
              loadData={this.props.loadData}
              version={this.props.version}
            />
            :
            <Paste
              loadData={this.props.loadData}
              version={this.props.version}
            />
        }
      </nav>
    );
  }
}
