class Agent {
    constructor(x = CANVAS_WIDTH / 2, y = CANVAS_HEIGHT / 2) {
        this.drone = new Drone(x, y);
        this.target = new Target();

        this.cost = 0;
        this.timeAlive = 0;

        this.nInputs = 5;
        this.nOutputs = 2;
        this.w = [[], []];
        this.generateWeights();

        this.state = [];

        this.TARGET_RESET_TIME = 5000; // ms
        this.intervalID = setInterval(() => {
                this.target.generateNewTarget();
            },
            this.TARGET_RESET_TIME
        );

        this.DISTANCE_WEIGHTING = 1 / 100;
        this.INVERTED_COST = 300;
        this.TIME_WEIGHTING = 20;
        this.Q_WEIGHTING = 100;
    }

    update() {
        if (!this.drone.isAlive) return;

        this.performAction();
        this.drone.updatePosition();

        // Approximate cost function
        this.cost += this.fitnessFunction();
        this.timeAlive += dt;
    }

    fitnessFunction() {
        const q_cost = -Math.abs(this.drone.q) * this.Q_WEIGHTING;

        const dx = this.state[1];
        const dy = this.state[2];
        const distance_cost = -Math.sqrt(dx*dx + dy*dy) * this.DISTANCE_WEIGHTING;

        var theta_cost = 0;
        if (Math.abs(this.drone.theta) > Math.PI / 2) theta_cost = -this.INVERTED_COST;

        const total_cost = q_cost + distance_cost + theta_cost;

        return total_cost;
    }

    performAction() {
        const distance = this.target.getDistance(this.drone);
        this.state = [
            this.drone.theta,
            distance[0],
            distance[1],
            this.drone.U,
            this.drone.W
        ];

        var T_f = 0;
        var T_a = 0;

        for (let i = 0; i < this.nInputs; i++) {
            T_f += this.state[i] * this.w[0][i] * this.drone.MAX_THRUST;
            T_a += this.state[i] * this.w[1][i] * this.drone.MAX_THRUST;
        }

        if (T_f < 0) T_f = 0;
        if (T_a < 0) T_a = 0;
        
        this.drone.T_f = T_f > this.drone.MAX_THRUST ? this.drone.MAX_THRUST : T_f;
        this.drone.T_a = T_a > this.drone.MAX_THRUST ? this.drone.MAX_THRUST : T_a;
    }

    generateWeights() {
        for (let i = 0; i < this.nOutputs; i++) {
            for (let j = 0; j < this.nInputs; j++) {
                this.w[i][j] = (Math.random() - 0.5) * 2;
            }
        }
    }

    manuallySetWeights(w) {
        this.w = w;
    }

    detectCollision(generation) {
        // If at later generation, assume AI's that crash are worse
        if (this.drone.detectCollision()) {
            if (generation > 10) this.cost = -Infinity;
            else this.cost += this.timeAlive * this.TIME_WEIGHTING; // positive score based on time alive
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