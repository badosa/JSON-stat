import React from "react";
import axios from "axios";
import JSONstat from "jsonstat";
import JSONstatUtils from "jsonstat-utils";

const getMessage=function(status){
  let msg=null;

  switch (status) {
    case "loading": msg=<span className="msg glyphicon glyphicon-refresh spinning"></span>; break;
    case "blank": msg=<span className="msg">Please, fill in all the inputs.</span>; break;
    case "https": msg=<span className="msg">Security violation: You are trying to access an http address from an https one. Go to <a href="http://json-stat.com/explorer/">http://json-stat.com/explorer/</a>.</span>; break;
    case "jsonstaterror": msg=<span className="msg">No valid JSON-stat/CSV-stat/SDMX-JSON was returned!</span>; break;
    case "neterror": msg=<span className="msg">Network error! Check the address you supplied.</span>; break;
  }

  return msg;
}

const fetchJsonStat=function(that, loadData, method, url, query, text){
  let bundle=0;

  if(method===null){
    loadData(null);
    return;
  }

  const
    processData=function(json){
      let type="JSON-stat";

      //CSV-stat? v.0.3.0
      if(typeof json==="string"){
        type=(json.trim().slice(0,8)==="jsonstat") ? "CSV-stat" : "CSV";
        json=JSONstatUtils.fromCSV(json);
      }else{
        //SDMX-JSON? v.0.2.0
        if(json.hasOwnProperty("structure") && json.hasOwnProperty("dataSets") //Could also be a weird JSON-stat bundle
            && Array.isArray(json.dataSets) && json.dataSets.length===1 //Only support for 1 dataset
            && json.dataSets[0].hasOwnProperty("observations")//Only flat flavor is supported (no series) (better look for dataset with "action": "Information"?)
          ){
    			 json=JSONstatUtils.fromSDMX(json);
           type="SDMX-JSON";
    		}
      }

      let data=JSONstat(json);

      if(!data.length){
        that.setState({status : "jsonstaterror"});
      }else{
        if(data.class==="bundle"){
          bundle=data.length;
          data=data.Dataset(0);
        }

        loadData(data, bundle, type);
        that.setState({status : "ok"});
      }
    };

    switch (method) {
      case "post":
        that.setState({status : "loading"});

        //We send query as a string instead of JSON to avoid preflight issue on Chrome
        axios.post(url, query)
          .then(function(resp){
            processData(resp.data);
          })
          .catch(function (error) {
            that.setState({status : "neterror"});
          });
      break;
      case "paste":
        processData(
          //JSON or CSV-stat? v.0.3.0
          text.trim().slice(0,1)==="{" ?
          JSON.parse(text) : text
        );
      break;
      default: //get
        that.setState({status : "loading"});

        axios.get(url)
          .then(function(resp){
            processData(resp.data);
          })
          .catch(function (error) {
            that.setState({status : "neterror"});
          })
        ;
    }
}

exports.fetchJsonStat=fetchJsonStat;
exports.getMessage=getMessage;
