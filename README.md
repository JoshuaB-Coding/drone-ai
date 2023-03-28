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
- [ ] An object representing the drone including it's state in both body-fixed and Earth centered coordinates
  - [ ] A method which converts the body-fixed state to an Earth fixed state
  - [ ] A method which returns the state of the drone in body-fixed coordinates as an array
- [ ] An area where the drone can fly including collision detection with all boundaries
- [ ] A fourth order Runge-Kutta solver for the body-fixed equations of motion for a given stepsize $h$
- [ ] Controls to allow the user to increase/decrease throttle
- [ ] Controls to allow the user to tilt the drone left or right
