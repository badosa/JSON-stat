import React from "react";
import OnOff from "./OnOff";

export default class Categories extends React.Component {
  constructor() {
    super();
    this.state={
      checked: false,
      selected: null
    };
  }

  toggleId() {
    this.setState({checked: !this.state.checked});
  }

  selectCat(id, label){
    if(id===this.state.selected){
      this.setState({ selected: null });
      this.props.filterData(this.props.id, null, null);
    }else{
      this.setState({ selected: id });
      this.props.filterData(this.props.id, id, label);
    }
  }

  render() {
    const
      data=this.props.data,
      that=this
    ;

    return (
      <div className={this.props.show ? "show" : "hidden"}>
        <OnOff
          text="id"
          checked={this.state.checked}
          toggle={this.toggleId.bind(this)}
        />
        <ul className="category">
          {data.id.map(function(id,i){
            const
              cat=data.Category(i),
              label=cat.label
            ;

            let title=(that.state.checked) ? id : label;

            if(data.role==="metric" && cat.unit){
              let unit=[];
              if(cat.unit.label){
                unit.push(cat.unit.label);
              }
              if(cat.unit.symbol){
                unit.push(cat.unit.symbol);
              }
              title+=(unit.length) ? ` (${unit.join(" ")})`: "";
            }

            return (
              <li
                className={ that.state.selected===id ? "selected" : null }
                key={id}
                onClick={that.selectCat.bind(that, id, label)}
              >{title}</li>
            );
          })}
        </ul>
      </div>
    );
  }
}

/*
{data.id.map((id,i)=>(
  <li
    className={ this.state.selected===id ? "selected" : "" }
    key={id}
    onClick={this.selectCat.bind(this, id, data.Category(i).label)}
  >{this.state.checked ? id : data.Category(i).label}</li>
))}
*/
