/*
 * List of things this class should do:
 * - Propagate through the layers given an input to produce the output
 * - Reproduce with another instance of NeuralNetwork
 * - Generate the layers upon initialisation
 */

class NeuralNetwork {
    constructor(layerInformation, type = 'dense') {
        this.nLayers = layerInformation.nLayers;
        this.layers = this.generateLayers(layerInformation);
        this.type = type;
        this.isSexual = Math.random() > 0.5 ? true : false;
        this.fitness = 0;
    }

    output(state) {
        var previousLayerNodeValues = state;
        for (layer of this.layers) {
            layer.updateLayer(previousLayerNodeValues);
            previousLayerNodeValues = layer.nodeValues;
        }
        return previousLayerNodeValues;
    }

    reproduce(neuralNetwork) {
        if (this.isSexual) return;

    }

    generateLayers(layerInformation) {
        var layers = [];
        for (let i = 0; i < layerInformation.nLayers; i++) {
            const nInputs = layerInformation.layerInputs[i];
            const nOutputs = layerInformation.layerOutputs[i];
            
            layers.push(new Layer(nInputs, nOutputs));
        }
        return layers;
    }
};