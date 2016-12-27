import React from "react";
import Summary from "./Summary";
import Detail from "./Detail";

export default class Output extends React.Component {
  render() {
    const data=this.props.data;

    if(!data){
      return (
        <section>
          <p>Welcome to the <strong>JSON-stat Explorer</strong>. This tool allows you to retrieve a <a href="https://json-stat.org">JSON-stat document</a> from a web address or paste some JSON-stat code and explore its content.</p>
          <p>It is mainly designed to display JSON-stat <strong>datasets</strong> but it also accepts JSON-stat <strong>collections</strong> or <strong>bundles</strong>. If the input is a bundle, the content of the first dataset in it will be automatically displayed.</p>
        </section>
      );
    }

    const
      bundle=this.props.bundle,
      className=data.class,
      size=(className==="dataset") ? data.n + " values" : data.length + " items"
    ;

    return (
      <div>
        <Summary
          label={data.label}
          className={className}
          updated={data.updated}
          source={data.source}
          bundle={bundle}
          size={size}
          extension={data.extension}
        />
        <Detail
          data={data}
          changeUrl={this.props.changeUrl.bind(this)}
        />
      </div>
    );
  }
}
