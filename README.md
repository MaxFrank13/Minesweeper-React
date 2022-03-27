# Minesweeper in React

## Description

Minesweeper game built using React. Each cell contains a number which will be revealed once clicked. That number corresponds to the number of adjacent mines. If there are 0, then your "sweep" will extend to each of the adjacent cells. There are 60 bombs hidden among the cells. If you should click a cell with a mine, then you will lose! The option to shift-click cells is available as a way to mark cells you suspect to be mines. This will render a red overlay over that cell so that you know not to click it in the future.

[Video Demonstration](https://drive.google.com/file/d/1MHHU5kG5mO8EE_K-7O9qVwJaQRWfk2cf/view)

## Installation & Usage

This app is still in development stage as there are a few features I still want to add. One of which is the ability to cascade the sweep so that all cells surrounding a '0' are revealed instead of just the ones surrounding the click. 

This project was setup using `create-react-app`.