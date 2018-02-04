import {piecesMatrix, piecesColors, game} from './setup.js'
import {init} from './init.js';
import {score, updateScore} from './score.js';

let pieceMatrix, nextPiecePreview;

nextPiece();

document.addEventListener('keydown', event => {
    switch(event.keyCode){
      case 32 : event.preventDefault(); game.isPaused = false; togglePause(); game.currentPieceMatrix = game.previewNextLetterMatrix; generatePreviewNextLetterMatrix(); nextPiece(); break;
      case 37 : event.preventDefault(); movePiece(-1); break;
      case 39 : event.preventDefault(); movePiece(1); break;
      case 40 : event.preventDefault(); dropPiece(); break;
      case 80 : event.preventDefault(); game.isPaused = !game.isPaused; togglePause(); break; // p
      case 38 : event.preventDefault(); rotateEvent(-1); break; // up
      case 83 : event.preventDefault(); toggleMusicPlayer(); break; // s
    }
});

function generateRandomLetterMatrix(){
  let pieceMatrix,
      letters = 'IJLOSTZ',
      index = letters.length * Math.random() | 0,
      randomLetter = letters[index];

  return {letterIndex: index, matrix: piecesMatrix[randomLetter]};
}

function generatePreviewNextLetterMatrix(){
  nextPiecePreview = generateRandomLetterMatrix();
  game.previewNextLetterMatrix = nextPiecePreview.matrix;
  document.getElementById('nextPiece').className = 'elem'+nextPiecePreview.letterIndex;
}

function nextPiece() {
  game.currentPieceMatrix = game.currentPieceMatrix || generateRandomLetterMatrix().matrix;
  pieceMatrix = game.currentPieceMatrix;

    game.pos.y = 0;
    game.pos.x = (game.board[0].length / 2 | 0) -
                   (pieceMatrix[0].length / 2 | 0);
    if (hasCollided()) {
        game.board.forEach(row => row.fill(0));
        game.score = 0;
        updateScore();
    }
}

function dropPiece() {
    game.pos.y++;
    if (hasCollided()) {
        game.pos.y--;
        storePiecesInBoardMatrix();
        game.currentPieceMatrix = game.previewNextLetterMatrix;
        generatePreviewNextLetterMatrix();
        nextPiece();
        score();
        updateScore();
    }
    game.dropCounter = 0;
}

function hasCollided() {
    for (let y = 0; y < pieceMatrix.length; ++y) {
        for (let x = 0; x < pieceMatrix[y].length; ++x) {
            if (pieceMatrix[y][x] !== 0 &&
               (game.board[y + game.pos.y] &&
                game.board[y + game.pos.y][x + game.pos.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function movePiece(offset) {
    game.pos.x += offset;
    if (hasCollided()) {
        game.pos.x -= offset;
    }
}

function storePiecesInBoardMatrix() {
    game.currentPieceMatrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                game.board[y + game.pos.y][x + game.pos.x] = value;
            }
        });
    });
}

function rotateEvent(direction) {
    const pos = game.pos.x;
    let offset = 1;
    rotatePiece(game.currentPieceMatrix, direction);
    while (hasCollided()) {
        game.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > game.currentPieceMatrix[0].length) {
            rotatePiece(game.currentPieceMatrix, -direction);
            game.pos.x = pos;
            return;
        }
    }
}

function toggleMusicPlayer(){
  let audioElement = document.getElementsByTagName('audio')[0];
  if(audioElement.paused){
    audioElement.play();
  } else {
    audioElement.pause();
  }
}

function togglePause(){
  if(game.isPaused) {
    cancelAnimationFrame(game.requestAF);
    game.requestAF = null;
  } else {
    if (!game.requestAF) {
      init();
    }
  }
}

function rotatePiece(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }

    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

export {nextPiece, dropPiece, generatePreviewNextLetterMatrix}
