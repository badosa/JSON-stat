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
    document.getElementById("alert").innerHTML="Table modified: column " + e.target.name + " " + (this.state.hide ? 'shown' : 'hidden');
  }

  render() {
    const
      id=this.props.id,
      data=this.props.data,
      role=data.role,
      size=data.length,
      title=this.props.checked ? id : data.label,
      aria="ARIA"+id.replace(/_/g, "__").replace(/ /g,"_")
    ;

    let icon="glyphicon glyphicon-signal";
    switch (role) {
      case "time": icon="glyphicon glyphicon-time"; break;
      case "geo": icon="glyphicon glyphicon-map-marker"; break;
      case "metric": icon="glyphicon glyphicon-dashboard"; break;
    }

    return (
      <li>
        <div class={`dimension ${this.state.hide ? "hidcol" : ""} ${this.state.show ? "selected" : ""}`}>
          <strong
            aria-controls={aria}
            title={`${this.state.show ? "Hide" : "Show"} the categories of this dimension`}
            tabindex="0"
            onClick={this.showCategories.bind(this)}
            onKeyPress={e=>{if(e.key==="Enter"){this.showCategories(e);}}}
          >
            <span title={role} className={icon}></span>
            {" "}{title} ({size})
          </strong>
          {size===1 ? <label title={`${this.state.hide ? "Show" : "Hide"} this constant dimension (${title})`}><input
            aria-controls="table"
            type="checkbox" name={id}
            onChange={this.hideColumn.bind(this)}
                      /> hide <span class="screenreader">({`${this.state.hide ? "Unckeck to show" : "Check to hide"} constant dimension ${title}`})</span></label>: null}
        </div>
        <Categories
          show={this.state.show}
          id={id}
          aria={aria}
          role={role}
          data={data}
          filterData={this.props.filterData}
        />
      </li>
    );
  }
}
