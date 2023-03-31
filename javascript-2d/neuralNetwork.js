/*
 * List of things this class should do:
 * - Propagate through the layers given an input to produce the output
 * - Reproduce with another instance of NeuralNetwork
 * - Generate the layers upon initialisation
 * - For now, all neural networks reproduce sexually
 */

class NeuralNetwork {
    constructor(layerInformation, type = 'dense') {
        this.numberOfLayers = layerInformation.numberOfLayers;
        this.layers = this.generateLayers(layerInformation);
        this.type = type;
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
        for (let i = 1; i < this.numberOfLayers; i++) {
            this.layers[i].reproduce(neuralNetwork.layers[i]);
        }
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