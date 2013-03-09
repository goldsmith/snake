var c = document.getElementById('mainCanvas')
var ctx = c.getContext('2d')

function Direction (dir) {

	dict = new Object()
	dict['n'] = [0, -1]
	dict['e'] = [1, 0]
	dict['s'] = [0, 1]
	dict['w'] = [-1, 0]

	return dict[dir]
}
function Tile (x, y) {

	this.x = x
	this.y = y

	this.filled = false

	this.display = function() {
		//alert('tile from (' + String(this.x)+','+String(this.y)+') to ('+String(this.x + 10) + ',' + String(this.y + 10) + ')')
		if (this.filled === true) {
			ctx.fillStyle="#FFAA00"
			ctx.fillRect(this.x, this.y, 9, 9)
		}
		else {
			ctx.fillStyle="#FFFFFF"
			ctx.fillRect(this.x, this.y, 9, 9)
		}
	}
}
function Snake (init, direction) {

	this.tiles = new Array()
	this.direction = direction

	for (var i=0; i<init.length; i++) {
		this.tiles.push(init[i])
	}

	this.display = function () {
		for (var i=0; i<this.tiles.length; i++) {
			this.tiles[i].filled = true
			this.tiles[i].display()
		}
	}
}
function Food (tile) {
	this.tile = tile
	this.tile.filled = true
	this.display = function () {this.tile.display()}
	this.clear = function () {this.tile.filled = false}
}

function Board (width, height, snakeLength, snakeDir) {

	this.height = height
	this.width = width

	this.start = function () {

		this.score = 0

		//big blank array of tiles
		this.tiles = new Array(width/10)
		for (var i=0; i<this.tiles.length; i++) {
			this.tiles[i] = new Array(height/10)
			for (var j=0; j<height/10; j++) {
				this.tiles[i][j] = new Tile(10*i, 10*j)
			}
		}

		this.snakeInit = function (length) {

			res = new Array()

			firstW = Math.floor(this.width/20)
			firstH = Math.floor(this.height/20)

			for (var n=0; n<length; n++) {
				this.tiles[firstW+n][firstH].filled = true
				res.push(this.tiles[firstW+n][firstH])
			}

			return res
		}

		this.snake = new Snake(this.snakeInit(snakeLength), snakeDir)
		this.addRandomFood()
	}


	this.growSnake = function() {

		back = this.snake.tiles[this.snake.tiles.length-1]
		backW = Math.floor(back.x/10)
		backH = Math.floor(back.y/10)

		if (this.tiles[backW][backH+1].filled == false) {
			this.snake.tiles.push(this.tiles[backW][backH+1])
			this.tiles[backW][backH+1].filled= true
		}	
	}

	this.addRandomFood = function () {
		while (true) {
			i = Math.floor(Math.random()*this.tiles.length)
			j = Math.floor(Math.random()*this.tiles[i].length)
			if (this.tiles[i][j].filled == false) {
				break
			}
		}
		this.food = new Food(this.tiles[i][j])
	}

	this.move = function () {
		try {
			front = this.snake.tiles[0]
			frontW = Math.floor(front.x/10)
			frontH = Math.floor(front.y/10)
			back = this.snake.tiles[this.snake.tiles.length-1]
		
			dir = new Direction(this.snake.direction)

			//add to the front of the snake
			this.snake.tiles.unshift(this.tiles[frontW+dir[0]][frontH+dir[1]])
			this.tiles[frontW+dir[0]][frontH+dir[1]].filled = true

			//get rid of the end
			back.filled = false
			this.snake.tiles.pop()

			this.display()
		}
		catch(e) {
			//reached end of the board
			this.start()
		}
	}

	this.foodCheck = function() {
		if (this.snake.tiles[0] === this.food.tile) {
			this.food.clear()
			this.addRandomFood()
			this.score += 1
			this.growSnake()
		}
	}

	this.selfCheck = function() {
		front = this.snake.tiles[0]
		body = this.snake.tiles.slice(1,this.snake.tiles.length)
		if (body.indexOf(front) != -1) {
			this.start()
		}
	}

	this.display = function() {
		for (var i=0; i<this.tiles.length; i++) {
			for (var j=0; j<this.tiles[i].length; j++) {
				this.tiles[i][j].display()
			}
		}

		this.snake.display()
		this.food.display()
	}

	this.refresh = function () {
		this.move() //move, if hit wall restart
		this.foodCheck()
		//this.selfCheck()
		this.display()
		//console.log(this.score)
		$("#score").html(this.score)
	}

}



// for (var i=0; i<b.tiles.length; i++) {
// 	for (var j=0; j<b.tiles[i].length; j++) {
// 		b.tiles[i][j].display()
// 	}
// }