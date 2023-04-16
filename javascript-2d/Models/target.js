class Target {
    constructor() {
        this.POINT_RADIUS = 30;
        this.LINE_WIDTH = 5;

        this.colour = 'red';

        this.generateNewTarget(0.0);
    }

    generateNewTarget(pointTargetProbability) {
        if (Math.random() < pointTargetProbability) {
            this.type = 'point';
        }
        else {
            this.type = 'line';
        }

        this.x = (0.2 * Math.random() + 0.4) * CANVAS_WIDTH; // (Math.random() - 1/3) * 3
        this.y = (0.2 * Math.random() + 0.4) * CANVAS_HEIGHT; // (Math.random() - 1/3) * 3
    }

    getDistance(drone) {
        const relativeX = this.type === 'line' ? drone.x : this.x - (drone.x - CANVAS_WIDTH / 2) * 2;
        const relativeY = this.y - (drone.y - CANVAS_HEIGHT / 2) * 2;

        const dx = relativeX - drone.x;
        const dy = relativeY - drone.y;

        return [dx, dy];
    }

    reset() {
        this.generateNewTarget(0.0);
    }

    setLineColour(drone) {
        const distance = this.getDistance(drone);

        const dy = distance[1];

        if (Math.abs(dy) > this.LINE_WIDTH) this.colour = 'red';
        else this.colour = 'green';
    }

    setPointColour(drone) {
        const distance = this.getDistance(drone);
        
        const dx = distance[0];
        const dy = distance[1];

        if (Math.sqrt(dx*dx + dy*dy) > this.POINT_RADIUS) this.colour = 'red';
        else this.colour = 'green';
    }

    render(ctx, drone) {
        if (this.type === 'line') {
            this.setLineColour(drone);
            this.renderLine(ctx, drone);
        }
        else {
            this.setPointColour(drone);
            this.renderPoint(ctx, drone);
        }
    }

    renderLine(ctx, drone) {
        const X = -CANVAS_WIDTH + (drone.x - CANVAS_WIDTH / 2) * 2;
        const Y = this.y - (drone.y - CANVAS_HEIGHT / 2) * 2;

        ctx.beginPath();

        ctx.strokeStyle = this.colour;
        ctx.lineWidth = this.LINE_WIDTH;

        ctx.moveTo(X, Y);
        ctx.lineTo(X + 3*CANVAS_WIDTH, Y);

        ctx.stroke();
    }

    renderPoint(ctx, drone) {
        const X = this.x - (drone.x - CANVAS_WIDTH / 2) * 2;
        const Y = this.y - (drone.y - CANVAS_HEIGHT / 2) * 2;

        ctx.beginPath();
        
        ctx.moveTo(X, Y);
        ctx.arc(X, Y, this.POINT_RADIUS, 0, 2*Math.PI, true);

        ctx.fillStyle = this.colour;
        ctx.fill();
    }
};