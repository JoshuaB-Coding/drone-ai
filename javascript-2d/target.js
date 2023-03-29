class Target {
    constructor(T = 10) {
        if (Math.random() > 0.5) {
            this.type = 'point';
        }
        else {
            this.type = 'line';
        }
        this.type = 'point';

        this.END_TIME = T; // seconds
        this.POINT_RADIUS = 30;
        this.LINE_WIDTH = 5;

        this.colour = 'red';

        this.x = (Math.random() - 1/3) * 3 * CANVAS_WIDTH;
        this.y = (Math.random() - 1/3) * 3 * CANVAS_HEIGHT;
    }

    getDistance(drone) {
        if (this.type === 'line') {
            return this.getDistanceLine(drone);
        }
        else {
            return this.getDistancePoint(drone);
        }
    }

    getDistanceLine(drone) {
        const relativeY = this.y - (drone.y - CANVAS_HEIGHT / 2) * 2;

        const distance = Math.abs(relativeY - drone.y);
        if (distance > this.LINE_WIDTH) {
            this.colour = 'red';
        }
        else {
            this.colour = 'green';
        }
        return distance;
    }

    getDistancePoint(drone) {
        const relativeX = this.x + (drone.x - CANVAS_WIDTH / 2) * 2;
        const relativeY = this.y - (drone.y - CANVAS_HEIGHT / 2) * 2;

        const dx = relativeX - drone.x;
        const dy = relativeY - drone.y;

        const distance = Math.sqrt(dx*dx + dy*dy);
        if (distance > this.POINT_RADIUS) {
            this.colour = 'red';
        }
        else {
            this.colour = 'green';
        }
        return distance;
    }

    render(ctx, drone) {
        if (this.type === 'line') {
            this.renderLine(ctx, drone);
        }
        else {
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
        const X = this.x + (drone.x - CANVAS_WIDTH / 2) * 2;
        const Y = this.y - (drone.y - CANVAS_HEIGHT / 2) * 2;

        ctx.beginPath();
        
        ctx.moveTo(X, Y);
        ctx.arc(X, Y, this.POINT_RADIUS, 0, 2*Math.PI, true);

        ctx.lineWidth = 0;
        ctx.fillStyle = this.colour;
        ctx.fill();
        
        // ctx.stroke();
    }
};