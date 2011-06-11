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
      frameRate : 50,//ms
      gridColor : 'rgb(240, 240, 240)',
      bgColor : 'rgb(255, 255, 255)'
    }
    
    // now pack position
    pack.p = {i:10, j:10};
    pack.packDirection = '';

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
      this.ctx.clearRect(0,0,this.options.canvasWidth,this.options.canvasHeight);
      this.renderGridLine();
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
      var size = this.options.cellSize
      ,r = (size-1)/2
      ,rx = x + size/2
      ,ry = y + size/2
      ,msize = Math.PI/6,mths,mthe;

      //base circle
      this.ctx.fillStyle = this.options.packColor;
      this.ctx.beginPath();
      this.ctx.arc(rx, ry, r, 0, Math.PI * 2, true);
      this.ctx.fill();
      this.ctx.closePath();

      if(this.packDirection == 'left') {
        mths = Math.PI + msize;
        mthe = Math.PI - msize;
      } else if(this.packDirection == 'up') {
        mths = Math.PI / 2 + msize;
        mthe = Math.PI / 2 - msize;
      } else if(this.packDirection == 'right') {
        mths = msize;
        mthe = 2 * Math.PI - msize;
      } else if(this.packDirection == 'down') {
        mths = Math.PI * 3 / 2 + msize;
        mthe = Math.PI * 3 / 2 - msize;
      } else {
        return false;
      }

      //erase mouth region
      this.ctx.fillStyle = this.options.bgColor;
      this.ctx.beginPath();
      this.ctx.arc(rx, ry, r, mths, mthe, true);
      this.ctx.fill();
      this.ctx.closePath();
      this.ctx.beginPath();
      this.ctx.moveTo(rx, ry);
      this.ctx.lineTo(rx + r * Math.cos(mths), ry + r * Math.sin(mths));
      this.ctx.lineTo(rx + r * Math.cos(mthe), ry + r * Math.sin(mthe));
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.fillStyle = "";
    }

    pack.clearPack = function (x, y) {
      var size = this.options.cellSize;
      this.ctx.fillStyle = this.options.bgColor;
      this.ctx.clearRect(x,y,size,size);
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
      enemies[2][10] = true;
      stages[10][2] = true;
      stages[10][3] = true;
      stages[10][4] = true;
      stages[11][4] = true;
      stages[12][4] = true;
      stages[13][4] = true;
      // </DEBUG>

      for(i = 0; i < packs.length; i++) {
        for(j = 0; j < packs[i].length; j++) {
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
      //check frame and stage and motion lock
      if(  pNext.i < 0 || pNext.i >= this.matrixSizeX
        || pNext.j < 0 || pNext.j >= this.matrixSizeY
        || this.motionLock) {
        return false;
      } else {
        if(this.matrix.stage[pNext.i][pNext.j])return false;
        this.renderPackMotion(di, dj);
      }
    }

    pack.renderPackMotion = function(di, dj) {
      if(di != 0 && dj != 0) return false;
      var x,y,xf,yf,xt,yt,xm,ym,i,j,d,rate,dRate,cntRate = 0, timer
      ,that = this
      ,size = this.options.cellSize;
      xf = pack.p.i * size;
      yf = pack.p.j * size;
      xt = (pack.p.i + di) * size;
      yt = (pack.p.j + dj) * size;
      xm = di != 0? di : 0;
      ym = dj != 0? dj : 0;
      x = xf;
      y = yf;
      rate = this.options.frameRate;
      dis = Math.abs(di != 0? di : dj) * size;
      dRate = rate / dis; 
      if(di > 0) {
        this.packDirection = 'right';
      } else if(di < 0) {
        this.packDirection = 'left';
      } else if(dj > 0) {
        this.packDirection = 'up';
      } else if(dj < 0) {
        this.packDirection = 'down';
      } else {
        return false
      }
      timer = setInterval(function(){
          that.motionLock = true;
          if(cntRate >= (dis - 1)) {
            clearInterval(timer);
            that.motionLock = false;
          }
          that.clearPack(x, y);
          x += xm;
          y += ym;
          that.renderPack(x, y);
          cntRate++;
        }, dRate);
      this.p.i += di;
      this.p.j += dj;
    }

    //  event on message
    pack.onMessage = function(data) {
      var point = eval('('+data+')');
      pack.movePack(point.i, point.j);
      console.log(pack.packDirection)
    }

  })($);


