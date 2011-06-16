pack = {};

(function($) {

    // constant variables

    // options
    pack.options= {
      packColor : "yellow",
      enemyColor : "red",
      stageColor : "gray",
      canvasWidth : 600,
      canvasHeight : 600,
      cellSize : 30,
      frameRate : 500,//ms
      gridColor : 'rgb(240, 240, 240)',
      bgColor : 'rgb(255, 255, 255)'
    }
    
    // now pack position
    pack.p = {i:0, j:0};

    // passes
    pack.passes = {}

    // grid data matrix
    pack.matrix = {
      stage : [],
      pack : [],
      enemy : []
    }
    pack.matrirxNum = 0;

    // wall data
    pack.walls = [];

    // main
    pack.draw = function () {

      //DEBUG
      this.walls[0][0] = this.createWall();
      this.walls[10][10] = this.createWall(0, 1);
      this.walls[13][10] = this.createWall(1, 0);

      this.ctx.clearRect(0,0,this.options.canvasWidth,this.options.canvasHeight);
      this.renderGridLine();
      this.renderWalls();
      this.renderAllObjects();
    }

    // initialize
    pack.init = function () {
      var i,j,
      wall = {'right':1, 'bottom':1},
      matrixSizeX = this.options.canvasWidth / this.options.cellSize,
      matrixSizeY = this.options.canvasHeight / this.options.cellSize;
      this.matrixSizeX = matrixSizeX;
      this.matrixSizeY = matrixSizeY;

      // matrixs
      for (var mn in this.matrix) {
        this.matrix[mn] = new Array(this.matrix.length);
        for (i = 0; i < this.matrixSizeX; i++) {
          this.matrix[mn][i] = new Array(matrixSizeY);
          for (j = 0; j < this.matrixSizeY; j++) {
            this.matrix[mn][i][j] = false;
          }
        }
      }

      // walls

      for (i = 0; i < this.matrixSizeX; i++) {
        this.walls[i] = new Array(this.matrix);
        for (j = 0; j < this.matrixSizeY; j++) {
          this.walls[i][j] = $.extend({}, wall, {});
        }
      }

      // DEBUG
      // TODO:make passes object

      // canvas
      this.canvas = document.getElementById('canvasMain');
      this.ctx = this.canvas.getContext('2d');
    }

    // whether a browser suport html5 canvas tag
    pack.checkBrowser = function () {
      if ( ! this.canvas || ! this.canvas.getContext ) {
        console.log("This browser unsupported HTML5.");
        return false;
      } else {
        return true;
      }
    }

    // render dotted line as grid
    pack.renderGridLine= function () {
      var i,
      x1, y1, x2, y2;
      width = this.options.canvasWidth,
      height = this.options.canvasHeight,
      color = this.options.gridColor,
      cellSize = this.options.cellSize,
      cellNumX = width / cellSize,
      cellNumY = height / cellSize,
      ctx = this.canvas.getContext('2d');

      // draw vertical line
      y1 = 0;
      y2 = height;
      for (i = 0; i < cellNumX - 1; i++) {
        x1 = (i + 1) * cellSize;
        x2 = (i + 1) * cellSize;
        this.stroke(x1,y1,x2,y2,color);
      }

      // draw horizontal line
      x1 = 0;
      x2 = width;
      for (i = 0; i < cellNumY - 1; i++) {
        y1 = (i + 1) * cellSize;
        y2 = (i + 1) * cellSize;
        this.stroke(x1,y1,x2,y2,color);
      }
    }

    // render a cell
    // @param x,y : origin coordinate of a cell
    pack.renderCell = function (i, j, f){
      var size = this.options.cellSize,
      x, y;
      x = i * size;
      y = j * size;
      f.apply(this, [x, y]);
    }

    pack.renderPack = function (x, y) {
      var size = this.options.cellSize;
      this.ctx.fillStyle = this.options.packColor;
      this.ctx.fillRect(x,y,size,size);
      this.ctx.fillStyle = "";
    }

    pack.clearPack = function (x, y) {
      var size = this.options.cellSize;
      this.ctx.fillStyle = this.options.bgColor;
      this.ctx.fillRect(x,y,size,size);
      this.ctx.fillStyle = "";
    }

    pack.renderEnemy = function (x, y) {
      var size = this.options.cellSize;
      this.ctx.fillStyle = this.options.enemyColor;
      this.ctx.fillRect(x,y,size,size);
      this.ctx.fillStyle = "";
    }

    pack.renderStage = function (x, y) {
      var size = this.options.cellSize;
      this.ctx.fillStyle = this.options.stageColor;
      this.ctx.fillRect(x,y,size,size);
      this.ctx.fillStyle = "";
    }

    // render all Packs
    pack.renderAllObjects= function() {
      var packs = this.matrix.pack,
      enemies = this.matrix.enemy,
      stages = this.matrix.stage,
      //walls = this.walls,
      size = this.options.cellSize,
      cellNumX = this.matrixSizeX,
      cellNumY = this.matrixSizeY,
      i, j, x, y;

      // <DEBUG>
      //packs[5][5] = true;
      enemies[2][10] = true;
      stages[10][2] = true;
      // </DEBUG>

      for(i = 0; i < packs.length; i++) {
        for(j = 0; j < packs[i].length; j++) {
          if(packs[i][j]) {
            this.renderCell(i, j, this.renderPack);
          } 
          if(enemies[i][j]) {
            this.renderCell(i, j, this.renderEnemy);
          } 
          if(stages[i][j]) {
            this.renderCell(i, j, this.renderStage);
          } 
        }
      }
    }

    // render walls
    pack.renderWalls = function() {
      var walls = this.walls;
      for(i = 0; i < walls.length; i++) {
        for(j = 0; j < walls[i].length; j++) {
          this.renderWallLine(i, j);
        }
      }
    }

    pack.renderWallLine = function(i, j, wall) {
      var x1, y1, // right-bottom coordinate at a cell
      x2, y2,
      wall = wall || this.walls[i][j],
      cellSize = this.options.cellSize;

      if(i||j) {
        //throw "[pack.renderWallLine] argument error.";
      }

      x1 = (i + 1) * cellSize;
      y1 = (j + 1) * cellSize;

      // stroke horizontal line
      if(wall.right == 1 && j != (this.matrixSizeY - 1)) {
        x2 = x1 - cellSize;
        y2 = y1;
        this.stroke(x1, y1, x2, y2);
      }

      // stroke vertical line
      if(wall.bottom == 1 && i != (this.matrixSizeX - 1)) {
        x2 = x1;
        y2 = y1 - cellSize;
        this.stroke(x1, y1, x2, y2);
      }
    }

    // stroke line from (x1, y1) to (x2, y2)
    // default line color : black
    pack.stroke = function(x1, y1, x2, y2, color) {
      var ctx = this.ctx,
      color = color || "black";
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.closePath();
      ctx.stroke();

      this.ctx.strokeStyle = "";
    }

    // create new wall
    pack.createWall = function(right, bottom) {
      var right = right || 0;
      var bottom = bottom || 0;
      var wall = {
        'right':right,
        'bottom':bottom
      }
      return $.extend({}, wall, {});
    }

    pack.movePack = function(di, dj) {
      var p = this.p,
      pNext = {};
      pNext.i = p.i + di;
      pNext.j = p.j + dj;
      //枠チェック
      if(  pNext.i < 0 || pNext.i >= this.matrirxSizeX
        || pNext.j < 0 || pNext.j >= this.matrirxSizeY) {
        return false;
      }
      //壁チェック
      //TODO
      this.renderPackMotion(di, dj);
    }

    pack.renderPackMotion = function(di, dj) {
      if(di > 0 && dj > 0) return false;
      var x,y,xf,yf,xt,yt,xm,ym,i,j,d,rate,dRate,cntRate = 0, timer
      ,that = this
      ,size = this.options.cellSize;
      xf = pack.p.i * size;
      yf = pack.p.j * size;
      xt = (pack.p.i + di) * size;
      yt = (pack.p.j + dj) * size;
      xm = di > 0? 1 : 0;
      ym = dj > 0? 1 : 0;
      x = xf;
      y = yf;
      rate = this.options.frameRate;
      dis = (di > dj? di : dj) * size;
      dRate = rate / dis; 
      timer = setInterval(function(){
          if(cntRate >= dis) {clearInterval(timer);}
          that.clearPack(x, y);
          x += xm;
          y += ym;
          that.renderPack(x, y);
          cntRate++;
        }, dRate);
    }

    //  event on message
    pack.onMessage = function(point) {
      pack.matrix.pack[pack.p.x][pack.p.y] = false;
      pack.p.x += point.x;
      pack.p.y += point.y;
      if(pack.p.x < 0 || pack.p.x > pack.matrirxSizeX) {
        pack.p.x -= point.x;
      }
      if(pack.p.y < 0 || pack.p.y >pack.matrirxSizeY) {
        pack.p.y -= point.y;
      }
      pack.matrix.pack[pack.p.x][pack.p.y] = true;
      pack.draw();
      console.log(pack.p.x+','+pack.p.y)
    }

  })($);


