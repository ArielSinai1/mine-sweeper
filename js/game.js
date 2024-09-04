'use strict'

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gBoard
var gBoardSize = gLevel.SIZE

const MINE = '💣'
const EMPTY = '4'

// 1. Create a 4x4 gBoard Matrix containing Objects. 
// 2. Set 2 of them to be mines
// 3. Present the mines using renderBoard() function.

function onInit() {

    console.log('hello')

    gBoard = buildBoard()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    gGame.isOn = true
}

function buildBoard() {

    const board = []

    for (var i = 0; i < gBoardSize; i++) {
        board.push([])

        for (var j = 0; j < gBoardSize; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            if ((i === 2 && j === 1) || (i === 0 && j === 0)) {
                board[i][j].isMine = true
            }
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

            if (currCell.isMine) {
                strHTML += MINE
            } else {
                strHTML += +board[i][j].minesAroundCount
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

    for (var i = 0; i <= board.length; i++) {
        for (var j = 0; j <= board.length; j++) {
            var minesAroundCount = 0
            const rowIdx = i
            const colIdx = j

            for (var n = rowIdx - 1; n <= rowIdx + 1; n++) {
                if (n < 0 || n >= board.length) continue
                for (var m = colIdx - 1; m <= colIdx + 1; m++) {
                    if (n === rowIdx && m === colIdx) continue
                    if (m < 0 || m >= board[0].length) continue
                    var currCell = board[n][m]
                    if (currCell === MINE) minesAroundCount++
                }
            }
            // save counter
        }
    }
}





function onCellClicked(elCell, rowIdx, colIdx) {
    console.log('clicked')
}