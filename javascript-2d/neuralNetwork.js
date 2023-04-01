/*
 * List of things this class should do:
 * - Propagate through the layers given an input to produce the output
 * - Reproduce with another instance of NeuralNetwork
 * - Generate the layers upon initialisation
 * - For now, all neural networks reproduce sexually
 * - The neural network can be displayed on a canvas using the render() method
 */

class NeuralNetwork {
    constructor(layerInformation, type = 'dense') {
        this.layerInformation = layerInformation;
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

    createChild(neuralNetwork) {
        // Create new child neural network
        var childNetwork = new NeuralNetwork(
            this.layerInformation,
            this.type
        );
        
        // Set new layer equal to first parent
        childNetwork.copyLayers(this);

        // Reproduce with input neural network
        childNetwork.reproduce(neuralNetwork);

        return childNetwork;
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

    copyLayers(neuralNetwork) {
        for (let i = 0; i < this.numberOfLayers; i++) {
            this.layers[i].copyLayer(neuralNetwork.layers[i]);
        }
    }

    render(context) {
        var maximumNodes = 0;
        this.layers.forEach(layer => {
            const layerNodes = layer.numberOfOutputs;
            maximumNodes = layerNodes > maximumNodes ? layerNodes : maximumNodes;
        });

        const width = this.context.width;
        const height = this.context.height;

        const verticalPadding = height * 0.05;
        const horizontalPadding = width * 0.05;

        const radiusScaling = 0.3 / maximumNodes;
        const radius = height * radiusScaling; // needs to be made more general

        const X0 = horizontalPadding + radius;
        const dX = ( width - 2 * horizontalPadding - 2 * radius ) / ( this.layers.numberOfLayers - 1 );

        // Rendering first to penultimate layer
        for (let i = 0; i < this.layers.numberOfLayers; i++) {
            const X = X0 + dX * i;

            this.renderLayer(context, X, radius, index);
        }
    }

    renderLayer(context, X, radius, index) {
        const numberOfNodes = this.layers[index].numberOfOutputs;
    }
};