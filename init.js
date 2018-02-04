import {piecesMatrix, piecesColors, game, canvas} from './setup.js'
import {dropPiece} from './events.js';

function draw() {
    canvas.context.fillStyle = '#000';
    canvas.context.fillRect(0, 0, canvas.restraints.width, canvas.restraints.height);

    paintPieces(game.board, {x: 0, y: 0});
    paintPieces(game.matrix, game.pos);
}

function init(time = 0) {
  let deltaTime = time - game.lastTime;

    game.dropCounter += deltaTime;
    if (game.dropCounter > game.dropInterval) {
        dropPiece();
    }

    game.lastTime = time;

    draw();
    game.requestAF = requestAnimationFrame(init);
}

function paintPieces(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                canvas.context.fillStyle = piecesColors[value];
                canvas.context.fillRect(x + offset.x,
                                 y + offset.y,
                                 1, 1);
            }
        });
    });
}

export {init}
