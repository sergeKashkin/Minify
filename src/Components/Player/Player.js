import React, { Component } from 'react';
import './Player.css'

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            artist:""
        };
    }
    
    check_artist = () => {
        let name = document.getElementById('current_artist_name').textContent;
        if (this.state.artist === name) return;
        this.setState({artist:name});
        this.props.getArtistInfo(name);
    }

    render() {
    return (
        <div className="flex-container"> 
            <div class="container">
                <img id="album_art"  className="album" alt="" onLoad={() => this.check_artist()}/>
                <div className="text">
                    <p id="current_artist_name"></p>
                    <p id="current_track_name"></p>
                </div>
                <img id= "control" src="pause.png" className="playBtn" alt=""/>
                <img id= "heart" src="like.png" className="likeBtn" alt=""/>
            </div>
        </div>
    )
    
    

}
}
export default Player;