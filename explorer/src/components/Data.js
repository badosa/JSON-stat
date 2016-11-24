import React from "react";
import DataHead from "./DataHead";
import DataBody from "./DataBody";
import OnOff from "./OnOff";

export default class Data extends React.Component {
  constructor() {
    super();
    this.state={
      counter: false,
      status: false,
      units: false
    };
  }

  toggleUnits() {
    this.setState({ units: !this.state.units });
  }

  toggleCounter() {
    this.setState({ counter: !this.state.counter });
  }

  toggleStatus() {
    this.setState({ status: !this.state.status });
  }

  render() {
    const
      data=this.props.data,
      len=data.length,

      filters=this.props.filters,
      nfilters=Object.keys(filters).length,
      tfilters=(nfilters===1) ? "1 filter" : `${nfilters} filters`,

      removed=this.props.removed,
      nremoved=removed.length,
      tremoved=(!nremoved) ? "" : (nremoved===1) ? " (1 hidden column)" : ` (${nremoved} hidden columns)`,

      caption=(len===this.props.n) ?
        `${len} values ${tremoved}`
        :
        `${len} of ${this.props.n} values (${tfilters} active) ${tremoved}`,

      units=(this.props.units) ? (
        <OnOff
          text="units"
          checked={this.state.units}
          toggle={this.toggleUnits.bind(this)}
        />
      ) : null
    ;

    return (
      <table>
        <caption>
          {caption}
          <OnOff
            text="id"
            checked={this.props.show}
            toggle={this.props.toggleId}
          />
          {units}
          <OnOff
            text="status"
            checked={this.state.status}
            circle={false}
            toggle={this.toggleStatus.bind(this)}
          />
          <OnOff
            text="counter"
            checked={this.state.counter}
            circle={false}
            toggle={this.toggleCounter.bind(this)}
          />
        </caption>
        <DataHead
          show={this.props.show}
          labels={this.props.labels}
          ids={this.props.ids}
          filters={filters}
          removed={removed}
          counter={this.state.counter}
          status={this.state.status}
        />
        <DataBody
          ids={this.props.ids}
          data={data}
          filters={this.props.filters}
          removed={removed}
          units={this.state.units}
          counter={this.state.counter}
          status={this.state.status}
        />
      </table>
    );
  }
}
