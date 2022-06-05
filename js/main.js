//Para el Board
(function(){

    //Se crea la clase Board
	self.Board = function(width,height){
		this.width = width;
		this.height = height;
		this.playing = false;
		this.game_over = false;
		this.bars = [];
		this.ball = null;
		this.playing = false;
	}

    //Se modifica el prototipo de Board
	self.Board.prototype = {
		get elements(){
			var elements = this.bars.map(function(bar){ return bar; });
			elements.push(this.ball);
			return elements;
		}
	}
})();




//Para mostrar el Board
(function(){

    //Clase BoardView
	self.BoardView = function(canvas,board){

		this.canvas = canvas;
		this.canvas.width = board.width;
		this.canvas.height = board.height;
		this.board = board;
		this.ctx = canvas.getContext("2d"); //2 dimensiones
	}

    //Modifica el prototipo de BoardViee
	self.BoardView.prototype = {
		clean: function(){
			this.ctx.clearRect(0,0,this.board.width,this.board.height);
		},
		draw: function(){//dibuja los elementos en el contexto del canvas

			for (var i = this.board.elements.length - 1; i >= 0; i--) {
				var el = this.board.elements[i];

				draw(this.ctx,el);
			};
		},
		check_collisions: function(){ //Cambia lo visual en cuando hay colision entre la barra y la bola

			for (var i = this.board.bars.length - 1; i >= 0; i--) {
				var bar = this.board.bars[i];
				if(hit(bar, this.board.ball)){

					this.board.ball.collision(bar);
				}
			};
		},
		play: function(){ //pone bola en movimiento
			if(this.board.playing){
				this.clean();
				this.draw();
				this.check_collisions();
				this.board.ball.move();	
			}
			
		}
	}

	function hit(a,b){
		//Revisa si a colisiona con la B
		var hit = false;
		//Colsiones horizontales
		if(b.x + b.width >= a.x && b.x < a.x + a.width)
		{
			//Colisiones verticales
			if(b.y + b.height >= a.y && b.y < a.y + a.height)
				hit = true;
		}
		//Colisión de A con B
		if(b.x <= a.x && b.x + b.width >= a.x + a.width)
		{
			if(b.y <= a.y && b.y + b.height >= a.y + a.height)
				hit = true;
		}
		//Colisión b con a
		if(a.x <= b.x && a.x + a.width >= b.x + b.width)
		{
			if(a.y <= b.y && a.y + a.height >= b.y + b.height)
				hit = true;
		}
		
		return hit;
	}

    //dibuja cada elemento (segun sea el caso)
	function draw(ctx,element){
		
		switch(element.kind){
			case "rectangle":

				ctx.fillRect(element.x,element.y,element.width,element.height);
				break;
			case "circle": 
				ctx.beginPath();
				ctx.arc(element.x,element.y,element.radius,0,7);
				ctx.fill();
				ctx.closePath();
				break;
		}	
		
		
	}
})();