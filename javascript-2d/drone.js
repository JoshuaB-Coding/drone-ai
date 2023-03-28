/*
 * NOTE: image is 60px x 40px
 */

class Drone {
    constructor() {
        this.m = 50; // kg
        this.Iyy = 40; // kg.m^4 ?
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

        this.T_f = this.m * g / 2;
        this.T_a = this.T_f;

        this.x_CG = 0;
        this.x_f = 1;
        this.x_a = -1;
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
        // This is much more complex than this :(
        const U_E = this.U * Math.cos(this.theta) - this.W * Math.sin(this.theta);
        const W_E = this.U * Math.sin(this.theta) - this.W * Math.cos(this.theta);

        this.x += U_E * dt;
        this.y -= W_E * dt;

        this.rungeKutta4(dt);
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

        console.log(this.W);
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

        ydot[0] = -y[1] * y[2];
        ydot[1] = g - (this.T_f + this.T_a) / this.m + y[0] * y[2];
        ydot[2] = (this.T_f * (this.x_f - this.x_CG) + this.T_a * (this.x_a - this.x_CG)) / this.Iyy;
        ydot[3] = y[2];

        return ydot;
    }
};