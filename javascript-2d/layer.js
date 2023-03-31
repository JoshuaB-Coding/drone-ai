/*
 * List of things this class should do:
 * - Update the current layer given the node values of the previous layer
 * - Generate random weightings when a Layer is initialised
 * - Set the weights to custom values provided an input is given
 */

class Layer {
    constructor(nInputs, nOutputs) {
        this.nInputs = nInputs;
        this.nOutputs = nOutputs;

        if (this.nInputs === 0) this.isFirstLayer = true;
        else this.isFirstLayer = false;

        this.nodeValues = [];
        for (let i = 0; i < nOutputs; i++) {
            this.nodeValues.push(0);
        }

        this.weights = this.initialiseWeights();
    }

    updateLayer(previousLayerNodeValues) {
        if (this.isFirstLayer) {
            this.nodeValues = previousLayerNodeValues;
            return;
        }

        for (let j = 0; j < this.nOutputs; j++) {
            var nodeValue = 0;
            for (let i = 0; i < this.nInputs; i++) {
                nodeValue += previousLayerNodeValues[i] * this.weights[i][j];
            }
            this.nodeValues[i] = nodeValue;
        }
    }

    initialiseWeights() {
        var weights = [];
        for (let i = 0; i < this.nOutputs; i++) {
            var weightsRow = [];
            for (let j = 0; j < this.nInputs; j++) {
                const weight = Math.random();
                weightsRow.push(weight);
            }
            weights.push(weightsRow);
        }
        return weights;
    }

    setWeights(newWeights) {
        this.weights = this.newWeights;
    }
};

class LayerInformation {
    constructor(nLayers, layerInputs, layerOutputs) {
        this.nLayers = nLayers;
        this.layerInputs = layerInputs;
        this.layerOutputs = layerOutputs;
    }
};