import React from "react";
import Item from "./Item";

export default class Collection extends React.Component {
  render() {
    return (
      <section id="collection">
        <header>Collection&rsquo;s Content</header>
        <ul class="collection">
          {this.props.data.map((data) => (
            <Item
              key={data.href}
              className={data.class}
              label={data.label}
              href={data.href}
              changeUrl={this.props.changeUrl.bind(this)}
            />
          ))}
        </ul>
      </section>
    );
  }
}
