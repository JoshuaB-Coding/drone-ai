class Agent {
    constructor(x = CANVAS_WIDTH / 2, y = CANVAS_HEIGHT / 2) {
        this.drone = new Drone(x, y);
        this.target = new Target();

        this.cost = 0;
        this.timeAlive = 0;
        this.w_T_f = [0, 0, 0];
        this.w_T_a = [0, 0, 0];
        this.generateWeights();

        this.state = [0, 0, 0];
        this.nStates = 3;

        this.TARGET_RESET_TIME = 20000; // ms
        this.intervalID = setInterval(() => {
                this.target.generateNewTarget();
            },
            this.TARGET_RESET_TIME
        );
    }

    update() {
        if (!this.drone.isAlive) return;

        this.performAction();
        this.drone.updatePosition();

        // Approximate cost function
        this.cost -= (Math.sqrt(this.state[1]*this.state[1] + this.state[2]*this.state[2]) / 200 + Math.abs(this.drone.q) * 1000);
        this.timeAlive += dt;
    }

    performAction() {
        const distance = this.target.getDistance(this.drone);
        this.state = [
            this.drone.theta * 0,
            distance[0] * 0,
            distance[1]
        ];

        var T_f = 0;
        var T_a = 0;

        for (let i = 0; i < this.nStates; i++) {
            T_f += this.state[i] * this.w_T_f[i] * this.drone.MAX_THRUST;
            T_a += this.state[i] * this.w_T_a[i] * this.drone.MAX_THRUST;
        }

        if (T_f < 0) T_f = 0;
        if (T_a < 0) T_a = 0;
        
        this.drone.T_f = T_f > this.drone.MAX_THRUST ? this.drone.MAX_THRUST : T_f;
        this.drone.T_a = T_a > this.drone.MAX_THRUST ? this.drone.MAX_THRUST : T_a;
    }

    generateWeights() {
        for (let i = 0; i < this.nStates; i++) {
            this.w_T_f[i] = (Math.random() - 0.5) * 2;
            this.w_T_a[i] = (Math.random() - 0.5) * 2;
        }
    }

    manuallySetWeights(w_T_f, w_T_a) {
        this.w_T_f = w_T_f;
        this.w_T_a = w_T_a;
    }

    detectCollision() {
        if (this.drone.detectCollision()) {
            return true;
        }
        return false;
    }

    clearTargetInterval() {
        clearInterval(this.intervalID);
    }

    reset() {
        this.generateWeights();
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