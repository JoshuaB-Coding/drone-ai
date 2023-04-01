class Agent {
    constructor(layerInformation) {
        this.drone = new Drone();

        const maximumScaleFactors = [
            1600, // x distance
            1600, // y distance
            200, // U velocity
            200, // W velocity
            Math.PI // pitch angle
        ];
        this.neuralNetwork = new NeuralNetwork(
            layerInformation,
            'dense',
            maximumScaleFactors
        );

        this.cost = 0;
        this.timeAlive = 0;

        this.DISTANCE_WEIGHTING = 1 / 100;
        this.INVERTED_COST = 300;
        this.TIME_WEIGHTING = 1;
        this.Q_WEIGHTING = 100;
    }

    update(target) {
        if (!this.drone.isAlive) return;

        var state = this.agentState(target);

        const output = this.neuralNetwork.output(state);
        // const throttle = this.saturateOutput(output);
        this.drone.setThrustFromThrottle(output);
        this.drone.updatePosition();

        // Approximate cost function
        this.cost += this.fitnessFunction(target);
        this.timeAlive += dt;
    }

    fitnessFunction(target) {
        const state = this.agentState(target);

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

    agentState(target) {
        const distance = target.getDistance(this.drone);
        return [
            distance[0], // distance in x
            distance[1], // distance in y
            this.drone.U * 0,
            this.drone.W,
            this.drone.theta
        ];
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

    reset() {
        // this.generateWeights();
        this.drone.reset();
        this.timeAlive = 0;
        this.cost = 0;
    }

    render(ctx) {
        this.target.render(ctx, this.drone);
        this.drone.render(ctx);
    }
};