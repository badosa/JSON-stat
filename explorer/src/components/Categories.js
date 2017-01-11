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
      that=this,
      unit=data.Category(0).unit
    ;

    return (
      <div className={this.props.show ? "show" : "hidden"}>
        {
          data.role==="metric"
          &&
          unit
          && (unit.label || unit.symbol || typeof unit.decimals!=="undefined")
            ?
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
              if(typeof cat.unit.decimals!=="undefined"){
                unit.push("dec=" + cat.unit.decimals);
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
        {
          data.extension ?
            <div className="extension">Extension information found<pre>{JSON.stringify(data.extension, null, 3).replace(/:("|{|\[)/g, ": $1")}</pre></div>
            :
            null
        }
      </div>
    );
  }
}
