class Agent {
    constructor(layerInformation) {
        this.drone = new Drone();
        this.target = new Target();

        this.neuralNetwork = new NeuralNetwork(
            layerInformation,
            'dense'
        );

        this.cost = 0;
        this.timeAlive = 0;

        this.TARGET_RESET_TIME = 15000; // ms
        this.intervalID = setInterval(() => {
                this.target.generateNewTarget();
            },
            this.TARGET_RESET_TIME
        );

        this.DISTANCE_WEIGHTING = 1 / 100;
        this.INVERTED_COST = 300;
        this.TIME_WEIGHTING = 1;
        this.Q_WEIGHTING = 100;
    }

    update() {
        if (!this.drone.isAlive) return;

        var state = this.agentState();
        state = this.augmentState(state);

        const output = this.neuralNetwork.output(state);
        // const throttle = this.saturateOutput(output);
        this.drone.setThrustFromThrottle(output);
        this.drone.updatePosition();

        // Approximate cost function
        this.cost += this.fitnessFunction();
        this.timeAlive += dt;
    }

    fitnessFunction() {
        const state = this.agentState();

        const q_cost = -Math.abs(this.drone.q) * this.Q_WEIGHTING;

        const dx = state[0];
        const dy = state[1];
        const distance_cost = -Math.sqrt(dx*dx + dy*dy) * this.DISTANCE_WEIGHTING;

        var theta_cost = 0;
        if (Math.abs(this.drone.theta) > Math.PI / 2) theta_cost = -this.INVERTED_COST;

        const total_cost = q_cost + distance_cost + theta_cost;

        var total_fitness = 0;
        if (Math.sqrt(dx*dx + dy*dy) < 1) total_fitness = 10;

        return total_fitness;
    }

    agentState() {
        const distance = this.target.getDistance(this.drone);
        return [
            distance[0], // distance in x
            distance[1], // distance in y
            this.drone.U * 0,
            this.drone.W,
            this.drone.theta
        ];
    }

    augmentState(state) {
        // Corrects magnitude of state
        state[0] = state[0] / 20;
        state[1] = state[1] / 20;
        state[2] = state[2] / 5;
        state[3] = state[3] / 5;
        return state;
    }

    detectCollision(generation) {
        // If at later generation, assume AI's that crash are worse
        if (this.drone.detectCollision()) {
            // if (generation > 80) this.cost = -Infinity;
            this.cost += this.timeAlive * this.TIME_WEIGHTING; // positive score based on time alive
            return true;
        }
        return false;
    }

    clearTargetInterval() {
        clearInterval(this.intervalID);
    }

    reset() {
        // this.generateWeights();
        this.clearTargetInterval();
        this.target.reset();
        this.drone.reset();
        this.timeAlive = 0;
        this.cost = 0;
        this.intervalID = setInterval(() => {
                this.target.generateNewTarget();
            },
            this.TARGET_RESET_TIME
        );
    }

    render(ctx) {
        this.target.render(ctx, this.drone);
        this.drone.render(ctx);
    }
};