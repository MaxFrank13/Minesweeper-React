import React from "react";

export default function Header({ setNewMap }) {
    return (
        <header>
            <h1>Minesweeper</h1>
            <p>See if you can sweep all the mines without touching one!</p>
            <p>Use CTRL-click to set a flag 🚩</p>
            <button className="btn" onClick={setNewMap}>Reset Game</button>
        </header>
    )
}