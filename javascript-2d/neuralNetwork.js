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
        for (let i = 0; i < this.numberOfLayers; i++) {
            this.layers[i].updateLayer(previousLayerNodeValues);
            previousLayerNodeValues = this.layers[i].nodeValues;
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
        for (let i = 0; i < layerInformation.numberOfLayers; i++) {
            const numberOfInputs = layerInformation.layerInputs[i];
            const numberOfOutputs = layerInformation.layerOutputs[i];
            
            layers.push(new Layer(numberOfInputs, numberOfOutputs));
        }
        return layers;
    }
};