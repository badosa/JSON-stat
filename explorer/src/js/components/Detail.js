import React from "react";
import Collection from "./Collection";
import Dataset from "./Dataset";

export default class Detail extends React.Component {
  render() {
    const data=this.props.data;

    if(data!==null){
      if(data.class==="collection"){
        return (
            <Collection
              data={data.Item()}
              changeUrl={this.props.changeUrl.bind(this)}
            />
        );
      }

      //Dataset
      return (
          <Dataset
            key={Date.now()} //Reset your previous state
            data={data}
          />
      );
    }

    return null;
  }
}
