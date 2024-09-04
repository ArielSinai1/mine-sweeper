'use strict'

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel = {
    SIZE: 6,
    MINES: 2
}

var gBoard
var gBoardSize = gLevel.SIZE
var gRows = []
var gCols = []
var gIsFirstClick
var gFirstCellClicked

const MINE = '💣'
const EMPTY = ' '


// 1. Create a 4x4 gBoard Matrix containing Objects. 
// 2. Set 2 of them to be mines
// 3. Present the mines using renderBoard() function.

function onInit() {

    console.log('hello')
    buildRowsAndColsArr()
    gBoard = buildBoard()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    gIsFirstClick = false
    gGame.isOn = true

}

function buildBoard() {

    const board = []
    // const randomRow1 = drawNum(gRows)
    // const randomRow2 = drawNum(gRows)
    // const randomCol1 = drawNum(gCols)
    // const randomCols2 = drawNum(gCols)

    for (var i = 0; i < gBoardSize; i++) {
        board.push([])

        for (var j = 0; j < gBoardSize; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            // if ((i === 2 && j === 3) || (i === 2 && j === 0)) {
            //     board[i][j].isMine = true
            // }
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const currCell = board[i][j]
            const className1 = `cell cell-${i}-${j}`
            var className2 = (currCell.isMine) ? 'mine' : ''
            var strData = `data-i="${i}" data-j="${j}"`

            strHTML += `<td class="${className1} ${className2}" ${strData} onclick="onCellClicked(this, ${i}, ${j})">`
            if (gIsFirstClick && (!currCell.isShown)) {
                if (currCell.isMine) {
                    strHTML += MINE
                } else {
                    strHTML += +board[i][j].minesAroundCount
                }
            }

            strHTML += '</td>'
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

// 1. Create setMinesNegsCount() and store the numbers 
// 2. Update the renderBoard() function to also display the
// neighbor count and the mines 
// 3. Add a console.log – to help you with debugging


function setMinesNegsCount(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var currCell = board[i][j]
            var minesAroundCounter = 0
            const rowIdx = i
            const colIdx = j

            for (var n = rowIdx - 1; n <= rowIdx + 1; n++) {
                if (n < 0 || n >= board.length) continue
                for (var m = colIdx - 1; m <= colIdx + 1; m++) {
                    if (n === rowIdx && m === colIdx) continue
                    if (m < 0 || m >= board[0].length) continue
                    var currCell = board[n][m]
                    if (currCell.isMine) minesAroundCounter++
                }
            }
            // save counter
            board[i][j].minesAroundCount = minesAroundCounter
        }
    }
}

// 1. When clicking a cell, call the onCellClicked() function.
// 2. Clicking a safe cell reveals the minesAroundCount of this cell




function onCellClicked(elCell, rowIdx, colIdx) {

    console.log('clicked')
    if (!gIsFirstClick) {
        
        gBoard[rowIdx][colIdx].isShown = true
        elCell.innerText = ' '
        elCell.style.backgroundColor = 'white'
        gFirstCellClicked = { row: rowIdx, col: colIdx }
        placeMines(gBoard)
        setMinesNegsCount(gBoard)
        renderBoard(gBoard)
        gIsFirstClick = true
        console.log('first click')
    } else {
        if (gBoard[rowIdx][colIdx].isMine) {
            return
        } else {
            elCell.innerText = gBoard[rowIdx][colIdx].minesAroundCount
            elCell.style.backgroundColor = 'white'
        }
    }

    // console.log(elCell.classList)
    // console.log(gBoard[rowIdx][colIdx].isMine)
    console.log('rows array:', gRows)
    console.log('cols array:', gCols)
}

// 1. Add some randomicity for mines location
// 2. After you have this functionality working– its best to comment 
// the code and switch back to static location to help you focus 
// during the development phase

function buildRowsAndColsArr() {
    gRows = []
    gCols = []
    var size = gLevel.SIZE
    for (var i = 0; i < size; i++) {
        gRows.push(i)
        gCols.push(i)
    }
}

// The first clicked cell is never a mine 
// HINT: We need to start with an empty matrix (no mines) and 
// then place the mines and count the neighbors only on first 
// click.

function placeMines(board) {
    gRows.splice(+gFirstCellClicked.row, 1)
    gRows.splice(+gFirstCellClicked.col, 1)
    const randomRow1 = drawNum(gRows)
    const randomRow2 = drawNum(gRows)
    const randomCol1 = drawNum(gCols)
    const randomCols2 = drawNum(gCols)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if ((i === 2 && j === 3) || (i === 2 && j === 0)) {
                board[i][j].isMine = true
            }
        }
    }
    return board
}