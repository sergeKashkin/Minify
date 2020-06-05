import React, { Component } from 'react';
import './App.css';
import Player from './Components/Player/Player';
import Info from './Components/Info/Info';


class App extends Component {
  constructor() {
    super();
    this.state = {
      status:"no",
      info:"",
      image:"",
      name:""
    }
  }
  componentWillMount(){
    const scr = document.createElement("script");
    scr.src = "player_script.js";
    scr.async = true;
    document.body.appendChild(scr);
  }


  getArtistInfo = async (name) => {
    await fetch('https://damp-inlet-30936.herokuapp.com/artist',{
      headers: {
        'Content-Type':'application/json'
      },
      method: "POST",
      body: JSON.stringify({artist:name})
    }).then(response => response.json())
      .then(json => {
        try {
          this.setState({
            info:json.body.plain,
            image:json.image,
            name:name
          })
        } catch {
          this.setState({
            info:"No info available for this artist",
            image:"https://d29fhpw069ctt2.cloudfront.net/icon/image/85269/preview.svg",
            name:name
          });
        }
 });
  }
  render() {
  return (
    <div className="App">
      <Player getArtistInfo={this.getArtistInfo}/>
      <Info image={this.state.image} info={this.state.info} name={this.state.name}/>
    </div>
  );
}
}
export default App;
