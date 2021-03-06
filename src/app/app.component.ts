import { Component } from '@angular/core';
import { BestScoreManager } from './app.storage.service';
import { CONTROLS, COLORS, BOARD_SIZE, GAME_MODES } from './app.constants';
import { IfObservable } from '../../node_modules/rxjs/observable/IfObservable';
import { truncate } from 'fs';


@Component({
  selector: 'snake',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: {
    '(document:keydown)': 'handleKeyboardEvents($event)'
  }
})
export class AppComponent {
  private interval: number;
  private wormDirection: number;
  private default_mode = 'Level_1';
  private isGameOver = false;
  public text='Hello, My name is NibiNibi!';
  public showGme = true;
  public all_modes = GAME_MODES;
  public getKeys = Object.keys;
  public board = [];
  public obstacles = [];
  public score = 0;
  public showMenuChecker = true;
  public gameStarted = false;
  public newBestScore = false;
  public best_score = this.bestScoreService.retrieve();
public childAge = 0;
public IschildAgeSet = false;
public IsMoving = false;
public obKeyPressed = "";
public obCodeBehind = "";
isLevel1 = false;
  private worm = {
    direction: CONTROLS.LEFT,
    parts: [
      {
        x: -1,
        y: -1
      }
    ]
  };

  private fruit = {
    x: -1,
    y: -1
  };

  constructor(private bestScoreService: BestScoreManager){
	  console.log(this.showGme);
    this.setBoard();
	this.playAudio('https://github.com/vaibhavkeshav/hackdays/raw/master/begin.m4a');
	if(this.default_mode == 'Level_1')
		this.isLevel1 = true;
	else
		this.isLevel1 = false;
  }

  handleKeyboardEvents(e: KeyboardEvent) {
    if (e.keyCode === CONTROLS.LEFT && this.worm.direction !== CONTROLS.RIGHT) {
      this.wormDirection = CONTROLS.LEFT;
    } else if (e.keyCode === CONTROLS.UP && this.worm.direction !== CONTROLS.DOWN) {
      this.wormDirection = CONTROLS.UP;
    } else if (e.keyCode === CONTROLS.RIGHT && this.worm.direction !== CONTROLS.LEFT) {
      this.wormDirection = CONTROLS.RIGHT;
    } else if (e.keyCode === CONTROLS.DOWN && this.worm.direction !== CONTROLS.UP) {
      this.wormDirection = CONTROLS.DOWN;
    }
  }
  
  playAudio(cs:string){
	
    const newLocal = cs;
    let audio = new Audio(newLocal);
	
    audio.load();
    audio.play();
  }
  setColors(col: number, row: number): string {
    if (this.isGameOver) {
      return COLORS.GAME_OVER;
    } else if (this.fruit.x === row && this.fruit.y === col) {
      return COLORS.FRUIT;
    } else if (this.worm.parts[0].x === row && this.worm.parts[0].y === col) {
      return COLORS.HEAD;
    } else if (this.board[col][row] === true) {
      return COLORS.BODY;
    } else if (this.default_mode === 'Level_3' && this.checkObstacles(row, col)) {
      return COLORS.OBSTACLE;
    }

    return COLORS.BOARD;
  };
  
   btn_setChildAge(ageRange):void{
     if (ageRange==='10'){
       this.IsMoving=true;
     }else{
      this.IsMoving=false;
     }
	   //alert('age is: '+ageRange);
		this.IschildAgeSet = true;
		this.childAge = ageRange;
		this.showGme=false;		
	   console.log('hey :'+ !this.showGme);
	   
     this.btn_showGameBoard();
     this.playAudio('https://github.com/vaibhavkeshav/hackdays/raw/master/Level.m4a');
	 //  this.setBoard();
	  //   this.router.navigate(['./home']);
  }
  
  btn_showGameBoard(){
	 
	  if(this.showGme)
		 this.showGme=true;
	  else
		  this.showGme=true;
	   console.log('hey :'+ !this.showGme);
	 //  this.setBoard();
	  //   this.router.navigate(['./home']);
  }
  
   btn_clearGameBoard(){
	 // alert('hi');
	  this.IschildAgeSet = false;
	  this.childAge = 0;
	  this.showGme=false;		
	  console.log('hey :'+ !this.showGme);
	  this.playAudio('https://github.com/hwolkowski/DualityNet/raw/master/Age%20Group.m4a');
	 
  }

  updatePositions(): void {
    let New_position = this.repositionHead();
    let me = this;
    if (this.IsMoving){
      let dir = this.randomNumber()%4;
      let tx = this.fruit.x;
      let ty = this.fruit.y;
      if (dir===0){
        this.fruit.x++;
      }else if (dir===1){
        this.fruit.x--;
      }else if (dir===2){
        this.fruit.y++;
      }else if (dir===3){
        this.fruit.y--;
      }
      if ((this.obstacleCollision(this.fruit))||(this.boardCollision(this.fruit))||(this.selfCollision(this.fruit))){
        this.fruit.x=tx;
        this.fruit.y=ty;
      }
    }
    if (this.default_mode === 'Level_1' && this.boardCollision(New_position)) {
      return this.gameOver();
    } else if (this.default_mode === 'Level_2') {
      this.noWallsTransition(New_position);
    } else if (this.default_mode === 'Level_3') {
      this.noWallsTransition(New_position);
      if (this.obstacleCollision(New_position)) {
        return this.gameOver();
      }
    }

    if (this.selfCollision(New_position)) {
      return this.gameOver();
    } else if (this.fruitCollision(New_position)) {
      this.eatFruit();
    }

    let oldTail = this.worm.parts.pop();
    this.board[oldTail.y][oldTail.x] = false;

    this.worm.parts.unshift(New_position);
    this.board[New_position.y][New_position.x] = true;

    this.worm.direction = this.wormDirection;

    setTimeout(() => {
      me.updatePositions();
    }, this.interval);
  }

