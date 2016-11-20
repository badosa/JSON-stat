import React from "react";
import Dimension from "./Dimension";
import OnOff from "./OnOff";

export default class Dimensions extends React.Component {
  constructor() {
    super();
    this.state = {
      checked: false
    };
  }

  toggleId() {
    this.setState({checked: !this.state.checked});
  }

  render() {
    const data=this.props.data;

    return (
      <div id="dimensions">
        <header>
          Dataset&rsquo;s Dimensions
          <OnOff
            text="id"
            checked={this.state.checked}
            toggle={this.toggleId.bind(this)}
          />
        </header>
        <ul>
          {data.id.map((dimid,i) => (
            <Dimension
              data={data.Dimension(dimid)}
              checked={this.state.checked}
              key={dimid}
              id={dimid}
              filterData={this.props.filterData}
              hideColumn={this.props.hideColumn}
            />
          ))}
        </ul>
      </div>
    );
  }
}
