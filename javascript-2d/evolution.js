class Evolution {
    constructor(N = 20) {
        this.N = N; // number of samples per generation
        this.generation = 1;

        this.agents = [];
        for (let i = 0; i < N; i++) {
            this.agents[i] = new Agent();
        }
    }

    isFinished() {
        for (let i = 0; i < this.N; i++) {
            if (this.agents[i].drone.isAlive) return false;
        }
        return true;
    }

    bestCurrentAgent() {
        let index = 0;
        let bestCost = -Infinity;
        for (let i = 0; i < this.N; i++) {
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
        for (let i = 0; i < this.N; i++) {
            this.agents[i].reset();
        }
        this.generation += 1;
    }

    nextGeneration() {
        const indices = this.bestPerformers();
        const weightingRanges = this.optimalWeightingRanges(indices);
        const nInputs = this.agents[0].nInputs;

        for (let i = 0; i < this.N; i++) {
            if (indices.includes(i)) continue;

            var w = [[], []];

            for (let k = 0; k < nInputs; k++) {
                w[0][k] = weightingRanges[k][0] + Math.random() * weightingRanges[k][1];
                w[1][k] = weightingRanges[k + nInputs][0] + Math.random() * weightingRanges[k][1];
            }

            this.agents[i].manuallySetWeights(w);
        }
    }

    bestPerformers() {
        let indices = [0, 0, 0, 0, 0, 0];
        let bestCost = [0, 0, 0, 0, 0, 0];

        bestCost[0] = this.agents[0].cost;

        for (let i = 1; i < this.N; i++) {
            const cost = this.agents[i].cost;

            for (let k = 0; k < 6; k++) {
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

    optimalWeightingRanges(indices) {
        // Not very well written - improve later
        let ranges = [
            [1, -1], [1, -1], [1, -1], [1, -1], [1, -1],
            [1, -1], [1, -1], [1, -1], [1, -1], [1, -1]
        ];

        for (let i = 0; i < 6; i++) {
            const agent = this.agents[i];

            for (let k = 0; k < agent.nInputs; k++) {
                if (ranges[k][0] > agent.w[0][k]) ranges[k][0] = agent.w[0][k];
                if (ranges[k][1] < agent.w[0][k]) ranges[k][1] = agent.w[0][k];

                if (ranges[k + agent.nInputs][0] > agent.w[1][k]) ranges[k + agent.nInputs][0] = agent.w[1][k];
                if (ranges[k + agent.nInputs][1] < agent.w[1][k]) ranges[k + agent.nInputs][1] = agent.w[1][k];
            }
        }

        return ranges;
    }

    firstAlive() {
        for (let i = 0; i < this.N; i++) {
            if (this.agents[i].drone.isAlive) return i;
        }
    }
};