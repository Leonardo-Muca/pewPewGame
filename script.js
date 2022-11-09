/*const $app = document.getElementById('app');

class Gato{
    constructor(){
        this.color='Cafe';
        window.addEventListener('keydown', e=>{
            setTimeout(()=>{
                $app.innerHTML +=  `<h5>${this.color}</h5>`;
            },1);
            
        });
    }
}

const gato =  new Gato();*/

//Se crea el evento que escucha la ventana
window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext("2d")
    canvas.width = 500;
    canvas.height = 500;

    //CLASE IMPORTANTE
    //Nos ayuda a escuchar los eventos que ocurren atravez de las teclas
    //dentro de nuestro teclado, lo que ocaciona una ejecucion de eventos
    class InputHandler {
        constructor(game) {
            this.game = game;
            window.addEventListener('keydown', e => {
                if (((e.key === 'ArrowUp') ||
                    (e.key === 'ArrowDown')
                ) && this.game.keys.indexOf(e.key) === -1) {
                    this.game.keys.push(e.key);
                } else if (e.key === ' ') {
                    this.game.player.shootTop()
                }
            });

            window.addEventListener("keyup", e => {
                if (this.game.keys.indexOf(e.key) > -1) {
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1)
                }
            })
        }
    }

    //CLASE IMPORTANTE
    //Clase la cual nos ayuda a pintar el proyectil
    //dependiendo de las cordenadas en donde se encuentre nuestro player
    class Projectile {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 3;
            this.speed = 3;
            this.markedForDeletion = false

        }

        update() {
            this.x += this.speed;
            if (this.x > this.game.width * 0.8) {
                this.markedForDeletion = true
            }
        }
        draw(context) {
            context.fillStyle = 'white'; //Sexto cambio
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    //CLASE IMPORTANTE
    //Clase que nos ayuda a pintar el jugador en la pantalla
    //la cual tiene dunciones que nos ayudan a moverlo y ejecutar acciones
    class Player {
        constructor(game) {
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 20;
            this.y = 100;
            this.speedY = 0;
            this.maxSpeed = 1.5; //Septimo cambio
            this.projectiles = [];
        }

        update() {
            if (this.game.keys.includes('ArrowUp')) {
                this.speedY = -this.maxSpeed;
            } else if (this.game.keys.includes('ArrowDown')) {
                this.speedY = this.maxSpeed;
            } else {
                this.speedY = 0;
            }

            this.y += this.speedY;

            this.projectiles.forEach(projectile => {
                projectile.update();
            });

            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);

        }

        draw(context) {
            this.black = this.black ? false : true
            context.fillStyle = '#9A7C01'; //Quinto cambio
            context.fillRect(this.x, this.y, this.width, this.height);
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            });
        }



        shootTop() {
            if (this.game.ammo > 0) {
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30));
                this.game.ammo--;
            }
        }
    }

    //CLASE
    //Clase que nos ayuda a pintar a los enemigos en el area del juego
    //de esta manera los podremos pintar y se les da velocidad y el tamaño deceado
    class Enemy {
        constructor(game) {
            this.game = game;
            this.x = this.game.width;
            this.speedX = Math.random() * -1.5 - 0.5;
            this.markedForDeletion = false;
            this.lives = 5;
            this.score = this.lives;
        }

        update() {
            this.x += this.speedX;
            if (this.x + this.width < 0) {
                this.markedForDeletion = true;
            }
        }

        draw(context) {
            context.fillStyle = '#03FFCD'; //Octavo cambio
            context.fillRect(this.x, this.y, this.width, this.height);
            context.fillStyle = 'red'; //Noveno cambio
            context.font = '20px Helvetica';
            context.fillText(this.lives, this.x, this.y);
        }
    }

    //CLASE
    //Clase la cual extiende de enemy para que de esta manera los enemigos
    //pundan salir de forma dinamica y en ditintas posiciones
    class Angler1 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 228 * 0.2;
            this.height = 169 * 0.04; //Decimo cambio
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
        }
    }

    //CLASE
    //Clase la cual nos ayuda a poderle dar movimiento a cada una de las 
    //imagenes que tenemos de background
    class Layer {
        constructor(game, image, speedModifier) {
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier;
            this.width = 1768;
            this.height = 500;
            this.x = 0;
            this.y = 0;
        }

        update() {
            if (this.x <= -this.width) this.x = 0;
            else this.x -= this.game.speed * this.speedModifier;
        };

        draw(context) {
            context.drawImage(this.image, this.x, this.y);
        }
    }

    //CLASE
    //Clase la cual nos ayuda a poder pintar las distintas imagenes que tenemos
    //y que se mostraran de fondo en nuestro videojuego
    class Background {
        constructor(game) {
            this.game = game;
            this.image1 = document.getElementById('layer1');
            this.image2 = document.getElementById('layer2');
            this.image3 = document.getElementById('layer3');
            this.image4 = document.getElementById('layer4');
            this.layer1 = new Layer(this.game, this.image1, 0.5);
            this.layer2 = new Layer(this.game, this.image2, 0.7);
            this.layer3 = new Layer(this.game, this.image3, 3);
            this.layer4 = new Layer(this.game, this.image4, 1);

            this.layers = [this.layer1, this.layer2, this.layer3, this.layer4];
        }

        update() {
            this.layers.forEach(layer => {
                layer.update();
            });
        }

        draw(context) {
            this.layers.forEach(layer => {
                layer.draw(context);
            });
        }
    }

    //CLASE DE ESTILOS
    //Clase la cual nos ayuda a poder pintar de manera concreta y con estilos
    //nuestro juego, para asi darle dinamismo y que sea de esta manera atractivo
    class UI {
        constructor(game) {
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Helvetica';
            this.color = 'white';
        }

        draw(context) {
            context.save();
            context.fillStyle = this.color;
            context.font = this.fontSize + 'px' + this.fontFamily;
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = 'black';
            context.fillText('Score: ' + this.game.score, 20, 40);
            for (let i = 0; i < this.game.ammo; i++) {
                context.fillRect(20 + 5 * i, 50, 3, 20);
            }
            const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
            context.fillText('Time: ' + formattedTime, 20, 100);
            if (this.game.gameOver) {
                context.textAlign = 'center';
                let message1;
                let message2;
                if (this.game.score > this.game.winningScore) {
                    message1 = 'You win!';
                    message2 = "Well done";
                } else {
                    message1 = 'You lose';
                    message2 = 'Try again!';
                };
                context.font = '50px ' + this.fontFamily;
                context.fillText(message1,
                    this.game.width * 0.5,
                    this.game.height * 0.5 - 20);
                context.font = '25px ' + this.fontFamily;
                context.fillText(message2,
                    this.game.width * 0.5,
                    this.game.height * 0.5 + 20);
            }
            context.restore();
        }
    }

    //CLASE PRIORITARIA
    //Esta clase es la mas importante de nuestro juego ya que nos ayuda a poder pintar
    //el juego de manera en la cual nos respete todas las clase con las reglas
    //puestas en cada una de ellas
    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.background = new Background(this);
            this.keys = [];
            this.ammo = 12; //Cuarto cambio
            this.ammoTimer = 0;
            this.ammoInterval = 500;
            this.maxAmmo = 25; //Primer cambio
            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.gameOver = false;
            this.score = 0;
            this.winningScore = 20; //Segundo cambio
            this.gameTime = 0;
            this.timeLimit = 25000; //Tercer cambio
            this.speed = 1;
        }

        update(deltaTime) {
            if (!this.gameOver) this.gameTime += deltaTime;
            if (this.gameTime > this.timeLimit) this.gameOver = true;
            this.background.update();
            this.player.update(deltaTime);
            if (this.ammoTimer > this.ammoInterval) {
                if (this.ammo < this.maxAmmo) {
                    this.ammo++;
                    this.ammoTimer = 0;
                }
            } else {
                this.ammoTimer += deltaTime;
            }

            this.enemies.forEach(enemy => {
                enemy.update();
                if (this.checkCollison(this.player, enemy)) {
                    enemy.markedForDeletion = true;
                }; this.player.projectiles.forEach(projectile => {
                    if (this.checkCollison(projectile, enemy)) {
                        enemy.lives--;
                        projectile.markedForDeletion = true;
                        if (enemy.lives < 0) {
                            enemy.markedForDeletion = true;
                            if (!this.gameOver) {
                                this.score += enemy.score;
                            }
                            if (this.score > this.winningScore) this.gameOver = true;
                        }
                    }
                })
            })

            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);

            if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
        }

        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
            this.ui.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
        }

        addEnemy() {
            this.enemies.push(new Angler1(this));
        }

        checkCollison(rect1, rect2) {
            return (rect1.x < rect2.x + rect2.width
                && rect1.x + rect2.width > rect2.x
                && rect1.y < rect2.y + rect2.height
                && rect1.height + rect1.y > rect2.y
            );
        }
    }

    //Esta parte del codigo nos ayuda a poder tiempos los cuales nos ayudan
    //al control del juego, de esta manera podemos controlar la salida y la entrada
    //de tiempos dentro de la partida del jugador
    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }

    animate(0);
});
