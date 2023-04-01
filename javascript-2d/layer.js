/*
 * List of things this class should do:
 * - Update the current layer given the node values of the previous layer
 * - Generate random weightings when a Layer is initialised
 * - Set the weights to custom values provided an input is given
 */

class Layer {
    constructor(numberOfInputs, numberOfOutputs) {
        this.numberOfInputs = numberOfInputs;
        this.numberOfOutputs = numberOfOutputs;

        if (this.numberOfInputs === 0) this.isFirstLayer = true;
        else this.isFirstLayer = false;

        this.nodeValues = [];
        for (let i = 0; i < numberOfOutputs; i++) {
            this.nodeValues.push(0);
        }

        this.weights = this.initialiseWeights();

        this.MUTATION_CHANCE = 0.001;
    }

    updateLayer(previousLayerNodeValues) {
        if (this.isFirstLayer) {
            this.nodeValues = previousLayerNodeValues;
            return;
        }

        for (let i = 0; i < this.numberOfOutputs; i++) {
            var nodeValue = 0;
            for (let j = 0; j < this.numberOfInputs; j++) {
                nodeValue += previousLayerNodeValues[j] * this.weights[i][j];
            }
            this.nodeValues[i] = nodeValue;
        }
    }

    initialiseWeights() {
        var weights = [];
        for (let i = 0; i < this.numberOfOutputs; i++) {
            var weightsRow = [];
            for (let j = 0; j < this.numberOfInputs; j++) {
                const weight = (Math.random() - 0.5) * 2;
                weightsRow.push(weight);
            }
            weights.push(weightsRow);
        }
        return weights;
    }

    copyLayer(layer) {
        for (let i = 0; i < this.numberOfOutputs; i++) {
            for (let j = 0; j < this.numberOfInputs; j++) {
                this.weights[i][j] = layer.weights[i][j];
            }
        }
    }

    reproduce(layer) {
        // Simple averaging of weights to reproduce
        for (let i = 0; i < this.numberOfOutputs; i++) {
            for (let j = 0; j < this.numberOfInputs; j++) {
                // Reproduction method
                const newWeight = (this.weights[i][j] + layer.weights[i][j]) / 2;
                // const newWeight = Math.random() > 0.5 ? this.weights[i][j] : layer.weights[i][j];

                this.weights[i][j] = newWeight;
                this.mutate(i, j);
            }
        }
    }

    mutate(index1, index2) {
        if (Math.random() < this.MUTATION_CHANCE) return;

        const mutation = (Math.random() - 0.5) * 0.1;
        const newWeight = this.weights[index1][index2] + mutation;

        if (newWeight > 1) this.weights[index1][index2] = 1;
        else if (newWeight < -1) this.weights[index1][index2] = -1;
        else this.weights[index1][index2] = newWeight;
    }
};

class LayerInformation {
    constructor(numberOfLayers, layerInputs, layerOutputs) {
        this.numberOfLayers = numberOfLayers;
        this.layerInputs = layerInputs;
        this.layerOutputs = layerOutputs;
    }
};