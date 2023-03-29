class Agent {
    constructor(x = CANVAS_WIDTH / 2, y = CANVAS_HEIGHT / 2) {
        this.drone = new Drone(x, y);
        this.target = new Target(3);

        this.cost = 0;
        this.w_T_f = [0, 0];
        this.w_T_a = [0, 0];
        this.generateWeights();

        this.TARGET_RESET_TIME = 5000; // ms
        console.log(this.target);
        this.intervalID = setInterval(() => {
                this.target.generateNewTarget();
            },
            this.TARGET_RESET_TIME
        );
    }

    update() {
        // this.performAction();
        this.drone.updatePosition();
        this.cost += this.target.getDistance(this.drone) /  + this.drone.theta;
    }

    performAction() {
        const state = [
            this.drone.theta,
            this.target.getDistance(this.drone)
        ];

        var T_f = 0;
        var T_a = 0;

        for (let i = 0; i < 2; i++) {
            T_f += state[i] * this.w_T_f[i] * this.drone.MAX_THRUST;
            T_a += state[i] * this.w_T_a[i] * this.drone.MAX_THRUST;
        }

        this.drone.T_f = T_f > this.drone.MAX_THRUST ? this.drone.MAX_THRUST : T_f;
        this.drone.T_a = T_a > this.drone.MAX_THRUST ? this.drone.MAX_THRUST : T_a;
    }

    generateWeights() {
        for (let i = 0; i < 2; i++) {
            this.w_T_f[i] = Math.random();
            this.w_T_a[i] = Math.random();
        }
    }

    detectCollision() {
        if (this.drone.detectCollision()) {
            clearInterval(this.target.intervalID);
            return true;
        }
        return false;
    }

    reset() {
        this.generateWeights();
        clearInterval(this.intervalID);
        this.target.reset();
        this.drone.reset();
        this.intervalID = setInterval(() => {
                this.drone.generateNewTarget();
            },
            this.TARGET_RESET_TIME
        );
    }

    render(ctx) {
        this.target.getDistance(this.drone);
        this.target.render(ctx, this.drone);
        this.drone.render(ctx);
    }
};