import React from "react";

export default class DataBody extends React.Component {
  render() {
    const
      data=this.props.data,
      ids=this.props.ids,
      filters=this.props.filters,
      removed=this.props.removed,
      counter=this.props.counter,
      unit=this.props.unit,
      status=this.props.status,
      format=(Number.toLocaleString) ?
    				function(v, d){
              if(v===null){
                return v;
              }
    					//toLocaleString because has better support than new Intl.NumberFormat(locale, { minimumFractionDigits: d }).format(v)
    					return (d===null) ?
    						v.toLocaleString("en-US")
    						:
    						v.toLocaleString("en-US", {minimumFractionDigits: d, maximumFractionDigits: d})
    					;
    				}
    				:
    				//If browser does not support toLocaleString
    				function(v, d){
    					return (v===null || d===null) ? v : v.toFixed(d);
    				}
    ;

    return (
      <tbody>
        {data.map(function(row, i) {
          let value=row.value;

          if(row.unit){
            value=format(value, row.unit.decimals || null);

            if(unit){
              if(row.unit.symbol){
                if(row.unit.position==="start"){
                  value=`${row.unit.symbol}${value}`;
                }else{
                  value=`${value} ${row.unit.symbol}`;
                }
              }

              if(row.unit.label){
                value=`${value} ${row.unit.label}`;
              }
            }
          }

          return (
            <tr key={i}>
              {counter ? <td className="number counter">{i+1}</td> : null}
              {ids.map(function(cell, j) {
                return (
                removed.indexOf(cell)!==-1 ? null :
                  <td
                    key={j}
                    className={ (j===row.length-1) ?
                      "number value"
                      :
                      filters[cell] ? "selected" : null
                    }
                  >{row[cell]}</td>
                );
              })}
            <td className="number value">{value}</td>
            {status ? <td className="status">{row.status}</td> : null}
          </tr>);
      })}
      </tbody>
    );
  }
}