  repositionHead(): any {
    let New_position = Object.assign({}, this.worm.parts[0]);

    if (this.wormDirection === CONTROLS.LEFT) {
	this.obKeyPressed = "LEFT key pressed";
	this.obCodeBehind = "New_position.x -= 1;";
      New_position.x -= 1;
    } else if (this.wormDirection === CONTROLS.RIGHT) {
	  this.obKeyPressed = "RIGHT key pressed";
	  this.obCodeBehind = "New_position.x += 1;";
      New_position.x += 1;
    } else if (this.wormDirection === CONTROLS.UP) {
	  this.obKeyPressed = "UP key pressed";
	  this.obCodeBehind = "New_position.y -= 1;";
      New_position.y -= 1;
    } else if (this.wormDirection === CONTROLS.DOWN) {
	 this.obKeyPressed = "DOWN key pressed";
	 this.obCodeBehind = "New_position.y += 1; ";
      New_position.y += 1;
    }

    return New_position;
  }

  noWallsTransition(part: any): void {
    if (part.x === BOARD_SIZE) {
      part.x = 0;
    } else if (part.x === -1) {
      part.x = BOARD_SIZE - 1;
    }

    if (part.y === BOARD_SIZE) {
      part.y = 0;
    } else if (part.y === -1) {
      part.y = BOARD_SIZE - 1;
    }
  }

  addObstacles(): void {
    let x = this.randomNumber();
    let y = this.randomNumber();

    if (this.board[y][x] === true || y === 8) {
      return this.addObstacles();
    }

    this.obstacles.push({
      x: x,
      y: y
    });
  }

  checkObstacles(x, y): boolean {
    let res = false;

    this.obstacles.forEach((val) => {
      if (val.x === x && val.y === y) {
        res = true;
      }
    });

    return res;
  }

  obstacleCollision(part: any): boolean {
    return this.checkObstacles(part.x, part.y);
  }

  boardCollision(part: any): boolean {
    return part.x === BOARD_SIZE || part.x === -1 || part.y === BOARD_SIZE || part.y === -1;
  }

  selfCollision(part: any): boolean {
    return this.board[part.y][part.x] === true;
  }

  fruitCollision(part: any): boolean {
    return part.x === this.fruit.x && part.y === this.fruit.y;
  }

  resetFruit(): void {
    let x = this.randomNumber();
    let y = this.randomNumber();

    if (this.board[y][x] === true || this.checkObstacles(x, y)) {
      return this.resetFruit();
    }

    this.fruit = {
      x: x,
      y: y
    };
  }

  eatFruit(): void {
    this.score++;

    let tail = Object.assign({}, this.worm.parts[this.worm.parts.length - 1]);

    this.worm.parts.push(tail);
    this.resetFruit();

    if (this.score % 5 === 0) {
      this.interval -= 15;
    }
  }

  gameOver(): void {
    this.isGameOver = true;
    this.gameStarted = false;
    let me = this;
	this.text="Game Over. Better luck next time.";
    if (this.score > this.best_score) {
      this.bestScoreService.store(this.score);
      this.best_score = this.score;
      this.newBestScore = true;
    }

    setTimeout(() => {
      me.isGameOver = false;
    }, 500);

    this.setBoard();
  }

  randomNumber(): any {
    return Math.floor(Math.random() * BOARD_SIZE);
  }

  setBoard(): void {
    this.board = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      this.board[i] = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        this.board[i][j] = false;
      }
    }
  }

  showMenu(): void {
	this.text="Catch as many hamsters you can!";
    this.showMenuChecker = !this.showMenuChecker;
	 this.playAudio('https://github.com/vaibhavkeshav/hackdays/raw/master/Level.m4a');
	 this.isGameOver = true;
  }

  newGame(mode: string): void {
    this.default_mode = mode || 'Level_1';
    this.showMenuChecker = false;
    this.newBestScore = false;
    this.gameStarted = true;
    this.score = 0;
	this.text="Catch as many hamsters you can!";
    this.wormDirection = CONTROLS.LEFT;
    this.isGameOver = false;
    this.interval = 150;
    this.worm = {
      direction: CONTROLS.LEFT,
      parts: []
    };

    for (let i = 0; i < 3; i++) {
      this.worm.parts.push({ x: 8 + i, y: 8 });
    }

    if (mode === 'Level_3') {
      this.obstacles = [];
      let j = 1;
      do {
        this.addObstacles();
      } while (j++ < 9);
    }

    this.resetFruit();
    this.updatePositions();
  }
}
