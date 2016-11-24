import React from "react";
import Input from "./Input";
import Output from "./Output";
import {fetchJsonStat} from "./XHRUtils";

export default class Layout extends React.Component {
  constructor() {
    super();
    this.state = {
      data: null,
      bundle: false
    };
  }

  loadData(data, bundle) {
    this.setState({ data, bundle });
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
        />
        <Output
          data={this.state.data}
          bundle={this.state.bundle}
          changeUrl={this.changeUrl.bind(this)}
        />
      </div>
    );
  }
}
