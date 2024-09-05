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

var gIsFirstClick
var gFirstCellClicked
var gMineCounter
var gLivesCount

const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ' '


function onInit() {

    gBoard = buildBoard()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    gIsFirstClick = false
    gGame.isOn = true
    gMineCounter = 0
    gLivesCount = 3
    resetLifeText()
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
            // var strData = `data-i="${i}" data-j="${j}"`
            strHTML += `<td class="${className1} ${className2}" onclick="onCellClicked(this, ${i}, ${j})"
            oncontextmenu="onCellRightClicked(event, this, ${i}, ${j})">`
            if (gBoard[i][j].isShown && !gBoard[i][j].isMine) {
                strHTML += +board[i][j].minesAroundCount
            }
            if (gIsFirstClick && gGame.isOn) {
                if (currCell.isMine) {
                    strHTML += MINE
                } else {
                    strHTML += +board[i][j].minesAroundCount
                }
            }
            if (gIsFirstClick && !gGame.isOn) {
                if (currCell.isMine) {
                    strHTML += MINE
                }
            }

            strHTML += '</td>'
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}


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
            board[i][j].minesAroundCount = minesAroundCounter
        }
    }
}

function onCellClicked(elCell, rowIdx, colIdx) {

    var elLives = document.querySelector('.lives')

    if (elCell.isShown || elCell.isMarked) return

    if (!gGame.isOn) return

    if (!gIsFirstClick) {
        gFirstCellClicked = { row: rowIdx, col: colIdx }
        placeMines(gBoard)
        setMinesNegsCount(gBoard)
        gBoard[rowIdx][colIdx].isShown = true
        if (gBoard[rowIdx][colIdx].minesAroundCount === 0) {

            gBoard[rowIdx][colIdx].isShown = true
            noNegs(rowIdx, colIdx)
        }
        renderBoard(gBoard)
        gIsFirstClick = true

    } else {
        if (gBoard[rowIdx][colIdx].isMine) {

            if (gMineCounter < 2 && gLevel.SIZE !== 4) {
                gMineCounter++
                gLivesCount--
                elCell.innerText = MINE
                gBoard[rowIdx][colIdx].isShown = true
                elLives.innerText = `lives left: ${gLivesCount}`
                
            } else {
                
                elLives.innerText = `lives left: 0`
                gGame.isOn = false
                var elSmiley = document.querySelector('.smiley')
                elSmiley.innerText = '😭'
                revealAllMines()
                return
            }
        } else {
            if (gBoard[rowIdx][colIdx].minesAroundCount === 0) {

                elCell.innerText = 0
                gBoard[rowIdx][colIdx].isShown = true
                noNegs(rowIdx, colIdx)
            }
            elCell.innerText = gBoard[rowIdx][colIdx].minesAroundCount

            gBoard[rowIdx][colIdx].isShown = true
        }
    }
    isVictory()
}

function placeMines(board) {

    const minesToPlace = gLevel.MINES
    var placedMines = 0

    while (placedMines < minesToPlace) {
        const randomRow = getRandomInt(0, gLevel.SIZE)
        const randomCol = getRandomInt(0, gLevel.SIZE)
        if ((randomRow === gFirstCellClicked.row && randomCol === gFirstCellClicked.col) || board[randomRow][randomCol].isMine) {
            continue
        }
        board[randomRow][randomCol].isMine = true
        placedMines++
    }
    return board
}

function revealAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true
            }
        }
    }
    renderBoard(gBoard)
}

function onCellRightClicked(event, elCell, rowIdx, colIdx) {
    event.preventDefault()
    toggleFlag(elCell, rowIdx, colIdx)
    isVictory()
}

function toggleFlag(elCell, rowIdx, colIdx) {
    const cell = gBoard[rowIdx][colIdx]
    cell.isMarked = !cell.isMarked
    elCell.innerText = cell.isMarked ? FLAG : EMPTY
}

function isVictory() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
                return
            } else if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                return
            }
        }
    }
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = '🤩'

    gGame.isOn = false
}

function onChangeDifficulty(size, mines) {
    gLevel.SIZE = size
    gLevel.MINES = mines
    gBoardSize = size
    gGame.isOn = false
    onInit()
}

function noNegs(rowIdx, colIdx) {

    gBoard[rowIdx][colIdx].isShown = true

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            if (i === rowIdx && j === colIdx) continue

            var currCell = gBoard[i][j]
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.innerText = gBoard[i][j].minesAroundCount
            currCell.isShown = true
        }
    }
}

function restart() {
    gGame.isOn = false
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = '😁'
    gLivesCount = 3
    onInit()
}

function resetLifeText() {
    var elLives = document.querySelector('.lives')
    if (gLevel.SIZE === 4) {
        gLivesCount = 1  
    } else {
        gLivesCount = 3  
    }
    elLives.innerText = `Lives left: ${gLivesCount}`
}