# drone-ai
Reinforcement learning for a 6 DoF drone in 2D (javascript) and 3D (C++)

## Project Aims

- Utilising the equations of motion and control laws derived in my third year group design project, generate a reinforcement learning algorithm to teach the drone to:
  - Ascend to an altitude
  - Hover
  - Track and follow objects
  - Transition to forward flight (very tricky)
- Generate a proof of concept version of this project in Javascript. This version of the model will be:
  - 2D, therefore only controlling its pitch angle and vertical and horizontal velocities
  - able to ascend to an altitude
  - able to track and follow an object
- Generate a fully fledged model in C++ which has 6 degrees of freedom (6 DoF). The hardest part of this will be animating the drones performance, meaning I may switch to C# and Unity if I can't figure out 3D graphics in C++.

## 2D - Javascript

The first iteration of this code is detailed below. The features which need to be added are as follows:
- [x] An object representing the drone including it's state in both body-fixed and Earth centered coordinates
  - [x] A method which converts the body-fixed state to an Earth fixed state
  - [x] A method which returns the state of the drone in body-fixed coordinates as an array
- [x] An area where the drone can fly including collision detection with all boundaries
- [x] A fourth order Runge-Kutta solver for the body-fixed equations of motion for a given stepsize $h$
- [x] Controls to allow the user to increase/decrease throttle
- [x] Controls to allow the user to tilt the drone left or right

After these first stages have been added, the second set of features to be included are listed below:
- [x] Adding an agent which controls the drone
  - [x] An instance of `Drone` should be stored within the agent
  - [x] The agent should compute a suggested action depending on the current state of the game
  - [x] The agent should contain weights $w_i$ for each parameter stored in the game state and evaluate an action depending on those
  - [x] The agent should keep track of the score it has so that the best performing AI in each generation can be used
- [x] Introduce a flight path which has the following 'targets'
  - [x] Hover at a given altitude (shown by a horizontal line)
  - [x] Hover at a given position (shown by a circle)
- [x] The target should reset after a specified time period

After adding the `Agent` class, it is time to introduce the evolution algorithm. The list of features which are to be added to make this work are listed below. It is important to also note that relatively low refresh rates on the targets are used as using fast refresh rates would make it difficult to train the AI.
- [x] Create an `Evolution` class
  - [x] Accept a number of agents to create in each generation
  - [x] Store a list of agents
  - [x] Include a method to detect whether or not a generation has finished
  - [x] Include a method to create a new generation from the best performing agents of the previous generation
  - [ ] Include a small mutation chance for the next generation
- [x] Only render one of the agents at a time (ideally the first)
- [x] Keep track of the best agent coefficients at each iteration
- [ ] Display the best scores of the previous and current generations on screen

The basic implementation of the AI evolution has been added and 'works'. However, the current code base is quite messy and so the next aim is to refactor the code to make it easier to navigate and update in the future. Listed below are items which need to be changed - any extra changes made during refactoring should be added to this list.
- [ ] Change the 'init.js' file into two files that split up the `domain` object and `startGame()` function
- [ ] Figure out the most sensible way to split up the methods contained within `Evolution`, `Agent`, `Drone` and `Target`
  - [ ] These changes should be listed down here
- [ ] Introduce a better way to store the global constants that exist at the top of `init.js`

Alongside the main features, various improvements to the UI and algorithms are to be made. These are listed below for sake of keeping track:
- [x] Including a background which moves with the player, making movement feel faster
- [ ] Improving the collision detection algorithm to account for the actual shape of the drone
- [ ] Changing the style of the border to make it look nicer
- [ ] Allow for changing the size of the play area and scale everything with that
- [ ] Improve graphics and add extra choices for backgrounds and drone
