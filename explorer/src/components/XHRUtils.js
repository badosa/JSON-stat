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
    case "jsonstaterror": msg=<span className="msg">No valid JSON-stat was returned!</span>; break;
    case "neterror": msg=<span className="msg">Network error! Check the address you supplied.</span>; break;
  }

  return msg;
}

const fetchJsonStat=function(that, loadData, method, url, query, jsonstat){
  let bundle=0;

  const
    processData=function(json){

      //SDMX-JSON? v.0.2.0
      if(json.hasOwnProperty("structure") && json.hasOwnProperty("dataSets") //Could also be a weird JSON-stat bundle
          && Array.isArray(json.dataSets) && json.dataSets.length===1 //Only support for 1 dataset
          && json.dataSets[0].hasOwnProperty("observations")//Only flat flavor is supported (no series) (better look for dataset with "action": "Information"?)
        ){
  			 json=JSONstatUtils.fromSDMX(json);
  		}

      let data=JSONstat(json);

      if(!data.length){
        that.setState({status : "jsonstaterror"});
      }else{
        if(data.class==="bundle"){
          bundle=data.length;
          data=data.Dataset(0);
        }

        loadData(data, bundle);
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
        processData(JSON.parse(jsonstat));
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
