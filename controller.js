$(document).keydown(function(e) {
	if (e.which == 37) {
		b.snake.direction = 'w'
	}

	else if (e.which == 38) {
		b.snake.direction = 'n'
	}

	else if (e.which == 39) {
		b.snake.direction = 'e'
	}

	else if (e.which == 40) {
		b.snake.direction = 's'
	}
})

