class Population {
    constructor(N = 20) {
        this.numberOfAgents = N; // number of samples per generation
        this.generation = 1;

        // Neural network geometry
        const numberOfLayers = 2;
        const layerInputs = [0, 5];
        const layerOutputs = [5, 2];
        this.layerInformation = new LayerInformation(
            numberOfLayers,
            layerInputs,
            layerOutputs
        );

        // Setting up target
        this.target = new Target();
        this.TARGET_RESET_TIME = 10000; // ms
        this.intervalID = this.setTargetInterval();

        this.agents = [];
        for (let i = 0; i < N; i++) {
            this.agents.push(new Agent(this.layerInformation));
        }

        // Select the best agents from x% of the population
        const x = 25;
        this.NUMBER_OF_BEST_PERFORMERS = Math.floor(this.numberOfAgents * x / 100);

        this.pointTargetProbability = 1.0;
    }

    isFinished() {
        for (let i = 0; i < this.numberOfAgents; i++) {
            if (this.agents[i].drone.isAlive) return false;
        }
        return true;
    }

    bestCurrentAgent() {
        let index = 0;
        let bestCost = -Infinity;
        for (let i = 0; i < this.numberOfAgents; i++) {
            if (this.agents[i].cost < bestCost) continue;
            if (!this.agents[i].drone.isAlive) continue;
            index = i;
            bestCost = this.agents[i].cost;
        }
        return index;
    }
    
    resetAll() {
        this.clearTargetInterval();
        this.target.reset();
        // this.pointTargetProbability = 0.5 * (1 - Math.exp( -0.005 * (this.generation - 1) ));
        console.log("Point target probability: ", this.pointTargetProbability);
        
        for (let i = 0; i < this.N; i++) {
            if (!this.agents[i].drone.isAlive) continue;
            this.agents[i].cost += this.agents[i].timeAlive * this.agents[i].TIME_WEIGHTING;
        }
        this.nextGeneration();
        for (let i = 0; i < this.numberOfAgents; i++) {
            this.agents[i].reset();
        }
        this.generation += 1;

        this.intervalID = this.setTargetInterval();
    }

    setTargetInterval() {
        return setInterval(() => {
                this.target.generateNewTarget(this.POINT_TARGET_PROBABILITY);
            },
            this.TARGET_RESET_TIME
        );
    }

    clearTargetInterval() {
        clearInterval(this.intervalID);
    }

    nextGeneration() {
        const indices = this.bestPerformers();
        
        for (let i = 0; i < this.numberOfAgents; i++) {
            if (indices.includes(i)) continue;

            const firstParentIndex = Math.floor(Math.random() * this.NUMBER_OF_BEST_PERFORMERS);
            const secondParentIndex = Math.floor(Math.random() * this.NUMBER_OF_BEST_PERFORMERS);

            this.agents[i].neuralNetwork = this.agents[firstParentIndex].neuralNetwork.createChild(
                this.agents[secondParentIndex].neuralNetwork
            );
        }
    }

    bestPerformers() {
        let indices = [];
        let bestCost = [];

        // Use first N performers as reference
        let i;
        for (i = 0; i < this.NUMBER_OF_BEST_PERFORMERS; i++) {
            indices.push(i);
            bestCost.push(this.agents[i].cost);
        }

        for (let j = i; j < this.numberOfAgents; j++) {
            const cost = this.agents[j].cost;

            for (let k = 0; k < this.NUMBER_OF_BEST_PERFORMERS; k++) {
                if (cost > bestCost[k]) {
                    bestCost[k] = cost;
                    indices[k] = i;
                    break;
                }
            }
        }

        console.log(Math.max(...bestCost));

        return indices;
    }

    render(ctx) {
        const bestAgentIndex = this.bestCurrentAgent();

        // Render target first
        this.target.render(
            domain.context,
            this.agents[bestAgentIndex].drone
        );

        // Render all drones
        for (const agent of this.agents) {
            agent.drone.render(ctx);
        }

        // Center on the best current performer
        this.agents[bestAgentIndex].drone.render(ctx);
    }
};