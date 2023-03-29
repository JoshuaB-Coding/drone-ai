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
- [ ] Adding an agent which controls the drone
  - [ ] An instance of `Drone` should be stored within the agent
  - [ ] The agent should compute a suggested action depending on the current state of the drone
  - [ ] This agent should have PID control parameters $K_h$ and $K_\theta$ corresponding to altitude and pitch control terms respectively. These will be vectors of 3 values each
- [ ] Introduce a flight path which has the following 'obstacles'
  - [ ] Hover at a given altitude (shown by a horizontal line)
  - [ ] Hover at a given position (shown by a circle)

Alongside the main features, various improvements to the UI and algorithms are to be made. These are listed below for sake of keeping track:
- [x] Including a background which moves with the player, making movement feel faster
- [ ] Improving the collision detection algorithm to account for the actual shape of the drone
- [ ] Changing the style of the border to make it look nicer
