import React from "react";
import Input from "./Input";
import Output from "./Output";
import {fetchJsonStat} from "./XHRUtils";

export default class Layout extends React.Component {
  constructor() {
    super();
    this.state = {
      data: null,
      bundle: false,
      type: null,
      version: VERSION
    };
  }

  loadData(data, bundle, type) {
    //data is null when reset
    this.setState({ data, bundle, type });
  }

  changeUrl(url) {
    fetchJsonStat(
      this,
      this.loadData.bind(this),
      "get",
      url,
      null,
      null
    );
  }

  render() {
    return (
      <div>
        <Input
          loadData={this.loadData.bind(this)}
          version={this.state.version}
        />
        <Output
          data={this.state.data}
          bundle={this.state.bundle}
          type={this.state.type}
          changeUrl={this.changeUrl.bind(this)}
        />
      </div>
    );
  }
}
