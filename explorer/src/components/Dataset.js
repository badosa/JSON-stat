import React from "react";
import Dimensions from "./Dimensions";
import Data from "./Data";

export default class Dataset extends React.Component {
  constructor() {
    super();
    this.state={
        filters: {},
        checked: false,
        hide: []
    };
  }

  toggleId() {
    this.setState({checked: !this.state.checked});
  }

  hideColumn(id){
    let hide=this.state.hide;
    const index=hide.indexOf(id);

    if(index<0){
      hide.push(id);
      this.setState({ hide });
    }else{
      hide.splice(index, 1);
      this.setState({ hide });
    }
  }

  filterData(dimid, catid, catlabel) {
    let filters=this.state.filters;

    if(catid!==null){
      filters[dimid]={ id: catid, label: catlabel };
    }else{
      delete filters[dimid];
    }
    this.setState({ filters });
  }

  getTableData() {
    const
      filters=this.state.filters,
      content=this.state.checked ? "id" : "label"
    ;

    let tbl=this.props.data.toTable({
      type: "arrobj",
      content,
      field: "id",
      status: true,
      unit: true
    });

    for(let f in filters){
      tbl=tbl.filter((e)=>e[f]===filters[f][content]);
    }
    return tbl;
  }

  render() {
    const
      data=this.props.data,
      metric=data.Dimension({role: "metric"}),
      unit=(metric && metric[0].Category(0).unit) ? metric[0].Category(0).unit : null
    ;

    return (
      <section id="dataset">
        <Dimensions
          data={data}
          filterData={this.filterData.bind(this)}
          hideColumn={this.hideColumn.bind(this)}
        />
        <Data
          data={this.getTableData()}
          n={data.n}
          ids={data.id}
          labels={data.Dimension().map((e)=>e.label)}
          filters={this.state.filters}
          toggleId={this.toggleId.bind(this)}
          show={this.state.checked}
          removed={this.state.hide}
          unit={(unit && (unit.label || unit.symbol || typeof unit.decimals!=="undefined"))}
        />
      </section>
    );
  }
}
