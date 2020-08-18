import React from 'react';

import { AlbionMap } from "../AlbionMap/albionMap.js"
import { WebHeader } from "../WebHeader/webHeader.js"
import { InfoScreen } from "../InfoScreen/infoScreen.js"

export class Main extends React.Component {
    constructor(props) {
        super(props);   
        // Don't call this.setState() here!
        this.state = {       
            showingInfo: false
         };               
      }


        handleInfoClick(){
            this.state.showingInfo = !this.state.showingInfo;
            this.forceUpdate();
        }
    

    render() {     

        var mainContent;
        if(this.state.showingInfo){
          mainContent=<InfoScreen handleInfoClick={this.handleInfoClick.bind(this)}></InfoScreen>
        }else{
          mainContent = <AlbionMap></AlbionMap>;
        }

        return (   
            <span>        
                <WebHeader showingInfo={this.state.showingInfo} handleInfoClick={this.handleInfoClick.bind(this)}></WebHeader>
                {mainContent}
            </span> 
        );
    }
}

