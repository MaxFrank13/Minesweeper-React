# Minesweeper in React

## Description

Minesweeper game built using React. A nice way to experiment and get familiar with state changes as well as honing JavaScript fundamentals.

[Video Demonstration](https://drive.google.com/file/d/1MHHU5kG5mO8EE_K-7O9qVwJaQRWfk2cf/view)
![Screenshot of Home screen](https://github.com/MaxFrank13/Minesweeper-React/blob/main/public/app-photos/home-screen.png)

## Installation

  - Clone this repository to receive all of the files
  - Run "npm install" in the command line of your terminal to set up all of the dependencies
  - There is no database currently 
  - Run "npm start" to start the application's connection
  - Your browser will open to the url of the application (http//:localhost:3000) and you'll see it running

## Using the app

Simply click the play button to queue up a game of Minesweeper. Each cell contains a number which will be revealed once clicked. That number corresponds to the number of adjacent mines. If there are 0, then your "sweep" will extend to each of the adjacent cells. There are 60 bombs hidden among the cells. If you should click a cell with a mine, then you will lose! The option to shift-click cells is available as a way to mark cells you suspect to be mines. This will render a red overlay to that cell so that you know not to click it in the future.

![Screenshot of play again button](https://github.com/MaxFrank13/Minesweeper-React/blob/main/public/app-photos/game-lose.png)

## How it's done

Anytime a cell's content needs to be modified, the state of the grid is set using it's setter function. This triggers a re-render of the page and displays that modification.

The grid is created using a 2D array which allows for an intuitive development experience. Each index of that 2D array corresponds to a coordinate for that cell. For example, the top-left-most cell is at `grid[0][0]`, where one cell to the right of that would be `grid[0][1]` and one down would be `grid[1][0]`. In other words, the grid operates on an inverted y-axis, similar to how a web page is laid out (i.e. CSS `position` property).

## Future development

This app is still in development stage as there are a few features I still want to add. One of which is the ability to cascade the sweep so that all cells surrounding a '0' are revealed instead of just the ones surrounding the click. Another is adding a backend to keep track of high scores and perhaps add a log in feature to keep track of a user's play history. With this backend, a forum/comment/messaging system could also be added.


This project was setup using `create-react-app`.
