let pieces = [[], []];
let occupiedCells = new Array(8);
let piecesIMG = [[], []];
let fieldPositions = new Array(8);
const assets = 'default'
let turn = 0; //It can be changed depending on the mode to an even or odd value
let mouseInField;
let pickedPiece;

const resolution = 600;
const unit = resolution / 8;
// This is the width & height of a box

class Piece {
  constructor(position, team = '0') {
    this.team = team;
    this.position = position;
    this.lastPosition = undefined;
    this.pieceImage = null;
    this.countMoves = 0;
  }

  move(to, to2 = null) {
    if (to instanceof p5.Vector) {
      this.position = to;
    } else if (Number.isInteger(to) && Number.isInteger(to2)) {
      this.position = createVector(to, to2)
    }
    //This if has the function of validating the death of a piece
    if (checkPositions()){
      if (turn%2 === 0){
        for (let i = 0; i < 16; i++){
          if (pieces[1][i].position !== undefined){
            if (pieces[1][i].position.x === pickedPiece.position.x && pieces[1][i].position.y === pickedPiece.position.y){
              pieces[1][i].position = undefined;
              break
            }
          }
        }
      } else {
        for (let i = 0; i < 16; i++){
          if (pieces[0][i].position !== undefined){
            if (pieces[0][i].position.x === pickedPiece.position.x && pieces[0][i].position.y === pickedPiece.position.y){
              pieces[0][i].position = undefined;
              break
            }
          }
        }
      }
    }
    this.countMoves += 1;
    //console.log(pieces[0][0].countMoves);
    turn += 1;
    pickedPiece = undefined;
    for (let i = 0; i < 8; i++){ //This is for cleaning the register of movements of the last turn
      for (let j = 0; j < 8; j++){
        occupiedCells[i][j] = '';
      }
    }
    for (let i = 0; i < 16;i++){
      if (pieces[0][i].position !== undefined){
        occupiedCells[pieces[0][i].position.y][pieces[0][i].position.x] = 0;
      } //White Pieces
      if (pieces[1][i].position !== undefined){
        occupiedCells[pieces[1][i].position.y][pieces[1][i].position.x] = 1;
      } //Black Pieces
    }
    //Castling
    if((occupiedCells[7][1] === '' && occupiedCells[7][2] === '' && occupiedCells[7][3] === '' 
     && pieces[0][8].lastPosition === undefined && pieces[0][14].lastPosition === undefined) || 
     (occupiedCells[7][5] === '' && occupiedCells[7][6] === '' && pieces[0][9].lastPosition === undefined 
     && pieces[0][14].lastPosition === undefined)){
      console.log('Free White')
      //Free cells for castiling (white)
    } else if ((occupiedCells[0][1] === '' && occupiedCells[0][2] === '' && occupiedCells[0][3] === '' 
    && pieces[1][8].lastPosition === undefined && pieces[1][14].lastPosition === undefined) || 
    (occupiedCells[0][5] === '' && occupiedCells[0][6] === '' && pieces[1][9].lastPosition === undefined 
    && pieces[1][14].lastPosition === undefined)){
      console.log('Free Black')
      //Free cells for castiling (white)
    }
    //pieces[team%2][14]
  }

  isPromoted(){
    //Tells if a Pawn can be promoted
    if (this.team === 0 && this.position.y === 0){
      //Deploy menu for selecting a piece to be changed to of the same team, or to keep the Pawn and prevent it of being selected
    }else if (this.team === 1 && this.position.y === 7){
      //Deploy menu for selecting a piece to be changed to of the same team, or to keep the Pawn and prevent it of being selected
    }
  }

  isAllowed() {
    /*Tells if a movement is allowed acording to 
    the rules of the piece*/
    return true
  }

  isValid() {
    /*Tells if a movements is valid 
    acording if there is 'jaque'*/
    return true
  }

