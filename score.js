import {piecesMatrix, piecesColors, game} from './setup.js'

updateScore();

function score() {
    let rowCount = 1;
    outer: for (let y = game.board.length -1; y > 0; --y) {
        for (let x = 0; x < game.board[y].length; ++x) {
            if (game.board[y][x] === 0) {
                continue outer;
            }
        }

        const row = game.board.splice(y, 1)[0].fill(0);
        game.board.unshift(row);
        ++y;

        game.score += rowCount * 10;
        rowCount *= 2;
    }
}

function updateScore() {
    document.getElementById('score').innerText = game.score;
}

export {score, updateScore};
