const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;

function startGame() {
    var container = document.createElement('div');
    container.setAttribute('id', 'container');
    document.body.appendChild(container);

    domain.setup(container);

    document.body.addEventListener('keydown', (e) => domain.registerKeyDown(e));
    document.body.addEventListener('keyup', (e) => domain.registerKeyUp(e));
    
    // Here for when game is setup
    // setInterval(function() {
    //     domain.resetCanvas();
    // }, 50);
}
  
var domain = {
    canvas: document.createElement("canvas"),
    setup: function(parent) {
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this.context = this.canvas.getContext("2d");
        parent.appendChild(this.canvas);
    },
    registerKeyDown: function(e) {
        switch(e.code) {
            case 'ArrowRight':
                console.log('Right arrow pressed!');
                break;
            case 'ArrowLeft':
                console.log('Left arrow pressed!');
                break;
            case 'ArrowUp':
                console.log('Up arrow pressed!');
                break;
            case 'ArrowDown':
                console.log('Down arrow pressed!');
                break;
            default:
                console.log('None arrow key pressed!');
                break;
        }
    },
    registerKeyUp: function(e) {
        switch(e.code) {
            case 'ArrowRight':
                console.log('Right arrow up!');
                break;
            case 'ArrowLeft':
                console.log('Left arrow up!');
                break;
            case 'ArrowUp':
                console.log('Up arrow up!');
                break;
            case 'ArrowDown':
                console.log('Down arrow up!');
                break;
            default:
                console.log('None arrow key up!');
                break;
        }
    },
    resetCanvas: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
