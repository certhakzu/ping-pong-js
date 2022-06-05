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


//Para la Ball
(function(){

    //Clase Ball
	self.Ball = function(x,y,radius,board){
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.speed_y = 0;
		this.speed_x = 3;
		this.board = board;
		this.direction = -1;
		this.bounce_angle = 0;
		this.max_bounce_angle = Math.PI / 12;
		this.speed = 3;

		board.ball = this;
		this.kind = "circle";	
	}
    //Modificacion del prototipo de Ball
	self.Ball.prototype = {
		move: function(){   //mover la bola
			this.x += (this.speed_x * this.direction);
			this.y += (this.speed_y);
		},
		get width(){ //capturar width
			return this.radius * 2;
		},
		get height(){ //capturar height
			return this.radius * 2;
		},
		collision: function(bar){ //método para gestionar las calisiones de la bola (incompleto porque aun falta manejar los pordes)
			var relative_intersect_y = ( bar.y + (bar.height / 2) ) - this.y;
			var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

			this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;
			this.speed_y = this.speed * -Math.sin(this.bounce_angle);
			this.speed_x = this.speed * Math.cos(this.bounce_angle);

			if(this.x > (this.board.width / 2)) this.direction = -1;
			else this.direction = 1;
		}
	}
})();


//Para las Bar's
(function(){

    //Clase Bar
	self.Bar = function(x,y,width,height,board){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.board = board;
		this.board.bars.push(this);
		this.kind = "rectangle";
		this.speed = 5;
	}

    //Modificacion del prototipo de Bar para que haga referencia a si mismo
	self.Bar.prototype = {
		down: function(){ //Baja la barra
			this.y += this.speed;
		},
		up: function(){ //sube la barra
			this.y -= this.speed;
		},
		toString: function(){
			return "x: "+ this.x +" y: "+ this.y ;
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


var board = new Board(800,400);
var bar = new Bar(0,60,20,150,board);
var bar_2 = new Bar(780,200,20,150,board);
var canvas = document.getElementById('canvas');
var board_view = new BoardView(canvas,board);
var ball = new Ball(350, 100, 10,board);


//Gestionador del evento de las 'flechas' del teclado para controlar las barras
document.addEventListener("keydown",function(ev){
	
    //Todos estos metodos estan obsoletos, hay que migrar a ES6
	if(ev.keyCode == 38){
		ev.preventDefault();
		bar.up();
	}
	else if(ev.keyCode == 40){
		ev.preventDefault();
		bar.down();
	}else if(ev.keyCode === 87){
		ev.preventDefault();
		//W
		bar_2.up();
	}else if(ev.keyCode === 83){
		ev.preventDefault();
		//S
		bar_2.down();
	}else if(ev.keyCode === 32){
		ev.preventDefault();
		board.playing = !board.playing;
	}
});


board_view.draw(); 


window.requestAnimationFrame(controller);

function controller(){
	board_view.play();
	requestAnimationFrame(controller);
}