const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const dt = 0.01; // step size
const g = 9.81 * 20;

function startGame() {
    var container = document.createElement('div');
    container.setAttribute('id', 'container');
    document.body.appendChild(container);

    domain.setup(container);

    document.body.addEventListener('keydown', (e) => domain.registerKeyDown(e, agent));
    document.body.addEventListener('keyup', (e) => domain.registerKeyUp(e, agent));

    var evolutionText = document.createElement('h1');
    document.body.appendChild(evolutionText);

    var agentText = document.createElement('h2');
    document.body.appendChild(agentText);

    // var velocityText = document.createElement('p');
    // document.body.appendChild(velocityText);

    const N = 50;
    var evolution = new Population(N);
    const TRAINING_TIME = 15;

    // Here for when game is setup
    var id = setInterval(function() {
        var displayIndex = 0;
        domain.resetCanvas();

        evolutionText.textContent = "Generation: " + evolution.generation;

        for (let i = 0; i < N; i++) {
            if (!evolution.agents[i].drone.isAlive) continue;

            evolution.agents[i].update();

            if (evolution.agents[i].detectCollision(evolution.generation) || evolution.agents[i].timeAlive > TRAINING_TIME) {
                // console.log('Drone ', i, ' died :(');
                evolution.agents[i].clearTargetInterval();
                evolution.agents[i].drone.isAlive = false;
            }
        }
        displayIndex = evolution.bestCurrentAgent();

        agentText.textContent = "Agent: " + (displayIndex + 1);
        // velocityText.textContent =
        //     "U: " + Math.round(evolution.agents[displayIndex].drone.U*100)/100 +
        //     ", W: " + Math.round(evolution.agents[displayIndex].drone.W*100)/100 +
        //     ", pitch: " + Math.round(evolution.agents[displayIndex].drone.theta*180/Math.PI) +
        //     ", y: " + Math.round(evolution.agents[displayIndex].drone.y*100)/100;

        if (evolution.isFinished()) {
            console.log('Everyone is dead :(');
            evolution.resetAll();
        }

        // Render background first to push it to back
        domain.renderBackground(evolution.agents[displayIndex].drone);
        evolution.agents[displayIndex].render(domain.context);
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
            X[i] -= (drone.x - CANVAS_WIDTH / 2) * 2;
            Y[i] -= (drone.y - CANVAS_HEIGHT / 2) * 2;
        }

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.context.drawImage(this.background_image, X[i], Y[j], CANVAS_WIDTH, CANVAS_HEIGHT);
            }
        }
    },
    registerKeyDown: function(e, agent) {
        const drone = agent.drone;
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
    registerKeyUp: function(e, agent) {
        const drone = agent.drone;
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
