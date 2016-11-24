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
      <section>
        <nav>
          <div className={`tab ${this.state.tab==="retrieve" ? "selected" : ""}`} data-id="retrieve" onClick={this.handleTab.bind(this)}>Retrieve</div>
          <div className={`tab ${this.state.tab==="paste" ? "selected" : ""}`} data-id="paste" onClick={this.handleTab.bind(this)}>Paste</div>
          {" "} some JSON-stat
        </nav>
        {
          this.state.tab==="retrieve" ?
            <Retrieve
              loadData={this.props.loadData}
            />
            :
            <Paste
              loadData={this.props.loadData}
            />
        }
      </section>
    );
  }
}
