import React from "react";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Cell from "./components/Cell";
import Interface from "./components/Interface";
import Header from './components/Header';

export default function App() {
  const [grid, setGrid] = useState([]);
  const [play, setPlay] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  function createGrid() {
    const newGrid = [];
    for (let j = 0; j < 20; j++) {
      const newRow = [];
      for (let i = 0; i < 20; i++) {
        newRow.push({
          id: nanoid(),
          cellNum: i + j * 20,
          type: "cell",
          hasBeenClicked: false,
          adjacentMines: 0,
          coordinates: {
            x: i,
            y: j,
          },
          flagPlaced: false
        });
      }
      newGrid.push(newRow);
    }
    return setMines(newGrid);
  }

  function setMines(array) {
    const randomNums = [];
    for (let i = 0; randomNums.length < 60; i++) {
      const newRandomNum = Math.floor(Math.random() * 400);
      if (!randomNums.includes(newRandomNum)) {
        randomNums.push(newRandomNum);
      }
    }
    return array.map((subArr) =>
      subArr.map((cell) => {
        if (randomNums.includes(cell.cellNum)) {
          return {
            ...cell,
            isMine: true,
          };
        } else {
          return {
            ...cell,
            isMine: false,
          };
        }
      })
    );
  }

  function createMap() {
    setPlay(true);
    setGameOver(false)
    setGrid(createGrid());
  }

  function cellClickHandle(event) {
    if (!gameOver) {
      const coords = {};
      grid.forEach((array, y) => {
        array.forEach((cell, x) => {
          if (cell.cellNum == event.target.dataset.id) {
            coords.x = x;
            coords.y = y;
          }
        });
      });
      // if shift-click, set a flag instead
      if (event.shiftKey) {
        const newGrid = placeFlag(coords);
        setGrid(newGrid);
        return;
      }
      if (checkForMine(coords)) {
        const newGrid = checkForMine(coords);
        setGrid(newGrid);
        setGameOver(true);
        return;
      };
      const newGrid = runSweeper(coords);
      setGrid(newGrid);
    }
  }

  function checkSurroundingCells(obj) {
    let count = 0;
    if (obj.topLeft.isMine) {
      // top left
      count++;
    }
    if (obj.top.isMine) {
      // top
      count++;
    }
    if (obj.topRight.isMine) {
      // top right
      count++;
    }
    if (obj.left.isMine) {
      // left
      count++;
    }
    if (obj.right.isMine) {
      // right
      count++;
    }
    if (obj.bottomLeft.isMine) {
      // bottom left
      count++;
    }
    if (obj.bottom.isMine) {
      // bottom
      count++;
    }
    if (obj.bottomRight.isMine) {
      // bottom right
      count++;
    };
    return count;
  };

  function getSurroundingCells(coords) {
      // check corners first
      // top-left corner only use 3 values
      if (coords.x === 0 && coords.y === 0) {
        return {
          topLeft: grid.at(coords.y).at(coords.x), 
          top: grid.at(coords.y).at(coords.x),
          topRight: grid.at(coords.y).at(coords.x),
          left: grid.at(coords.y).at(coords.x),
          right: grid.at(coords.y).at(coords.x + 1), // here
          bottomLeft: grid.at(coords.y).at(coords.x),
          bottom: grid.at(coords.y + 1).at(coords.x), // here
          bottomRight: grid.at(coords.y + 1).at(coords.x + 1), // here
        }
      }
      // top-right corner
      if (coords.x === 19 && coords.y === 0) {
        return {
          topLeft: grid.at(coords.y).at(coords.x), 
          top: grid.at(coords.y).at(coords.x),
          topRight: grid.at(coords.y).at(coords.x),
          left: grid.at(coords.y).at(coords.x - 1), // here
          right: grid.at(coords.y).at(coords.x),
          bottomLeft: grid.at(coords.y + 1).at(coords.x - 1), // here
          bottom: grid.at(coords.y + 1).at(coords.x), // here
          bottomRight: grid.at(coords.y).at(coords.x),
        }
      }
      // bottom -left corner
      if (coords.x === 0 && coords.y === 19) {
        return {
          topLeft: grid.at(coords.y).at(coords.x), 
          top: grid.at(coords.y - 1).at(coords.x), // here
          topRight: grid.at(coords.y - 1).at(coords.x + 1), // here
          left: grid.at(coords.y).at(coords.x),
          right: grid.at(coords.y).at(coords.x + 1), // here
          bottomLeft: grid.at(coords.y).at(coords.x),
          bottom: grid.at(coords.y).at(coords.x),
          bottomRight: grid.at(coords.y).at(coords.x),
        }
      }
      // bottom-right corner
      if (coords.x === 19 && coords.y === 19) {
        return {
          topLeft: grid.at(coords.y - 1).at(coords.x - 1), // here
          top: grid.at(coords.y - 1).at(coords.x), // here
          topRight: grid.at(coords.y).at(coords.x), 
          left: grid.at(coords.y).at(coords.x - 1), // here
          right: grid.at(coords.y).at(coords.x), 
          bottomLeft: grid.at(coords.y).at(coords.x),
          bottom: grid.at(coords.y).at(coords.x),
          bottomRight: grid.at(coords.y).at(coords.x),
        }
      }
      // if on bottom row, don't use indices over 19
      if (coords.y + 1 > 19) {
        return {
          topLeft: grid.at(coords.y - 1).at(coords.x - 1), 
          top: grid.at(coords.y - 1).at(coords.x),
          topRight: grid.at(coords.y - 1).at(coords.x + 1),
          left: grid.at(coords.y).at(coords.x - 1),
          right: grid.at(coords.y).at(coords.x + 1),
          bottomLeft: grid.at(coords.y).at(coords.x), // here
          bottom: grid.at(coords.y).at(coords.x), // here
          bottomRight: grid.at(coords.y).at(coords.x), // here
        };
      // if on top row, don't use negative indices
      }
      if (coords.y === 0) {
        return {
          topLeft: grid.at(coords.y).at(coords.x),  // here
          top: grid.at(coords.y).at(coords.x), // here
          topRight: grid.at(coords.y).at(coords.x), // here
          left: grid.at(coords.y).at(coords.x - 1),
          right: grid.at(coords.y).at(coords.x + 1),
          bottomLeft: grid.at(coords.y + 1).at(coords.x - 1),
          bottom: grid.at(coords.y + 1).at(coords.x),
          bottomRight: grid.at(coords.y + 1).at(coords.x + 1),
        }
      // if on left-most column, don't use negative indices
      }
      if (coords.x === 0) {
        return {
          topLeft: grid.at(coords.y).at(coords.x), // here
          top: grid.at(coords.y - 1).at(coords.x),
          topRight: grid.at(coords.y - 1).at(coords.x + 1),
          left: grid.at(coords.y).at(coords.x), // here
          right: grid.at(coords.y).at(coords.x + 1),
          bottomLeft: grid.at(coords.y).at(coords.x), // here
          bottom: grid.at(coords.y + 1).at(coords.x),
          bottomRight: grid.at(coords.y + 1).at(coords.x + 1),
        }
      // if on right most column, don't use indices over 19
      }
      if (coords.x + 1 > 19) {
        return {
          topLeft: grid.at(coords.y - 1).at(coords.x - 1), 
          top: grid.at(coords.y - 1).at(coords.x),
          topRight: grid.at(coords.y).at(coords.x), // here
          left: grid.at(coords.y).at(coords.x - 1),
          right: grid.at(coords.y).at(coords.x), // here
          bottomLeft: grid.at(coords.y + 1).at(coords.x - 1),
          bottom: grid.at(coords.y + 1).at(coords.x),
          bottomRight: grid.at(coords.y).at(coords.x), // here
        }
      }
      return {
        topLeft: grid.at(coords.y - 1).at(coords.x - 1), 
        top: grid.at(coords.y - 1).at(coords.x),
        topRight: grid.at(coords.y - 1).at(coords.x + 1),
        left: grid.at(coords.y).at(coords.x - 1),
        right: grid.at(coords.y).at(coords.x + 1),
        bottomLeft: grid.at(coords.y + 1).at(coords.x - 1),
        bottom: grid.at(coords.y + 1).at(coords.x),
        bottomRight: grid.at(coords.y + 1).at(coords.x + 1),
      };
  };

  function checkForMine(coords) {
    if (grid[coords.y][coords.x].isMine) {
      return grid.map((array, y) => 
      array.map((cell, x) => {
        if (y === coords.y && x === coords.x) {
          return {
            ...cell,
            hasBeenClicked: true
          };
        } else {
          return cell;
        }
      })
    )
  };
    return false;
  }

  function runSweeper(coords) {
    let adjMines;
    let surroundingCells;
    const newGrid = grid.map((array, y) =>
        array.map((cell, x) => {
          if (y === coords.y && x === coords.x) {
            console.log(coords);
            surroundingCells = getSurroundingCells(coords);
            adjMines = checkSurroundingCells(surroundingCells);
            return {
              ...cell,
              adjacentMines: adjMines,
              hasBeenClicked: true,
            };
          } else {
            return cell;
          };
        })
      );
      if (adjMines === 0) {
        for (const cell in surroundingCells) {
          const thisCoord = {
            x: surroundingCells[cell].coordinates.x,
            y: surroundingCells[cell].coordinates.y
          }
          const surrounding = getSurroundingCells(thisCoord);
          const adjM = checkSurroundingCells(surrounding);
          grid[thisCoord.y][thisCoord.x].hasBeenClicked = true;
          grid[thisCoord.y][thisCoord.x].adjacentMines = adjM;
        }
      }
      return newGrid;
    };
    
  function placeFlag(coords) {
    return grid.map((array, y) => 
      array.map((cell, x) => {
        if (y === coords.y && x === coords.x) {
          return {
            ...cell,
            flagPlaced: !cell.flagPlaced
          };
        } else {
          return cell;
        }
      })
    )
  }

  return (
    <>
    <Header />
    <main>
      { 
      !play ?
      <Interface
        handleClick={createMap}
      />
      :
      <section className="game-container">
        {grid.map((item) =>
              item.map((cell) => {
                return (
                  <Cell
                    key={cell.id}
                    cellNum={cell.cellNum}
                    type={cell.type}
                    clicked={cell.hasBeenClicked}
                    handleClick={cellClickHandle}
                    isMine={cell.isMine}
                    adjacentMines={cell.adjacentMines}
                    flagPlaced={cell.flagPlaced}
                  />
                );
              })
            )
        }
      </section>
      }
      {gameOver &&
      <button 
        className="btn"
        onClick={createMap}
      >
        play again?
      </button>}
    </main>
    </>
  );
}
