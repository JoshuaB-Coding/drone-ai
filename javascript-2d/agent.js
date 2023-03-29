class Agent {
    constructor(x = CANVAS_WIDTH / 2, y = CANVAS_HEIGHT / 2) {
        this.drone = new Drone(x, y);
        this.target = new Target();
    }

    update() {
        this.drone.updatePosition();
    }

    detectCollision() {
        return this.drone.detectCollision();
    }

    reset() {
        // this.target = new Target();
        this.drone.reset();
    }

    render(ctx) {
        this.target.getDistance(this.drone);
        this.target.render(ctx, this.drone);
        this.drone.render(ctx);
    }
};