  isPicked() {
    /* verifica si la pieza esta seleccionada
  comparando su posicion con la del puntero*/
  if (this.position !== undefined){
    let xy = this.position;
    if (fieldPositions[xy.x][xy.y].x - unit / 2 <= mouseX &&
      mouseX < fieldPositions[xy.x][xy.y].x + unit / 2 &&
      fieldPositions[xy.x][xy.y].y - unit / 2 <= mouseY &&
      mouseY < fieldPositions[xy.x][xy.y].y + unit / 2) {
      return true;
    } else { return false }
  }
  }

  drawPiece() {
    /*Dibuja la pieza de acuerdo a la imagen asignada*/
    if (this.position !== undefined){
      let posxy = this.position
      imageMode(CENTER);
      image(this.pieceImage,
        fieldPositions[posxy.x][posxy.y].x,
        fieldPositions[posxy.x][posxy.y].y, unit, unit);
    }
  }

}

//The function checks at the end of the turn if any piece is over other piece, if it's true then it returns true, otherwise it returns false
function checkPositions(){
  for (let i = 0; i < 16; i++){
    if (pieces[0][i].position !== undefined){
      for (let j = 0; j < 16; j++){
        if (pieces[1][j].position !== undefined){
          if (pieces[1][j].position.x===pieces[0][i].position.x && pieces[1][j].position.y===pieces[0][i].position.y){
            //console.log(pieces[0][i])
            return true;
          }
        }
      }
    }
  }
}

class Pawn extends Piece {
  constructor(position, team) {
    super(position, team);
    if (team === 0) {
      this.pieceImage = piecesIMG[0][0]
    } else {
      this.pieceImage = piecesIMG[1][0]
    }
  }
  isAllowed(to) {
    this.lastPosition = this.position;
    let m;
    let t; //Oposite team
    if (this.team === 1){
      m = 1;
      t = 0;
    } else { t = 1; m = -1}
     /*Tells if a movement is allowed acording to 
     the rules of the piece*/
     if (this.countMoves === 0){
      if (to instanceof p5.Vector) {
        let Vr = absDiff(this.position, to)
        if (to.x === this.position.x && Vr.x <= 2 && ((to.y - this.position.y )  === m * 1 || (to.y - this.position.y )  === m * 2) 
        && (occupiedCells[this.position.y + m][this.position.x] === '' || turn === 0)) {
          return true
        } else if (occupiedCells[to.y][to.x] !== this.team && occupiedCells[to.y][to.x] !== '' 
        && (to.x === this.position.x + 1 || to.x === this.position.x - 1) && this.position.y !== to.y && turn !== 0){
          return true
        }else { return false }
      } else {
        console.error("You must input a P5.vector object")
      }
      } else if (((this.team === 0 && this.position.y === 3)||(this.team === 1 && this.position.y === 4)) 
      && occupiedCells[to.y][to.x] === '' && (to.x === this.position.x + 1 || to.x === this.position.x - 1) 
      && (occupiedCells[to.y - m][to.x] !== this.team && occupiedCells[to.y - m][to.x] !== '') && pieces[t][to.x].countMoves === 1){
          pieces[t][to.x].position = undefined;
          return true;
      } else {
       if (to instanceof p5.Vector) {
         let Vr = absDiff(this.position, to)
         if (to.x === this.position.x && Vr.x <= 1 && (to.y - this.position.y )  === m * 1 
        && (occupiedCells[this.position.y + m][this.position.x] === '' || turn === 0)) {
           return true
         } else if (occupiedCells[to.y][to.x] !== this.team && occupiedCells[to.y][to.x] !== '' 
         && (to.x === this.position.x + 1 || to.x === this.position.x - 1) && this.position.y !== to.y){
           return true
         }else { return false }
       } else {
         console.error("You must input a P5.vector object")
       } 
    }
  }
}

class Rook extends Piece {
  constructor(position, team) {
    super(position, team);

    if (team === 0) {
      this.pieceImage = piecesIMG[0][1]
    } else {
      this.pieceImage = piecesIMG[1][1]
    }

  }

