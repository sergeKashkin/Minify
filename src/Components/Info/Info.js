import React from 'react';
import './Info.css';

const Info = (props) => {
    return (
        <div className="info-container">
            <div className="title"><h2 id="artist_title">{props.name}</h2></div>
            <div className="artist-image"><img id ="artist" src={props.image} alt="artist"/></div>
            <div className="artist-info">{props.info}</div>
        </div>
    )
}

export default Info;