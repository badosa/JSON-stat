import React from "react";
import Categories from "./Categories";

export default class Dimension extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
      hide: false
    };
  }

  showCategories(){
    this.setState({ show: !this.state.show });
  }

  hideColumn(e){
    this.setState({hide: !this.state.hide});
    this.props.hideColumn(e.target.name);
  }

  render() {
    const
      id=this.props.id,
      data=this.props.data,
      role=data.role,
      size=data.length,
      title=this.props.checked ? id : data.label
    ;

    let icon="glyphicon glyphicon-signal";
    switch (role) {
      case "time": icon="glyphicon glyphicon-time"; break; //calendar
      case "geo": icon="glyphicon glyphicon-map-marker"; break;
      case "metric": icon="glyphicon glyphicon-dashboard"; break;
    }

    return (
      <li>
        <div class={`dimension ${this.state.hide ? "hidcol" : ""} ${this.state.show ? "selected" : ""}`}>
          <strong onClick={this.showCategories.bind(this)}>
            <span title={role} className={icon}></span>
            {" "}{title} ({size})
          </strong>
          {size===1 ? <label><input
            type="checkbox" name={this.props.id}
            onChange={this.hideColumn.bind(this)}
                             /> hide</label>: null}
        </div>
        <Categories
          show={this.state.show}
          id={id}
          role={role}
          data={data}
          filterData={this.props.filterData}
        />
      </li>
    );
  }
}
