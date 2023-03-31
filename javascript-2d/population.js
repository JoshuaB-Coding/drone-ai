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

        this.agents = [];
        for (let i = 0; i < N; i++) {
            this.agents.push(new Agent(this.layerInformation));
        }

        // Select the best agents from 20% of the population
        this.NUMBER_OF_BEST_PERFORMERS = Math.floor(this.numberOfAgents / 5);
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
        for (let i = 0; i < this.N; i++) {
            if (!this.agents[i].drone.isAlive) continue;
            this.agents[i].cost += this.agents[i].timeAlive * this.agents[i].TIME_WEIGHTING;
        }
        this.nextGeneration();
        for (let i = 0; i < this.numberOfAgents; i++) {
            this.agents[i].reset();
        }
        this.generation += 1;
    }

    nextGeneration() {
        const indices = this.bestPerformers();
        
        for (let i = 0; i < this.numberOfAgents; i++) {
            if (indices.includes(i)) continue;


        }
    }

    bestPerformers() {
        // This code is still bad - change later
        let indices = [0, 0, 0, 0, 0, 0];
        let bestCost = [0, 0, 0, 0, 0, 0];

        bestCost[0] = this.agents[0].cost;

        for (let i = 1; i < this.numberOfAgents; i++) {
            const cost = this.agents[i].cost;

            for (let k = 0; k < this.NUMBER_OF_BEST_PERFORMERS; k++) {
                if (bestCost[k + 1] === 0) {
                    bestCost[k + 1] = cost;
                    indices[k + 1] = i;
                    break;
                }
                if (cost > bestCost[k]) {
                    bestCost[k] = cost;
                    indices[k] = i;
                    break;
                }
            }
        }

        console.log(bestCost);

        return indices;
    }
};