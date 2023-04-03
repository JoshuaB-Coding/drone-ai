#pragma once

#include "../header.h"

class Drone {
public:
    double U; // X velocity
    double W; // Z velocity
    double q; // pitch rate
    double theta; // pitch angle

    double V; // Y velocity
    double p; // roll rate
    double r; // yaw rate
    double phi; // roll angle
    double psi; // yaw angle

    Drone()
        : U(0.), W(0.), q(0.), theta(0.), V(0.), p(0.), r(0.), phi(0.), psi(0.)
    {
        std::cout << "Drone created!" << std::endl;
        this->m_state = new double[m_numberOfStates];
    }

    ~Drone() {
        delete[] this->m_state;
    }

    void printState() const;

    void update();

private:
    const double m_mass = 50.; // kg
    const double m_Iyy = 500.; // kg.m^2
    double* m_state;
    const int m_numberOfStates = 9;
    const double m_hoverThrust = Constants::g * m_mass / 4;
    const double m_maxThrust = m_hoverThrust * 5;

    double* runge_kutta_4();
    void equations_of_motion(const int& index, double*& k_next, const double* k_previous) const;
};

void Drone::printState() const {
    std::cout << U << ", " << W << ", " << q << ", " << theta << std::endl;
}

void Drone::update() {

}

double* Drone::runge_kutta_4() {
    double* k1 = new double[m_numberOfStates];
    double* k2 = new double[m_numberOfStates];
    double* k3 = new double[m_numberOfStates];
    double* k4 = new double[m_numberOfStates];

    equations_of_motion(1, k1, nullptr);
    equations_of_motion(2, k2, k1);
    equations_of_motion(3, k3, k2);
    equations_of_motion(4, k4, k3);

    for (unsigned int i = 0; i < m_numberOfStates; i++) {
        m_state[i] += Constants::dt / 6.0 * (
            k1[i] + k2[i] + k3[i] + k4[i]
        );
    }
    
    delete[] k1;
    delete[] k2;
    delete[] k3;
    delete[] k4;
}

void Drone::equations_of_motion(const int& index, double*& k_next, const double* k_previous) const {
    const double factor = index == 4 ? 1.0 : 0.5;
    const double increment = Constants::dt * factor;
    double* incrementedState = new double[m_numberOfStates];

    if (k_previous != nullptr) {
        for (unsigned int i = 0; i < m_numberOfStates; i++) {
            incrementedState[i] = m_state[i] + k_previous[i];
        }
    }

    k_next[0] = 0; // U dot
    k_next[1] = 0; // W dot
    k_next[2] = 0; // q dot
    k_next[3] = 0; // theta dot
    k_next[4] = 0; // V dot
    k_next[5] = 0; // p dot
    k_next[6] = 0; // r dot
    k_next[7] = 0; // phi dot
    k_next[8] = 0; // psi dot

    delete[] incrementedState;
}