  isAllowed(to) {
    /*Tells if a movement is allowed acording to 
    the rules of the piece*/
    this.lastPosition = this.position;
    let k = this.position.x;
    let l = this.position.y;
    let t = this.team;
    if (to instanceof p5.Vector) {
      if (this.position.x === to.x && this.position.y !== to.y){
        if (to.y > this.position.y){
          while (l < to.y){
            l += 1;
            if (occupiedCells[l][this.position.x] === (t)){
              return false
            } else if (occupiedCells[l][this.position.x] !== (t) && occupiedCells[l][this.position.x] !== ''){
                if (l === to.y){
                  return true
                } else { return false }
              }
            if (l === to.y){ return true }
          }
        } else if (to.y < this.position.y){
          while (l > to.y){
            l -= 1;
            if (occupiedCells[l][this.position.x] === (t)){
              return false
            } else if (occupiedCells[l][this.position.x] !== (t) && occupiedCells[l][this.position.x] !== ''){
                if (l === to.y){
                  return true
                } else { return false }
              }
            if (l === to.y){ return true }
          }
        } 
      } else if (this.position.y === to.y && this.position.x !== to.x){
        if (to.x > this.position.x){
          while (k < to.x){
            k += 1;
            if (occupiedCells[this.position.y][k] === (t)){
              return false
            } else if (occupiedCells[this.position.y][k] !== (t) && occupiedCells[this.position.y][k] !== ''){
                if (k === to.x){
                  return true
                } else { return false }
              }
            if (k === to.x){ return true }
          }
        } else if (to.x < this.position.x){
          while (k > to.x){
            k -= 1;
            if (occupiedCells[this.position.y][k] === (t)){
              return false
            } else if (occupiedCells[this.position.y][k] !== (t) && occupiedCells[this.position.y][k] !== ''){
                if (k === to.x){
                  return true
                } else { return false }
              }
            if (k === to.x){ return true }
          }
        }
      } else { return false}
    } else {
      console.error("You must input a P5.vector object")
    }
  }
}

class Knight extends Piece {
  constructor(position, team) {
    super(position, team);

    if (team === 0) {
      this.pieceImage = piecesIMG[0][2]
    } else {
      this.pieceImage = piecesIMG[1][2]
    }
  }

  isAllowed(to) {
    /*Tells if a movement is allowed acording to 
    the rules of the piece*/
    this.lastPosition = this.position;
    if (to instanceof p5.Vector) {
      let valids = [createVector(2, 1), createVector(1, 2)]
      if (absDiff(this.position, to).equals(valids[0]) ||
        absDiff(this.position, to).equals(valids[1])) {
        return true
      } else { return false }

    } else {
      console.error("You must input a P5.vector object")
    }

  }
}

class Bishop extends Piece {
  constructor(position, team) {
    super(position, team);

    if (team === 0) {
      this.pieceImage = piecesIMG[0][3]
    } else {
      this.pieceImage = piecesIMG[1][3]
    }
  }

