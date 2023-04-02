#pragma once

#include "../header.h"

class Drone {
public:
    const double m_mass = 50.; // kg
    const double m_Iyy = 500.; // kg.m^2

    double m_U;
    double m_W;
    double m_q;
    double m_theta;

    Drone()
        : m_U(0.), m_W(0.), m_q(0.), m_theta(0.)
    {
        std::cout << "Drone created!" << std::endl;
        state = new double[4];
    }

    ~Drone() {
        delete[] state;
    }

    void printState() const;

    void update();

private:
    double* state;

    double* runge_kutta_4();
    double* equations_of_motion();
};

void Drone::printState() const {
    std::cout << m_U << ", " << m_W << ", " << m_q << ", " << m_theta << std::endl;
}

void Drone::update() {

}

double* Drone::runge_kutta_4() {

}

double* Drone::equations_of_motion() {

}