import React from "react";

export default function LoseModal({ setNewMap, closeModal }) {
  return (
    <div className="modal-container">
      <div className="lose-modal">
        <h3>
          Oh no! You lost. Play again?
        </h3>
        <div className="actions-bar">
          <button className="btn" onClick={setNewMap}>
            Yes
          </button>
          <button className="btn btn-outline" onClick={closeModal}>
            Keep playing
          </button>
        </div>
      </div>
    </div>
  )
}