import React from "react";
import Summary from "./Summary";
import Detail from "./Detail";

export default class Output extends React.Component {
  render() {
    const data=this.props.data;

    if(!data){
      return (
        <main id="content">
          <h1 class="screenreader">Welcome</h1>
          <p>Welcome to the <strong>JSON-stat Explorer</strong>. This tool allows you to retrieve a <a href="https://json-stat.org">JSON-stat document</a> from a web address or paste some JSON-stat code and explore its content. <a href="https://github.com/badosa/CSV-stat">CSV-stat</a> and <a href="https://github.com/sdmx-twg/sdmx-json/blob/master/data-message/docs/1-sdmx-json-field-guide.md">SDMX-JSON</a> documents are also accepted.</p>
          <p>It is mainly designed to display JSON-stat <strong>datasets</strong> but it also accepts JSON-stat <strong>collections</strong> or <strong>bundles</strong>. If the input is a bundle, the content of the first dataset in it will be automatically displayed.</p>
        </main>
      );
    }

    const
      bundle=this.props.bundle,
      type=this.props.type,
      className=data.class,
      size=(className==="dataset") ? data.n + " values" : data.length + " items"
    ;

    document.getElementById("alert").innerHTML="Loaded: " + data.label;

    return (
      <main id="content" tabindex="-1">
        <Summary
          label={data.label}
          className={className}
          updated={data.updated}
          source={data.source}
          bundle={bundle}
          type={type}
          size={size}
          extension={data.extension}
        />
        <Detail
          data={data}
          changeUrl={this.props.changeUrl.bind(this)}
        />
      </main>
    );
  }
}
