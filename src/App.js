import React, { useState } from "react";
import { nanoid } from "nanoid";
import Confetti from 'react-confetti'
import Cell from "./components/Cell";
import Interface from "./components/Interface";
import Header from './components/Header';
import LoseModal from "./components/LoseModal";

export default function App() {
  const [grid, setGrid] = useState([]);
  const [play, setPlay] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  function checkForWin() {
    if (win) {
      return win;
    }
    let count = 0;
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.hasBeenClicked) {
          count++;
        }
      });
    });

    if (count === 340) {
      setWin(true);
    }
    return win;
  };

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
          flagPlaced: false,
          swept: false
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

  function setNewMap() {
    setWin(false);
    setPlay(true);
    setGameOver(false)
    setGrid(createGrid());
  }

  function cellClickHandle(event) {
    if (!gameOver) {
      const coords = {};
      grid.forEach((array, y) => {
        array.forEach((cell, x) => {
          if (cell.cellNum.toString() === event.target.dataset.id) {
            coords.x = x;
            coords.y = y;
          }
        });
      });
      // if control-click, set a flag instead
      if (event.ctrlKey) {
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
      const setup = runSweeper(coords);

      if (setup.adjMines === 0) {
        console.log(setup);
        cascadeSweep(setup.surroundingCells);
        console.log(setup.newGrid[coords.y][coords.x]);
        return;
      }
      setGrid(setup.newGrid);
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
      const newGrid = [...grid];
      newGrid[coords.y][coords.x].hasBeenClicked = true;
      return newGrid;
    };
    return false;
  }

  function runSweeper(coords) {

    const newGrid = [...grid];
    const surroundingCells = getSurroundingCells(coords);
    const adjMines = checkSurroundingCells(surroundingCells);
    newGrid[coords.y][coords.x].adjacentMines = adjMines;
    newGrid[coords.y][coords.x].hasBeenClicked = true;

    return {
        adjMines,
        surroundingCells,
        newGrid
    };
  };
    
  function placeFlag(coords) {
    const newGrid = [...grid];
    const cell = newGrid[coords.y][coords.x];
    if (cell.hasBeenClicked && !cell.flagPlaced) {
      return newGrid;
    }
    cell.flagPlaced = !cell.flagPlaced;
    return newGrid;
  }

  function cascadeSweep(surroundingCells) {
    const newGrid = [...grid];
    for (const cell in surroundingCells) {
      const thisCoord = {
        ...surroundingCells[cell].coordinates
      }
      const surrounding = getSurroundingCells(thisCoord);
      const adjM = checkSurroundingCells(surrounding);
      newGrid[thisCoord.y][thisCoord.x].hasBeenClicked = true;
      newGrid[thisCoord.y][thisCoord.x].adjacentMines = adjM;

      if (adjM === 0 && !grid[thisCoord.y][thisCoord.x].swept) {
        newGrid[thisCoord.y][thisCoord.x].swept = true;
        cascadeSweep(surrounding);
      }
    }
    setGrid(newGrid);
}

  return (
    <>
      <Header
        setNewMap={setNewMap}
      />
      <main>
      { 
        !play ?
        <Interface
          handleClick={setNewMap}
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
                      swept={cell.swept}
                    />
                  );
                })
              )
          }
        </section>
        }
        {checkForWin() &&
        <>
          <Confetti />
          <button 
            className="btn"
            onClick={setNewMap}
          >
            You won! Play again?
          </button>
        </>}
        {gameOver &&
            <LoseModal
              setNewMap={setNewMap}
              closeModal={() => setGameOver(false)}
            />
        }
      </main>
    </>
  );
}
