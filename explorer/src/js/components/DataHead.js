import React from "react";

export default class DataHead extends React.Component {
  render() {
    const
      labels=this.props.labels,
      filters=this.props.filters,
      ids=this.props.ids,
      show=this.props.show,
      removed=this.props.removed,
      counter=this.props.counter,
      status=this.props.status,
      item=!show ? labels : ids;
    ;

    return (
        <thead>
          <tr>
            {counter ? <th className="number counter">#</th> : null}
            {item.map((th, i) => (
              removed.indexOf(ids[i])!==-1 ? null :
                <th
                  className={filters[ids[i]] ? "selected" : null}
                  key={i}
              >{(!show) ? th[0].toUpperCase()+th.slice(1) : th}</th>
            ))}
            <th className="number value">Value</th>
            {status ? <th className="status">Status</th>: null}
          </tr>
        </thead>
    );
  }
}
