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
    
    resetAll() {
        this.nextGeneration();
        for (let i = 0; i < this.N; i++) {
            this.agents[i].reset();
        }
        this.generation += 1;
    }

    nextGeneration() {
        const indices = this.bestPerformers();
        const weightingRanges = this.optimalWeightingRanges(indices);

        for (let i = 0; i < this.N; i++) {
            if (i in indices) continue;

            var w_T_f = [0, 0, 0];
            var w_T_a = [0, 0, 0];

            w_T_f[0] = weightingRanges[0][0] + Math.random() * weightingRanges[0][1];
            w_T_f[1] = weightingRanges[1][0] + Math.random() * weightingRanges[1][1];
            w_T_f[2] = weightingRanges[2][0] + Math.random() * weightingRanges[2][1];

            w_T_a[0] = weightingRanges[3][0] + Math.random() * weightingRanges[3][1];
            w_T_a[1] = weightingRanges[4][0] + Math.random() * weightingRanges[4][1];
            w_T_a[3] = weightingRanges[5][0] + Math.random() * weightingRanges[5][1];

            this.agents[i].manuallySetWeights(w_T_f, w_T_a);
        }
    }

    bestPerformers() {
        let indices = [0, 0, 0, 0, 0, 0];
        let bestCost = [0, 0, 0, 0, 0, 0];

        bestCost[0] = this.agents[0].cost;

        for (let i = 0; i < this.N; i++) {
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
        let ranges = [[1, -1], [1, -1], [1, -1], [1, -1], [1, -1], [1, -1]];

        for (let i = 0; i < 6; i++) {
            const agent = this.agents[i];

            if (ranges[0][0] > agent.w_T_f[0]) ranges[0][0] = agent.w_T_f[0];
            if (ranges[0][1] < agent.w_T_f[0]) ranges[0][1] = agent.w_T_f[0];

            if (ranges[1][0] > agent.w_T_f[1]) ranges[1][0] = agent.w_T_f[1];
            if (ranges[1][1] < agent.w_T_f[1]) ranges[1][1] = agent.w_T_f[1];

            if (ranges[2][0] > agent.w_T_f[1]) ranges[2][0] = agent.w_T_f[2];
            if (ranges[2][1] < agent.w_T_f[1]) ranges[2][1] = agent.w_T_f[2];

            if (ranges[3][0] > agent.w_T_a[0]) ranges[3][0] = agent.w_T_a[0];
            if (ranges[3][1] < agent.w_T_a[0]) ranges[3][1] = agent.w_T_a[0];

            if (ranges[4][0] > agent.w_T_a[1]) ranges[4][0] = agent.w_T_a[1];
            if (ranges[4][1] < agent.w_T_a[1]) ranges[4][1] = agent.w_T_a[1];

            if (ranges[5][0] > agent.w_T_a[2]) ranges[5][0] = agent.w_T_a[2];
            if (ranges[5][1] < agent.w_T_a[2]) ranges[5][1] = agent.w_T_a[2];
        }

        return ranges;
    }

    firstAlive() {
        for (let i = 0; i < this.N; i++) {
            if (this.agents[i].drone.isAlive) return i;
        }
    }
};