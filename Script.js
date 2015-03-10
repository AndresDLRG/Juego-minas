window.onload = function( ) {
	//Constantes
	var WIDTH=960, HEIGHT=580;
	var COLS=30, FILAS=16, TAMANO=32, BOMBAS=99;
	var CUBIERTO=0, DESCUBIERTO=1, MARCADO=2;
	//Variables
	var canvas, ctx;
	var mouseX, mouseY
	var posX, posY;
	var time = false, tiempo=0, timer;
	var restantes=BOMBAS;
	var best = localStorage.getItem("adlrg_minas_best");
	if (best === null) {
		best = "ninguno";
	}
	//Objetos
	function Cuadro(x, y, tamano, valor, estado) {
		this.x = x;
		this.y = y;
		this.tamano = tamano;
		this.valor = valor; //10 = bomba
		this.estado = estado
	};
		
	var escena = [ ];
	for (var x=0; x < FILAS; x++) {
		escena[x] = [ ];
		for(var y=0; y < COLS; y++) {
			escena[x][y] = new Cuadro(y*TAMANO, x*TAMANO, TAMANO,0, CUBIERTO);
		}
	}
	//Objetos JSON
	var escenario = {
		cuadro: escena,
		
		init: function( ) {
			var x, y, w, z;
			for (x=0; x < FILAS; x++) {
				for(y=0; y < COLS; y++) {
					this.cuadro[x][y] = new Cuadro(y*TAMANO, x*TAMANO, TAMANO, 0, CUBIERTO);
				}
			}
			w = 0;
			while(w < BOMBAS) {
				x = Math.floor(Math.random() * FILAS);
				y = Math.floor(Math.random() * COLS);
				if( this.cuadro[x][y].valor ===0) {
					this.cuadro[x][y].valor = 10;
					w++;
				}
			}
			
			for (x=0; x < FILAS; x++) {
				for(y=0; y < COLS; y++) {
					if(this.cuadro[x][y].valor === 10) {
						for (w=-1; w < 2; w++) {
							for (z=-1; z < 2; z++) {
								if (y+z >= 0 && y+z < COLS &&  x+w >= 0 && x+w < FILAS &&  this.cuadro[x+w][y+z].valor !== 10)
									this.cuadro[x+w][y+z].valor += 1;
							}
						}
					}
				}
			}
			
		},
		draw: function( ) {
			for (var x=0; x < FILAS; x++) {
				for(var y=0; y < COLS; y++) {
					switch(this.cuadro[x][y].estado){
						case CUBIERTO:
								ctx.fillStyle = "blue";
								ctx.fillRect(this.cuadro[x][y].x, this.cuadro[x][y].y, TAMANO, TAMANO);
								ctx.strokeStye = "black";
								ctx.strokeRect(this.cuadro[x][y].x, this.cuadro[x][y].y, TAMANO, TAMANO);
								break;
						case DESCUBIERTO:
								ctx.fillStyle = "white";
								ctx.fillRect(this.cuadro[x][y].x, this.cuadro[x][y].y, TAMANO, TAMANO);
								ctx.strokeStye = "black";
								ctx.strokeRect(this.cuadro[x][y].x, this.cuadro[x][y].y, TAMANO, TAMANO);
								if(this.cuadro[x][y].valor !== 0) {
									switch(this.cuadro[x][y].valor) {
										case 1:
												ctx.fillStyle = "#026075";
												break;
										case 2:
												ctx.fillStyle = "#0E652C";
												break;
										case 3:
												ctx.fillStyle = "#C11111";
												break;
										case 4:
												ctx.fillStyle = "#0F0A9A";
												break;
										case 5:
												ctx.fillStyle = "#737617";
												break;
										case 6:
												ctx.fillStyle = "#475352";
												break;
										case 7:
												ctx.fillStyle = "#520D52";
												break;
										case 8:
												ctx.fillStyle = "#491D1D";
												break;
									}									
									ctx.fillText(this.cuadro[x][y].valor , this.cuadro[x][y].x + 9, this.cuadro[x][y].y + 24);	
								}
								break;
						case MARCADO:
								ctx.fillStyle = "red";
								ctx.fillRect(this.cuadro[x][y].x, this.cuadro[x][y].y, TAMANO, TAMANO);
								ctx.strokeStye = "black";
								ctx.strokeRect(this.cuadro[x][y].x, this.cuadro[x][y].y, TAMANO, TAMANO);
								break;
					}
				}
			}
		}
	}
	
	function main( ) {
		canvas = document.createElement("canvas");
		canvas.width = WIDTH;
		canvas.height = HEIGHT;
		ctx = canvas.getContext("2d");
		document.body.appendChild(canvas);
		ctx.font = "24px helvetica";
	
		canvas.addEventListener("click", clic = function(event) {
			if(!time) {
				time = true;
				timer = setInterval(tempo, 1000);
			}
			mouseX = event.x - canvas.offsetLeft;
			mouseY = event.y - canvas.offsetTop
			posX = Math.floor(mouseY / TAMANO);
			posY = Math.floor(mouseX / TAMANO);
			if ( escenario.cuadro[posX][posY].estado === MARCADO) {
			
			}
			else if(escenario.cuadro[posX][posY].valor !== 10 ) {
				escenario.cuadro[posX][posY].estado = DESCUBIERTO;
				if(escenario.cuadro[posX][posY].valor === 0 ) {
					despejar(escenario, posX, posY);
				}
				escenario.draw();
			}
			else {
				canvas.removeEventListener("click", clic, false);
				canvas.removeEventListener("contextmenu", clic2, false);
				clearInterval(timer);
				alert("Perdiste :(\nMejor puntuacion: " + best);
			}
			compGanar();
		});
		canvas.addEventListener("contextmenu",clic2 = function(event) {
			event.preventDefault();
			mouseX = event.x - canvas.offsetLeft;
			mouseY = event.y - canvas.offsetTop
			posX = Math.floor(mouseY / TAMANO);
			posY = Math.floor(mouseX / TAMANO);
			if(escenario.cuadro[posX][posY].estado === CUBIERTO) {
				escenario.cuadro[posX][posY].estado = MARCADO;
				restantes--;
			}
			else if(escenario.cuadro[posX][posY].estado === MARCADO) {
				escenario.cuadro[posX][posY].estado = CUBIERTO;
				restantes++;
			}
			escenario.draw();
			
			ctx.fillStyle = "white";
			ctx.fillRect(COLS*TAMANO/2, TAMANO*FILAS + 2, COLS*TAMANO/2, HEIGHT - TAMANO*FILAS);
			ctx.fillStyle = "red";
			ctx.fillText("Banderas: " + restantes, COLS*TAMANO*0.7, FILAS*TAMANO + 50 );
		});
		
		init( );
	}
	function init( ) {
		escenario.init();
		escenario.draw();
		ctx.fillStyle = "black";
		ctx.fillText("Tiempo: 0", 100, FILAS * TAMANO + 50);
		ctx.fillStyle = "red";
		ctx.fillText("Banderas: " + restantes, COLS*TAMANO*0.7, FILAS*TAMANO + 50 );
	}
	
	function despejar(celda, x, y) {
	var w, z;
		if (celda.cuadro[x][y].estado = MARCADO) {
			
		}
		celda.cuadro[x][y].estado = DESCUBIERTO;
		for (w=-1; w < 2; w++) {
			for (z=-1; z < 2; z++) {
				if (y+z >= 0 && y+z < COLS &&  x+w >= 0 && x+w < FILAS) {
					if (celda.cuadro[x+w][y+z].valor === 0 && celda.cuadro[x+w][y+z].estado === CUBIERTO) {
						despejar(celda, x+w, y+z);
					}
					else {
						if (celda.cuadro[x+w][y+z].estado === MARCADO) {
							restantes++;
							ctx.fillStyle = "white";
							ctx.fillRect(COLS*TAMANO*0.7, TAMANO*FILAS + 2, WIDTH - COLS*TAMANO*0.7, HEIGHT - TAMANO*FILAS);
							ctx.fillStyle = "red";
							ctx.fillText("Banderas: " + restantes, COLS*TAMANO*0.7, FILAS*TAMANO + 50 );
						}
						celda.cuadro[x+w][y+z].estado = DESCUBIERTO;
					}
				}
			}
		}
	}

	function tempo( ) {
		tiempo++;
		ctx.fillStyle = "white";
		ctx.fillRect(0, TAMANO*FILAS + 2, TAMANO*COLS/2, HEIGHT - TAMANO*FILAS);
		ctx.fillStyle = "black";
		ctx.fillText("Tiempo: " + tiempo, 100, FILAS * TAMANO + 50);
	}
	
	function compGanar() {
		var ganar = false;
		for ( x=0; x < FILAS; x++) {
			for ( y=0; y < COLS; y++) {
				if (escenario.cuadro[x][y].estado !== DESCUBIERTO && escenario.cuadro[x][y].valor !== 10) {
					return;
				} 
			}
		}
		clearInterval(timer);
		canvas.removeEventListener("click", clic, false);
		canvas.removeEventListener("contextmenu", clic2, false);
		if (best > tiempo || best === null || best === "null" || best ==="ninguno") {
			localStorage.setItem("adlrg_minas_best", tiempo);
			best = tiempo;
		}
		alert("Felicidades ganaste!!! \nTiempo total: " + tiempo + "\nMejor puntuacion: " + best);
	}
	
	main();
}