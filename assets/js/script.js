function start() { // Inicio da função start()

    let key = {};

    let game = {};

    const TECLA = {
        UP: 38,
        DOWN: 40,
        Z: 90,
    };

    const SPEED = {
        AEREO: 7,
        LAND: 5,
        ALLIED: 3,
    };

    let top;
    
    let positionX;
    let shootingTime;
    let shoot = true;
    let shootAereo;
    let scored = 0;
    let rescued = 0;
    let failed = 0;
    let energy = 3
    let gameOver = false;

    let positionY = parseInt(Math.random() * 334);
    
	$("#inicio").hide();
	
	$("#fundoGame").append("<div class='animation-helicopter' id='apache-player'></div>");
	$("#fundoGame").append("<div class='animation-enemy-aereo' id='enemy-aereo'></div>");
	$("#fundoGame").append("<div id='land-enemy'></div>");
	$("#fundoGame").append("<div class='animation-allied' id='allied'></div>");
    $("#fundoGame").append("<div id='scoreboard'></div>");
    $("#fundoGame").append("<div id='energy'></div>");

    let shootingSound = document.getElementById("shootingSound"); //Som de Disparo
    let explosionSound = document.getElementById("explosionSound"); //Som de Explosão
    let gameSound = document.getElementById("gameSound"); //Música de Fundo
    let endGameSound = document.getElementById("endGameSound"); //Som do Fim do Jogo
    let failedSound = document.getElementById("failedSound"); //Som de Falha Resgate
    let rescuedSound = document.getElementById("rescuedSound"); //Som do Sucesso Resgate

    gameSound.addEventListener("ended", function(){ 
        gameSound.currentTime = 0; 
        gameSound.play(); 
    }, false);
    gameSound.play();

    key.pressed = [];

    $(document).keydown(function(e){
        key.pressed[e.which] = true;
    });
    
    
    $(document).keyup(function(e){
        key.pressed[e.which] = false;
    });

	//Game Loop

	game.timer = setInterval(loop,30);

    function loop() {
        movesBackground();
        movesApachePlayer();
        movesEnemyAereo();
        movesLandEnemy();
        movesAllied();
        collision();
        scoreboard();
        vitality();
    } //Fim da função loop
	
    //Função que movimenta o fundo do jogo
	
	function movesBackground() {
	
        let left = parseInt($("#fundoGame").css("background-position"));

        $("#fundoGame").css("background-position", left - 3);
    } // fim da função movesBackground()

    function movesApachePlayer() {
	
        if (key.pressed[TECLA.UP]) {

            top = parseInt($("#apache-player").css("top"));

            $("#apache-player").css("top", top - 10);

            if (top <= 9) {
                $("#apache-player").css("top", top + 10);
            }
        }
            
        if (key.pressed[TECLA.DOWN]) {
                
            var top = parseInt($("#apache-player").css("top"));

            $("#apache-player").css("top", top + 10);	

            if (top >= 429) {
                $("#apache-player").css("top", top - 10);
            }
        }
            
        if (key.pressed[TECLA.Z]) {
             //Chama função shooting
            shooting();
        }
        
    } // fim da função movesApachePlayer()

    function movesEnemyAereo() {

        positionX = parseInt($("#enemy-aereo").css("left"));

        $("#enemy-aereo").css("left", positionX - SPEED.AEREO);
        $("#enemy-aereo").css("top", positionY);
            
        if (positionX <= 0) {
            $("#enemy-aereo").css("left", 694);
            $("#enemy-aereo").css("top", positionY);
        }

    } //Fim da função moveinimigo1()
    
    function movesLandEnemy() {

        positionX = parseInt($("#land-enemy").css("left"));

        $("#land-enemy").css("left", positionX - SPEED.LAND);
            
        if (positionX <= 0) {
            $("#land-enemy").css("left", 775);
        }

    } //Fim da função movesLandEnemy()

    function movesAllied() {

        positionX = parseInt($("#allied").css("left"));

        $("#allied").css("left", positionX + SPEED.ALLIED);
            
        if (positionX >= 906) {
            $("#allied").css("left", 0);
        }

    } //Fim da função movesAllied()

    function shooting() {
	
        if (shoot == true) {
            
            shootingSound.play();
            shoot = false;
            top = parseInt($("#apache-player").css("top"))
            positionX= parseInt($("#apache-player").css("left"))
            shootingX = positionX + 185;
            topoShooting = top + 50;

            $("#fundoGame").append("<div id='shooting'></div");
            $("#shooting").css("top", topoShooting);
            $("#shooting").css("left", shootingX);
            
            shootingTime = window.setInterval(runShooting, 30);
        } //Fecha podeAtirar
     
        function runShooting() {

            positionX = parseInt($("#shooting").css("left"));
            $("#shooting").css("left", positionX + 15); 
    
            if (positionX > 900) {
                window.clearInterval(shootingTime);

                shootingTime = null;
                shoot = true;

                $("#shooting").remove();
                
                        
            }
        } // Fecha runShooting()

    } // Fecha shooting()

    function collision() {
        
        let divId;
        
        let collisionAereo = ($("#apache-player").collision($("#enemy-aereo")));
        let collisionShootAereo = ($("#shooting").collision($("#enemy-aereo")));
        let collisionShootLand = ($("#shooting").collision($("#land-enemy")));
        let collisionLand = ($("#apache-player").collision($("#land-enemy")));
        let collisionPlayerAllied = ($("#apache-player").collision($("#allied")));
        let collisionEnemyAllied = ($("#land-enemy").collision($("#allied")));

        // Helicóptero Apache com o Helicóptero Inimigo
    
        if (collisionAereo.length > 0) { // Colisão aerea

            divId = $("#enemy-aereo") // Identifica com quem houve a colisão

            collided(divId.selector); // Trata a colisão
            $("#apache-player").remove();
            repositionPlayer();
	    }

        if (collisionShootAereo.length > 0) {

            shootAereo = true;
            divId = $("#shooting")

            collided(divId.selector);
            $("#enemy-aereo").remove();
	    }

        if (collisionShootLand.length > 0) {

            shootAereo = false;
            divId = $("#shooting")

            collided(divId.selector);
            $("#land-enemy").remove();
	    }

        if (collisionLand.length > 0) {

            divId = $("#land-enemy")

            collided(divId.selector);
            $("#apache-player").remove();
            repositionPlayer();
	    }

        if (collisionPlayerAllied.length > 0) {

            divId = $("#allied");

            rescuedSound.play();
            $("#allied").remove();
            repositionAllied();
            rescued++;
	    }

        if (collisionEnemyAllied.length > 0) {

            divId = $("#allied")

            collided(divId.selector);

            failed++
	    }

        function collided(divId) {

            let collidedPosition = {
                X: 0,
                Y:0,
            };

            collidedPosition.X = parseInt($(divId).css("left"));
	        collidedPosition.Y = parseInt($(divId).css("top"));

            if(divId == "#allied"){
                dead(collidedPosition.X, collidedPosition.Y);

            } else {
                explosion(collidedPosition.X, collidedPosition.Y);
            }

            if(divId == "#shooting") {
                
                $(divId).css("left", 901);

                if(shootAereo){
                    repositionEnemyAereo();

                    scored = scored + 100;
                } else {
                    repositionLandEnemy();

                    scored = scored + 50;
                }
            } else if(divId == "#enemy-aereo"){
                $(divId).remove();
                repositionEnemyAereo();
                energy--;
            } else if(divId == "#land-enemy"){
                $(divId).remove();
                repositionLandEnemy();
                energy--;
            } else if(divId == "#allied"){
                $(divId).remove();
                repositionAllied();
                energy--;
            }
        }  
    }//Fim da função collision()

        //Explosão 1
        function explosion(positionX,positionY) {

            let timeExplosion = window.setInterval(removeExplosao, 1000);

            explosionSound.play();
	        $("#fundoGame").append("<div id='explosion'></div");
	        $("#explosion").css("background-image", "url(assets/imgs/explosao.png)");

            divId = $("#explosion");
	        divId.css("top", positionY);
	        divId.css("left", positionX);
	        divId.animate({width:200, opacity:0}, "slow");
	
		    function removeExplosao() {

			    divId.remove();
			    window.clearInterval(timeExplosion);
			    timeExplosion = null;
			
		    }
		
	    } // Fim da função explosao1()

        function dead(positionX,positionY) {

            failedSound.play();
	        $("#fundoGame").append("<div id='dead'></div");
	        $("#dead").css("background-image", "url(assets/imgs/amigo_morte.png)");

            divId = $("#dead");
	        divId.css("top", positionY);
	        divId.css("left", positionX);
	        divId.animate({width:200, opacity:0}, "slow");

            let timeExplosion = window.setInterval(removeDead, 1000);
            
		    function removeDead() {

			    divId.remove();
			    window.clearInterval(timeExplosion);
			    timeExplosion = null;
			
		    }
		
	    } // Fim da função dead()

    function repositionPlayer() {
	
        let timeCollision = window.setInterval(relocatePlayer, 500);

        function relocatePlayer() {

        window.clearInterval(timeCollision);
        timeCollision = null;
                
            if (gameOver == false) {
                $("#fundoGame").append("<div class='animation-helicopter' id=apache-player></div");
                $("#apache-player").css("left", 8);
                $("#apache-player").css("top", 179);
            }
        }	
    }

    //Reposiciona Inimigo2
	
	function repositionEnemyAereo() {
	
        let timeCollision = window.setInterval(relocateEnemyAereo, 1000);
            
        function relocateEnemyAereo() {

        window.clearInterval(timeCollision);
        timeCollision = null;
                
            if (gameOver == false) {
                positionY = parseInt(Math.random() * 334);
        
                $("#fundoGame").append("<div class='animation-enemy-aereo' id='enemy-aereo'></div");
                $("#enemy-aereo").css("left", 689);
                $("#enemy-aereo").css("top", positionY);
                
            }
        }	
    }
    
    function repositionLandEnemy() {
	
        let timeCollision = window.setInterval(relocateLandEnemy, 5000);
            
        function relocateLandEnemy() {

        window.clearInterval(timeCollision);
        timeCollision = null;
                
            if (gameOver == false) {
                $("#fundoGame").append("<div id='land-enemy'></div");
            }
        }	
    }
    
    function repositionAllied() {
	
        let timeCollision = window.setInterval(relocateAllied, 2000);
            
        function relocateAllied() {

        window.clearInterval(timeCollision);
        timeCollision = null;
                
            if (gameOver == false) {
                $("#fundoGame").append("<div class='animation-allied' id='allied'></div");
            }
        }	
    }

    function scoreboard() {
        $("#scoreboard").html("<h2> Pontos: " + scored + " Aliados Salvos: " + rescued + " Aliados Mortos: " + failed + "</h2>");
    }

    function vitality() {
	
		if (energy == 3) {
			
			$("#energy").css("background-image", "url(assets/imgs/energia3.png)");
		}
	
		if (energy == 2) {
			
			$("#energy").css("background-image", "url(assets/imgs/energia2.png)");
		}
	
		if (energy == 1) {
			
			$("#energy").css("background-image", "url(assets/imgs/energia1.png)");
		}
	
		if (energy == 0) {
			
			$("#energy").css("background-image", "url(assets/imgs/energia0.png)");
			
			endGame();
		}
	} // Fim da função energia()

    //Função GAME OVER
	function endGame() {
        gameOver = true;
        gameSound.pause();
        endGameSound.play();
        
        window.clearInterval(game.timer);
        game.timer=null;
        
        $("#apache-player").remove();
        $("#enemy-aereo").remove();
        $("#land-enemy").remove();
        $("#allied").remove();
        
        $("#fundoGame").append("<div id='end' onClick=restart()></div>");
        
        //$("#end").html("<h1> Game Over </h1><p>Sua pontuação foi: " + scored + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
        $("#end").html(`<h1> Game Over </h1>
                        <p>Sua pontuação foi: ${scored} </p>
                        <!-- div id="reboot" onClick=restart() -->
                        <h3>Jogar Novamente</h3></!-->`
                       );
        } // Fim da função gameOver();
} // Fim da função start

function restart() {
	endGameSound.pause();
	$("#end").remove();
	start();
	
} //Fim da função reiniciaJogo
