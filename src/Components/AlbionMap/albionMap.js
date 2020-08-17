import React from 'react';
import { Node } from "../Node/node.js"
import { Road } from "../Road/road.js"
import './albionMap.css'

export class AlbionMap extends React.Component {
    constructor(props) {
        super(props);   
        // Don't call this.setState() here!
        this.state = {           
            NodeList: [               
              ],

              RoadList: [             
            ]
         };

        this.import(); //si hya parametro en la url, importara el mapa         
          
      }

      replaceAll(string, search, replace) {
        return string.split(search).join(replace);
      }
      
    NodeChangeHandler(nodeName,newX, newY,newmaptype) {
        const found = this.state.NodeList.find(e => e["name"]==nodeName);     
        found["posX"] = newX;
        found["posY"] = newY;
        found["maptype"] = newmaptype;

        this.forceUpdate();
    }

    handleDeleteNode(nodeName){
      const found = this.state.NodeList.find(e => e["name"]==nodeName);     
      found["name"] = "";
      this.forceUpdate();
    }

    handleDeleteRoad(fromName,toName){
      var found = this.state.RoadList.find(e => (e["from"]==fromName) && (e["to"]==toName) );        
      found["from"] = "";
      this.forceUpdate();
    }

    RoadChangeHandler(fromName,toName,time,size,newX, newY) {
        var found = this.state.RoadList.find(e => (e["from"]==fromName) && (e["to"]==toName) );        
        found["posX"] = newX;
        found["posY"] = newY;
        found["time"] = time;
        found["size"] = size;
    }

    clickNewNode(){
        this.createNewNode(0,0,document.getElementById('nameInput').value,document.getElementById('maptypeSelect').value);
    }

  createNewNode(posX, posY , name, maptype){ 
    
    if(name==""){
      return;
    }

    const found = this.state.NodeList.find(e => e["name"]==name);    
    if(found){
      alert("NODE NAME ALREADY EXISTS");
      return;
    }

    var newNode = {};
    newNode["posX"] = posX;
    newNode["posY"] = posY;
    newNode["maptype"] = maptype;
    newNode["name"] = name;
    this.state.NodeList.push(newNode);
    this.forceUpdate();
  }

  clickNewRoad(){
    this.createNewRoad(0,0,this.incrementToTime(document.getElementById('timeInput').value),document.getElementById('fromInput').value,document.getElementById('toInput').value,document.getElementById('sizeSelect').value);
}

incrementToTime(increment){
    var time = new Date();
    increment = this.timeToDecimal(increment); 
    time.setSeconds(time.getSeconds() + increment);
    return time;
}

  createNewRoad(posX, posY, time, from,to, size){

    if(from=="" || to==""){
      return;
    }

    var found = this.state.RoadList.find(e => (e["Road"].props.from==from && e["Road"].props.to==to));    
    if(found){
      alert("ROAD ALREADY EXISTS");
      return;
    }
    found = this.state.RoadList.find(e => (e["Road"].props.from==to && e["Road"].props.to==from));    
    if(found){
      alert("ROAD ALREADY EXISTS");
      return;
    }

      var newRoad = {};
      newRoad["posX"] = posX;
      newRoad["posY"] = posY;     
      newRoad["size"] = size; 
      newRoad["time"] = time.getTime();

      newRoad["from"] = from; 
      newRoad["to"] = to; 

    this.state.RoadList.push(newRoad);
    this.forceUpdate();
  }

  timeToDecimal(t) {
    t = t.split(':');    
    return parseInt(t[0], 10)*3600 + parseInt(t[1], 10)*60;
  }  

  
  export(){ 
console.log(this.state);
     

    var firstparturl = window.location.href.split('&urlcode=')[0]; 

    var url = firstparturl + "&urlcode=" + JSON.stringify(this.state);
navigator.clipboard.writeText(url).then(function() { 
  alert("URL copiada al portapapeles (pasala por tinyurl para no spamear al pasarla...)")
}, function(err) {
  console.error('Async: Could not copy text: ', err);
});
  }

  import(){

      var urlparam = window.location.href.split('urlcode=')[1];
          if(urlparam){
            if(urlparam){
              urlparam = this.replaceAll(urlparam,'%7B','{');
              urlparam = this.replaceAll(urlparam,'%7D','}');
              urlparam = this.replaceAll(urlparam,'%22','"');
              urlparam = this.replaceAll(urlparam,'%20',' ');
            }
          }else{
            this.createNewNode(650,100,"Quiitun-Duosum",0);
            return;
          }
          console.log(urlparam);
          var newState = JSON.parse(urlparam);
      
      newState["NodeList"].forEach(e => {
           if(e["name"]!=""){
            this.createNewNode(e["posX"],e["posY"],e["name"],e["maptype"]);
          }        
      } );

      
      newState["RoadList"].forEach(e => {
        if(e["from"]!=""){
          this.createNewRoad(e["posX"],e["posY"],new Date(e["time"]),e["from"],e["to"]);
        }             
      } );    
  }


    render() {     

        return (            
            <div>
              <span className="left">3</span>
                
                <button onClick={()=>this.clickNewNode()}>CreateNode</button>
                name:<input id="nameInput"></input>      

                <select id="maptypeSelect" name="select">
                <option value="0" >Home</option> 
                <option value="1" selected>Road</option> 
                <option value="2">Road (with hideouts)</option>
                <option value="3">Blue</option>
                <option value="4">Yellow</option>
                <option value="5">Red</option>
                <option value="6">Black</option>
                <option value="7">Undefined</option>                
                </select>
                <p></p>
                <button onClick={()=>this.clickNewRoad()}>CreateRoad</button>
                <select id="sizeSelect" name="select">
                <option value="2">2</option> 
                <option value="7" selected>7</option>
                <option value="20">20</option>          
                </select>
                from:<input id="fromInput"></input>      
                to:<input id="toInput"></input>   
                time(hh:mm):<input id="timeInput"></input>  
                
              <p>

              </p>
              <button onClick={()=>this.export()}>Export</button>
               

                {this.state.NodeList.map(node => <Node posX={node["posX"]} posY={node["posY"]} name={node["name"]} maptype={node["maptype"]} handleParentChange={this.NodeChangeHandler.bind(this)} handleDeleteNode={this.handleDeleteNode.bind(this)}></Node> )}    
                {this.state.RoadList.map(road => <Road size={road["size"]} from={road["from"]} to={road["to"]} time={road["time"]} posX={road["posX"]} posY={road["posY"]} handleParentChange={this.RoadChangeHandler.bind(this)} handleDeleteRoad={this.handleDeleteRoad.bind(this)} ></Road>)}
             

            </div>          
        );
    }
}