  isAllowed(to) {
    /*Tells if a movement is allowed acording to 
    the rules of the piece*/
    this.lastPosition = this.position;
    let b = this.position.x;
    let c = this.position.y;
    if (to instanceof p5.Vector) {
      let Vr = absDiff(this.position, to);
      if (Vr.x === Vr.y && this.position.x !== to.x) {
        let b = this.position.x;
        let c = this.position.y;
        if (this.position.x < to.x && this.position.y > to.y){
          //console.log('diagonal q1')
          while (b < to.x){
            b += 1
            c -= 1
            if (occupiedCells[c][b] !== this.team && occupiedCells[c][b] !== '' && b === to.x){
              //console.log('ER2')
              return true
            }
            if (b === to.x){
              //console.log('ER3')
              return true
            }
            if (occupiedCells[c][b] !== '' || occupiedCells[c][b] === this.team){
              //console.log('ER1')
              return false
            } 
          }
        } 
        if (this.position.x < to.x && this.position.y < to.y){
          //console.log('diagonal q4')
          while (b < to.x){
            b += 1
            c += 1
            if (occupiedCells[c][b] !== this.team && occupiedCells[c][b] !== '' && b === to.x){
              //console.log('ER2')
              return true
            } 
            if (b === to.x){
              //console.log('ER3')
              return true
            }
            if (occupiedCells[c][b] !== '' || occupiedCells[c][b] === this.team){
              //console.log('ER1')
              return false
            } 
          }
        } 
        if (this.position.x > to.x && this.position.y < to.y){
          //console.log('diagonal q3')
          while (b > to.x){
            b -= 1
            c += 1
            if (occupiedCells[c][b] !== this.team && occupiedCells[c][b] !== '' && b === to.x){
              //console.log('ER2')
              return true
            }
            if (b === to.x){
              //console.log('ER3')
              return true
            }
            if (occupiedCells[c][b] !== '' || occupiedCells[c][b] === this.team){
              //console.log('ER1')
              return false
            }
          }
        } 
        if (this.position.x > to.x && this.position.y > to.y){
          //console.log('diagonal q2')
          while (b > to.x){
            b -= 1
            c -= 1
            if (occupiedCells[c][b] !== this.team && occupiedCells[c][b] !== '' && b === to.x){
              //console.log('ER2')
              return true
            }
            if (b === to.x){
              //console.log('ER3')
              return true
            }
            if (occupiedCells[c][b] !== '' || occupiedCells[c][b] === this.team){
              //console.log('ER1')
              return false
            }
        }
      } else { return false }
    } else { return false }
   } else {
    console.error("You must input a P5.vector object")
   }
  }
}
class Queen extends Piece {
  constructor(position, team) {
    super(position, team);

    if (team === 0) {
      this.pieceImage = piecesIMG[0][4]
    } else {
      this.pieceImage = piecesIMG[1][4]
    }

  }

  isAllowed(to) {
    /*Tells if a movement is allowed acording to 
    the rules of the piece*/
    this.lastPosition = this.position;
    let k = this.position.x;
    let l = this.position.y;
    let t = this.team;
    if (to instanceof p5.Vector) {
      let Vr = absDiff(this.position, to)
      if (this.position.x === to.x && this.position.y !== to.y){
        if (to.y > this.position.y){
          while (l < to.y){
            l += 1;
            if (occupiedCells[l][this.position.x] === (t)){
              return false
            } else if (occupiedCells[l][this.position.x] !== (t) && occupiedCells[l][this.position.x] !== ''){
                if (l === to.y){
                  return true
                } else { return false }
              }
            if (l === to.y){ return true }
          }
        } else if (to.y < this.position.y){
          while (l > to.y){
            l -= 1;
            if (occupiedCells[l][this.position.x] === (t)){
              return false
            } else if (occupiedCells[l][this.position.x] !== (t) && occupiedCells[l][this.position.x] !== ''){
                if (l === to.y){
                  return true
                } else { return false }
              }
            if (l === to.y){ return true }
          }
        } 
      } else if (this.position.y === to.y && this.position.x !== to.x){
        if (to.x > this.position.x){
          while (k < to.x){
            k += 1;
            if (occupiedCells[this.position.y][k] === (t)){
              return false
            } else if (occupiedCells[this.position.y][k] !== (t) && occupiedCells[this.position.y][k] !== ''){
                if (k === to.x){
                  return true
                } else { return false }
              }
            if (k === to.x){ return true }
          }
        } else if (to.x < this.position.x){
          while (k > to.x){
            k -= 1;
            if (occupiedCells[this.position.y][k] === (t)){
              return false
            } else if (occupiedCells[this.position.y][k] !== (t) && occupiedCells[this.position.y][k] !== ''){
                if (k === to.x){
                  return true
                } else { return false }
              }
            if (k === to.x){ return true }
          }
        }
      } else if (Vr.x === Vr.y && this.position.x !== to.x) {
        let b = this.position.x;
        let c = this.position.y;
        if (this.position.x < to.x && this.position.y > to.y){
          //console.log('diagonal q1')
          while (b < to.x){
            b += 1
            c -= 1
            if (occupiedCells[c][b] !== this.team && occupiedCells[c][b] !== '' && b === to.x){
              //console.log('ER2')
              return true
            }
            if (b === to.x){
              //console.log('ER3')
              return true
            }
            if (occupiedCells[c][b] !== '' || occupiedCells[c][b] === this.team){
              //console.log('ER1')
              return false
            } 
          }
        } 
        if (this.position.x < to.x && this.position.y < to.y){
          //console.log('diagonal q4')
          while (b < to.x){
            b += 1
            c += 1
            if (occupiedCells[c][b] !== this.team && occupiedCells[c][b] !== '' && b === to.x){
              //console.log('ER2')
              return true
            } 
            if (b === to.x){
              //console.log('ER3')
              return true
            }
            if (occupiedCells[c][b] !== '' || occupiedCells[c][b] === this.team){
              //console.log('ER1')
              return false
            } 
          }
        } 
        if (this.position.x > to.x && this.position.y < to.y){
          //console.log('diagonal q3')
          while (b > to.x){
            b -= 1
            c += 1
            if (occupiedCells[c][b] !== this.team && occupiedCells[c][b] !== '' && b === to.x){
              //console.log('ER2')
              return true
            }
            if (b === to.x){
              //console.log('ER3')
              return true
            }
            if (occupiedCells[c][b] !== '' || occupiedCells[c][b] === this.team){
              //console.log('ER1')
              return false
            }
          }
        } 
        if (this.position.x > to.x && this.position.y > to.y){
          //console.log('diagonal q2')
          while (b > to.x){
            b -= 1
            c -= 1
            if (occupiedCells[c][b] !== this.team && occupiedCells[c][b] !== '' && b === to.x){
              //console.log('ER2')
              return true
            }
            if (b === to.x){
              //console.log('ER3')
              return true
            }
            if (occupiedCells[c][b] !== '' || occupiedCells[c][b] === this.team){
              //console.log('ER1')
              return false
            }
        }
      } else { return false }
    } else { return false }
    } else {
      console.error("You must input a P5.vector object")
    }

  }
}

