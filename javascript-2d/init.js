const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const dt = 0.01; // step size
const g = 9.81 * 20; // stronger gravity for nicer feel

function startGame() {
    var container = document.createElement('div');
    container.setAttribute('id', 'container');
    document.body.appendChild(container);

    domain.setup(container);

    document.body.addEventListener('keydown', (e) => domain.registerKeyDown(e, drone));
    document.body.addEventListener('keyup', (e) => domain.registerKeyUp(e, drone));

    var drone = new Drone();
    drone.render(domain.context);
    
    // Here for when game is setup
    setInterval(function() {
        domain.resetCanvas();
        
        drone.updatePosition();

        if (drone.detectCollision()) {
            alert("Drone died :(");
            drone.reset();
        }

        // Render background first to push it to back
        domain.renderBackground(drone);
        drone.render(domain.context);
    }, dt * 1000);
}
  
var domain = {
    canvas: document.createElement("canvas"),
    background_image: new Image(),
    setup: function(parent) {
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this.context = this.canvas.getContext("2d");
        parent.appendChild(this.canvas);

        this.background_image.src = "background_1.png";
    },
    renderBackground(drone) {
        // Currently doesn't scale with grid size - need to fix this
        const X = [-CANVAS_WIDTH, 0, CANVAS_WIDTH];
        const Y = [-CANVAS_HEIGHT, 0, CANVAS_HEIGHT];

        // Adding drone position
        for (let i = 0; i < 3; i++) {
            X[i] += (drone.x - CANVAS_WIDTH / 2) * 2;
            Y[i] -= (drone.y - CANVAS_HEIGHT / 2) * 2;
        }

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.context.drawImage(this.background_image, X[i], Y[j], CANVAS_WIDTH, CANVAS_HEIGHT);
            }
        }
    },
    registerKeyDown: function(e, drone) {
        switch(e.code) {
            case 'ArrowRight':
                drone.throttleRight();
                break;
            case 'ArrowLeft':
                drone.throttleLeft();
                break;
            case 'ArrowUp':
                drone.throttleMax();
                break;
            case 'ArrowDown':
                drone.throttleMin();
                break;
            default:
                console.log('None arrow key pressed!');
                break;
        }
    },
    registerKeyUp: function(e, drone) {
        switch(e.code) {
            case 'ArrowRight':
                drone.throttleHover();
                break;
            case 'ArrowLeft':
                drone.throttleHover();
                break;
            case 'ArrowUp':
                drone.throttleHover();
                break;
            case 'ArrowDown':
                drone.throttleHover();
                break;
            default:
                console.log('None arrow key up!');
                break;
        }
    },
    resetCanvas: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
