// create interface for:
// starting game
// choosing number of mines (level of difficulty)
// establish a theme
import React from 'react';

export default function Interface(props) {
    return (
      <button 
        className="btn" 
        onClick={props.handleClick}
      >
        play
      </button>
    )
}