class King extends Piece {
  constructor(position, team) {
    super(position, team);

    if (team === 0) {
      this.pieceImage = piecesIMG[0][5]
    } else {
      this.pieceImage = piecesIMG[1][5]
    }

  }
   isAllowed(to) {
     /*Tells if a movement is allowed acording to 
     the rules of the piece*/
     if (to instanceof p5.Vector) {
       let Vr = absDiff(this.position, to)
       if ((Vr.x === 1 && Vr.y === 1) || (this.position.x === to.x && this.position.y !== to.y && Vr.y === 1) ||
       (this.position.y === to.y && this.position.x !== to.x && Vr.x === 1)) {
        return true
       } else { return false }
     } else {
       console.error("You must input a P5.vector object")
     }

   }
}

function preload() {
  piecesIMG[0][0] = loadImage('pieces/' + assets + '/W_P.png');
  piecesIMG[0][1] = loadImage('pieces/' + assets + '/W_R.png');
  piecesIMG[0][2] = loadImage('pieces/' + assets + '/W_N.png');
  piecesIMG[0][3] = loadImage('pieces/' + assets + '/W_B.png');
  piecesIMG[0][5] = loadImage('pieces/' + assets + '/W_K.png');
  piecesIMG[0][4] = loadImage('pieces/' + assets + '/W_Q.png');

  piecesIMG[1][0] = loadImage('pieces/' + assets + '/B_P.png');
  piecesIMG[1][1] = loadImage('pieces/' + assets + '/B_R.png');
  piecesIMG[1][2] = loadImage('pieces/' + assets + '/B_N.png');
  piecesIMG[1][3] = loadImage('pieces/' + assets + '/B_B.png');
  piecesIMG[1][4] = loadImage('pieces/' + assets + '/B_Q.png');
  piecesIMG[1][5] = loadImage('pieces/' + assets + '/B_K.png');
}

