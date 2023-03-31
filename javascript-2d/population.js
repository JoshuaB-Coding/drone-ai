class Population {
    constructor(N = 20) {
        this.numberOfAgents = N; // number of samples per generation
        this.generation = 1;

        // Neural network geometry
        const numberOfLayers = 2;
        const layerInputs = [0, 5, 3];
        const layerOutputs = [5, 3, 2];
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

            const agentIndex = Math.floor(Math.random() * this.NUMBER_OF_BEST_PERFORMERS);
            this.agents[i].neuralNetwork.reproduce(
                this.agents[agentIndex].neuralNetwork
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

        console.log(bestCost);

        return indices;
    }
};