'use strict'

function drawNum(gNums) {
    var numIdx = getRandomInt(0, gNums.length)
    var num = gNums[numIdx]
    gNums.splice(numIdx, 1)
    return num
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}