function setup() {
  createCanvas(resolution, resolution);
  //Crea al Array de Posiciones
  for (let i = 0; i < 8; i++){
    occupiedCells[i] = new Array(8);
  }
  for (let i = 0; i < fieldPositions.length; i++) {
    fieldPositions[i] = new Array(8);
    for (let j = 0; j < 8; j++) {
      fieldPositions[i][j] = createVector((i + 1) * unit / 2 + i * unit / 2, (j + 1) * unit / 2 + j * unit / 2);
    };
    //crea los peones negros
    for (let i = 0; i < 8; i++) {
      pieces[1][i] = new Pawn(createVector(i, 1), 1)
      pieces[0][i] = new Pawn(createVector(i, 6), 0)
    };
    //Crea piezas altas
    pieces[1][8] = new Rook((createVector(0, 0)), 1)
    pieces[1][9] = new Rook((createVector(7, 0)), 1)
    pieces[0][8] = new Rook((createVector(0, 7)), 0)
    pieces[0][9] = new Rook((createVector(7, 7)), 0)

    pieces[1][10] = new Knight((createVector(1, 0)), 1)
    pieces[1][11] = new Knight((createVector(6, 0)), 1)
    pieces[0][10] = new Knight((createVector(1, 7)), 0)
    pieces[0][11] = new Knight((createVector(6, 7)), 0)

    pieces[1][12] = new Bishop((createVector(2, 0)), 1)
    pieces[1][13] = new Bishop((createVector(5, 0)), 1)
    pieces[0][12] = new Bishop((createVector(2, 7)), 0)
    pieces[0][13] = new Bishop((createVector(5, 7)), 0)

    pieces[1][14] = new King((createVector(4, 0)), 1)
    pieces[0][14] = new King((createVector(4, 7)), 0)

    pieces[1][15] = new Queen((createVector(3, 0)), 1)
    pieces[0][15] = new Queen((createVector(3, 7)), 0)
  };
  //Creates the array for the positions of all the pieces
  //loadPositions();
}

function draw() {
  background(220);
  chessGrid();
  for (let i = 0; i < 16; i++) { //Dibuja las piezas
    if (pieces[1][i].position !== undefined){
      pieces[1][i].drawPiece();
    }
    if (pieces[0][i].position !== undefined){
      pieces[0][i].drawPiece();
    }
  }

  if (pickedPiece != undefined) {
    push();
    noFill();
    strokeWeight(4);
    stroke('yellow');
    rectMode(CENTER);
    let psxy = pickedPiece.position;
    rect(fieldPositions[psxy.x][psxy.y].x, fieldPositions[psxy.x][psxy.y].y, unit)
    pop();

    push();
    noFill();
    strokeWeight(4);
    stroke('purple');
    rectMode(CENTER);
    let msxy = whereMouse();
    rect(fieldPositions[msxy.x][msxy.y].x, fieldPositions[msxy.x][msxy.y].y, unit)
    pop();
  }
}

function mouseClicked() {
  let fieldMs = whereMouse();
  if (pickedPiece != undefined) {
    if (pickedPiece.isAllowed(fieldMs)) {
      pickedPiece.move(fieldMs)
    }
  }
}

function whereMouse() {
  /*This function returns where is the mouse in
  reference to the field*/

  msX = mouseX;
  msY = mouseY;
  
  let xP = Math.floor(msX/unit);
  let yP = Math.floor(msY/unit);
  
  if(xP > 7){xP = 7}
  if(yP > 7){yP = 7}
  
  return(createVector(xP,yP))

}

function mousePressed() {
  //TO-DO salir de la funcion al seleccionar
  let i_flag16 = false;

  for (let i = 0; i < 16; i++) {
    if (!i_flag16) {
      for (let j = 0; j < 2; j++) {
        if (pieces[j][i].isPicked() && pieces[j][i].team === turn%2) {
          pickedPiece = pieces[j][i];
          i_flag16 = true;
          break;
        }
      }
    }
  }

  mouseInField = whereMouse();
}

function absDiff(V1, V2) {
  return createVector(Math.abs(V1.x - V2.x), Math.abs(V1.y - V2.y))
}

function chessGrid() {
  let colors = ['rgb(238,238,210)', 'rgb(118,150,86)']
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      push();
      noStroke();
      fill(colors[(row + col) % 2]);
      rect(row * unit, col * unit, unit);
      pop();
    }
  }
}