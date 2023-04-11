var domain = {
    canvas: document.createElement("canvas"),
    background_image: null,
    setup: function(parent) {
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this.context = this.canvas.getContext("2d");
        parent.appendChild(this.canvas);

        this.background_image = Assets.backgroundImage;
    },
    renderBackground(drone) {
        // Currently doesn't scale with grid size - need to fix this
        const X = [-CANVAS_WIDTH, 0, CANVAS_WIDTH];
        const Y = [-CANVAS_HEIGHT, 0, CANVAS_HEIGHT];

        // Adding drone position
        for (let i = 0; i < 3; i++) {
            X[i] -= (drone.x - CANVAS_WIDTH / 2) * 2;
            Y[i] -= (drone.y - CANVAS_HEIGHT / 2) * 2;
        }

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.context.drawImage(this.background_image, X[i], Y[j], CANVAS_WIDTH, CANVAS_HEIGHT);
            }
        }
    },
    resetCanvas: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};