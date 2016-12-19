import React from "react";
import {fetchJsonStat, getMessage} from "./XHRUtils";

export default class Retrieve extends React.Component {
  constructor() {
    super();
    this.state = {
      method: "get",
      status: "ok"
    };
  }

  handleMethod(e) {
    this.setState({ method: e.currentTarget.dataset.id, status: "ok" });
  }

  reset() {
    this.refs.url.value="";
    if(this.state.method==="post"){
      this.refs.query.value="";
    }
  }

  loadSample() {
    const protocol=(window.location.protocol==="https:") ? "https" : "http";
    this.refs.url.value=protocol+"://json-stat.org/samples/canada.json";
  }

  submit() {
    const
      method=this.state.method,
      url=this.refs.url ? this.refs.url.value.trim() : null,
      query=this.refs.query ? this.refs.query.value.trim(): null,
      ok=(method==="get" && url)
        ||
        (method==="post" && url && query)
    ;

    if(!ok){
      this.setState({ status: "blank" });
      return;
    }

    if(method!=="paste" && window.location.protocol==="https:" && url.slice(0,6)!=="https:"){
      this.setState({ status: "https" });
      return;
    }

    fetchJsonStat(
      this,
      this.props.loadData,
      method,
      url,
      query,
      null
    );

    if(method==="get"){
      window.location.hash="#/"+encodeURIComponent(url);
    }
  }

  handleKeyPress(e) {
    if(e.key=="Enter"){
      this.submit();
    }
  }

  componentDidMount(){
    const
      url=decodeURIComponent(window.location.hash.slice(2)),
      re=/https?:\/\//
    ;

    if(url.match(re)){
      this.refs.url.value=url;
      this.submit();
    }
  }

  render() {
    const method=this.state.method;

    return (
      <section id="form">
        <div className="select">
          <span className={this.state.method==="get" ? "selected" : null} data-id="get" onClick={this.handleMethod.bind(this)}>GET</span>
          <span className={this.state.method==="post" ? "selected" : null} data-id="post" onClick={this.handleMethod.bind(this)}>POST</span>
          {this.state.method==="get" ? <a onClick={this.loadSample.bind(this)}>Load sample URL</a> : null}
        </div>
        <input type="text" ref="url" placeholder="URL" onKeyPress={this.handleKeyPress.bind(this)} />
        {
          method==="post" ?
            <textarea ref="query" placeholder="JSON query"></textarea>
          :
          null
        }
        <button className="btn btn-primary" onClick={this.submit.bind(this)}>Send</button>
        <button className="btn" onClick={this.reset.bind(this)}>Reset</button>
        {getMessage(this.state.status)}
      </section>
    );
  }
}
