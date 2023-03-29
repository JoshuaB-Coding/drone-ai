class Evolution {
    constructor(N = 20) {
        this.N = N; // number of samples per generation

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
        for (let i = 0; i < this.N; i++) {
            this.agents[i].reset();
        }
        this.nextGeneration();
    }

    nextGeneration() {
        const indices = this.bestPerformers();
        const weightingRanges = this.optimalWeightingRanges(indices);

        for (let i = 0; i < this.N; i++) {
            if (i in indices) continue;

            var w_T_f = [0, 0];
            var w_T_a = [0, 0];

            w_T_f[0] = weightingRanges[0][0] + Math.random() * weightingRanges[0][1];
            w_T_f[1] = weightingRanges[1][0] + Math.random() * weightingRanges[1][1];
            w_T_a[0] = weightingRanges[2][0] + Math.random() * weightingRanges[2][1];
            w_T_a[1] = weightingRanges[3][0] + Math.random() * weightingRanges[3][1];

            this.agents[i].manuallySetWeights(w_T_f, w_T_a);
        }
    }

    bestPerformers() {
        let indices = [0, 0, 0, 0, 0, 0];
        let bestCost = [0, 0, 0];
        let bestTime = [0, 0, 0];

        for (let i = 0; i < this.N; i++) {
            const cost = -this.agents[i].cost;
            const time = this.agents[i].timeAlive;

            for (let k = 0; k < 3; k++) {
                if (bestCost[k] > cost) {
                    bestCost[k] = cost;
                    indices[k] = i;
                }
                if (bestTime[k] < time) {
                    bestTime[k] = time;
                    indices[k + 3] = i;
                }
            }
        }

        return indices;
    }

    optimalWeightingRanges(indices) {
        // Not very well written - improve later
        let ranges = [[1, 0], [1, 0], [1, 0], [1, 0]];

        for (let i = 0; i < 6; i++) {
            const agent = this.agents[i];

            if (ranges[0][0] > agent.w_T_f[0]) ranges[0][0] = agent.w_T_f[0];
            if (ranges[0][1] < agent.w_T_f[0]) ranges[0][1] = agent.w_T_f[0];

            if (ranges[1][0] > agent.w_T_f[1]) ranges[1][0] = agent.w_T_f[1];
            if (ranges[1][1] < agent.w_T_f[1]) ranges[1][1] = agent.w_T_f[1];

            if (ranges[2][0] > agent.w_T_a[0]) ranges[2][0] = agent.w_T_a[0];
            if (ranges[2][1] < agent.w_T_a[0]) ranges[2][1] = agent.w_T_a[0];

            if (ranges[3][0] > agent.w_T_a[1]) ranges[3][0] = agent.w_T_a[1];
            if (ranges[3][1] < agent.w_T_a[1]) ranges[3][1] = agent.w_T_a[1];
        }

        return ranges;
    }

    firstAlive() {
        for (let i = 0; i < this.N; i++) {
            if (this.agents[i].drone.isAlive) return i;
        }
    }
};