import React from "react";
import OnOff from "./OnOff";

export default class Categories extends React.Component {
  constructor() {
    super();
    this.state={
      id: false,
      unit: false,
      selected: null
    };
  }

  toggleId() {
    this.setState({id: !this.state.id});
  }

  toggleUnit() {
    this.setState({unit: !this.state.unit});
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
        {
          data.role==="metric" ?
            <OnOff
              text="unit"
              checked={this.state.unit}
              toggle={this.toggleUnit.bind(this)}
            />
            :
            null
        }
        <OnOff
          text="id"
          checked={this.state.id}
          toggle={this.toggleId.bind(this)}
        />
        <ul className="category">
          {data.id.map(function(id,i){
            const
              cat=data.Category(i),
              label=cat.label
            ;

            let
              title=(that.state.id) ? id : label,
              unitText=null
            ;

            if(that.state.unit && cat.unit){
              let unit=[];
              if(cat.unit.label){
                unit.push(cat.unit.label);
              }
              if(cat.unit.symbol){
                unit.push(cat.unit.symbol);
              }
              unitText=unit.length ? <em>{unit.join(" ")}</em> : null;
            }

            return (
              <li
                className={ that.state.selected===id ? "selected" : null }
                key={id}
                onClick={that.selectCat.bind(that, id, label)}
              >{title} {unitText}</li>
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
