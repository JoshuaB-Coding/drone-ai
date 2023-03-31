/*
 * NOTE: image is 60px x 40px
 */

class Drone {
    constructor() {
        this.isAlive = true;

        this.m = 50; // kg
        this.Iyy = 500; // kg.m^2
        this.x = CANVAS_WIDTH / 2;
        this.y = CANVAS_HEIGHT / 2;

        this.img = new Image();
        this.img.src = "drone_boi.png";

        this.width = 60;
        this.height = 40;

        this.U = 0;
        this.W = 0;
        this.q = 0;
        this.theta = 0;

        this.HOVER_THRUST = this.m * g / 2;
        this.MAX_THRUST = this.HOVER_THRUST * 3;
        this.MIN_THRUST = 0;
        this.DRAG_FACTOR = 0.8;

        this.T_f = this.m * g / 2;
        this.T_a = this.T_f;

        this.x_CG = 0;
        this.x_f = 1;
        this.x_a = -1;
    }

    setThrustFromThrottle(throttle) {
        if (throttle[0] > 1) throttle[0] = 1;
        else if (throttle[0] < 0) throttle[0] = 0;

        if (throttle[1] > 1) throttle[1] = 1;
        else if (throttle[1] < 0) throttle[1] = 0;

        this.T_f = throttle[0] * this.MAX_THRUST;
        this.T_a = throttle[1] * this.MAX_THRUST;
    }

    throttleMax() {
        this.T_f = this.MAX_THRUST;
        this.T_a = this.MAX_THRUST;
    }

    throttleMin() {
        this.T_f = this.MIN_THRUST;
        this.T_a = this.MIN_THRUST;
    }

    throttleHover() {
        this.T_f = this.HOVER_THRUST;
        this.T_a = this.HOVER_THRUST;
    }

    throttleLeft() {
        this.T_a = this.MAX_THRUST * 0.8;
    }

    throttleRight() {
        this.T_f = this.MAX_THRUST * 0.8;
    }

    render(ctx) {
        ctx.translate(this.x, this.y);
        ctx.rotate(this.theta);
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2);
        ctx.rotate(-this.theta);
        ctx.translate(-this.x, -this.y);
    }

    state() {
        return [this.U, this.W, this.q, this.theta];
    }

    updatePosition() {
        this.rungeKutta4(dt);

        // Ensuring parameters don't get stupidly small
        const tolerance = 1e-3;
        if (Math.abs(this.U) < tolerance) this.U = 0;
        if (Math.abs(this.W) < tolerance) this.W = 0;
        if (Math.abs(this.q) < tolerance) this.q = 0;
        if (Math.abs(this.theta) < tolerance) this.theta = 0;

        // Stopping theta from exceeding -pi to pi range
        while (this.theta > Math.PI) this.theta -= 2*Math.PI;
        while (this.theta < -Math.PI) this.theta += 2*Math.PI;

        // 2D navigation equations
        const dx_dt = this.U * Math.cos(this.theta) - this.W * Math.sin(this.theta);
        const dy_dt = this.U * Math.sin(this.theta) + this.W * Math.cos(this.theta);

        this.x += dx_dt * dt; // m -> px
        this.y += dy_dt * dt; // m -> px
    }

    detectCollision() {
        // Very poor collision detection method, but is sufficient for now
        if (this.x > CANVAS_WIDTH) return true;
        if (this.x < 0) return true;
        if (this.y > CANVAS_HEIGHT) return true;
        if (this.y < 0) return true;
        return false;
    }

    reset() {
        this.x = CANVAS_WIDTH / 2;
        this.y = CANVAS_HEIGHT / 2;
        this.U = 0;
        this.W = 0;
        this.q = 0;
        this.theta = 0;
        this.T_f = this.HOVER_THRUST;
        this.T_a = this.HOVER_THRUST;
        this.isAlive = true;
    }

    rungeKutta4(dt) {
        const y = this.state();

        const k1 = this.droneEoM(y);
        const k2 = this.rungeKutta4_k2(y, k1, dt);
        const k3 = this.rungeKutta4_k2(y, k2, dt);
        const k4 = this.rungeKutta4_k4(y, k3, dt);

        this.U += dt/6 * (k1[0] + k2[0] + k3[0] + k4[0]);
        this.W += dt/6 * (k1[1] + k2[1] + k3[1] + k4[1]);
        this.q += dt/6 * (k1[2] + k2[2] + k3[2] + k4[2]);
        this.theta += dt/6 * (k1[3] + k2[3] + k3[3] + k4[3]);
    }

    rungeKutta4_k2(y, k1, dt) {
        let y1 = [0, 0, 0, 0];
        for (let i = 0; i < 4; i++) {
            y1[i] = y[i] + k1[i] * dt / 2;
        }
        return this.droneEoM(y1);
    }

    rungeKutta4_k4(y, k3, dt) {
        let y3 = [0, 0, 0, 0];
        for (let i = 0; i < 4; i++) {
            y3[i] = y[i] + k3[i] * dt;
        }
        return this.droneEoM(y3);
    }

    droneEoM(y) {
        var ydot = [0, 0, 0, 0];

        ydot[0] = -y[1] * y[2] + g * Math.sin(y[3]) - this.DRAG_FACTOR * y[0]; // this may be the problem line
        ydot[1] = g * Math.cos(y[3]) - (this.T_f + this.T_a) / this.m + y[0] * y[2] - this.DRAG_FACTOR * y[1]; // artificial drag
        ydot[2] = (this.T_f * (this.x_f - this.x_CG) + this.T_a * (this.x_a - this.x_CG)) / this.m / this.Iyy;
        ydot[3] = y[2];

        for (let i = 0; i < 3; i++) {
            if (Math.abs(ydot[i]) < 1e-5) ydot[i] = 0;
        }

        return ydot;
    }
};