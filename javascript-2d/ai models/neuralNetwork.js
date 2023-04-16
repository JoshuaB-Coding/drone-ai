class NeuralNetwork {
    constructor(layerInformation, type = 'dense') {
        this.layerInformation = layerInformation;
        this.numberOfLayers = layerInformation.numberOfLayers;
        this.layers = this.generateLayers(layerInformation);
        this.type = type;

        // Improve the way this is done
        this.container = document.getElementById('network');
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
            // Reproduce layers
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

    mutate() {
        for (var layer of this.layers) {
            layer.mutateAll();
        }
    }

    render() {
        // Remove current neural network HTML
        while (this.container.hasChildNodes()) {
            this.container.removeChild(this.container.firstChild);
        }

        var maximumHeight = null;

        // Generate and append new children
        for (const layer of this.layers) {
            var column = document.createElement('div');
            column.setAttribute('class', 'network-column');

            // Create nodes
            for (let _ = 0; _ < layer.numberOfOutputs; _++) {
                var node = document.createElement('div');
                node.setAttribute('class', 'network-node');
                column.appendChild(node);
            }

            this.container.appendChild(column);
        }
    }
};