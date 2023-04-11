const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const dt = 0.01; // step size
const g = 9.81 * 20;

// TODO: add notification which appears on screen when user launches so that sound can be played

function startGame() {
    Assets.setup();

    var container = document.createElement('div');
    container.setAttribute('id', 'container');
    document.body.appendChild(container);

    domain.setup(container);

    var evolutionText = document.createElement('h1');
    document.body.appendChild(evolutionText);

    var agentText = document.createElement('h2');
    document.body.appendChild(agentText);

    // var velocityText = document.createElement('p');
    // document.body.appendChild(velocityText);

    // Warn user that audio is played
    window.confirm("Audio is played during this game");

    const N = 100;
    var evolution = new Population(N);
    const TRAINING_TIME = 10;

    // Here for when game is setup
    var id = setInterval(function() {
        var displayIndex = 0;
        domain.resetCanvas();

        evolutionText.textContent = "Generation: " + evolution.generation;

        for (let i = 0; i < N; i++) {
            if (!evolution.agents[i].drone.isAlive) continue;

            evolution.agents[i].update(evolution.target);

            if (evolution.agents[i].detectCollision(evolution.generation) || evolution.agents[i].timeAlive > TRAINING_TIME) {
                // console.log('Drone ', i, ' died :(');
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

        evolution.render(domain.context);

        // console.log([
        //     evolution.agents[displayIndex].drone.T_f / evolution.agents[displayIndex].drone.MAX_THRUST,
        //     evolution.agents[displayIndex].drone.T_a / evolution.agents[displayIndex].drone.MAX_THRUST
        // ]);
    }, dt * 1000);
}
