import numpy as np
import pandas as pd
import matplotlib.pyplot as plt


# -------------------------
# Parameters
# -------------------------

V_con = 8.067          # Container volume [m3]
dt = 1.0               # timestep [s]

Cd = 0.65              # discharge coefficient
rho = 1.2              # air density [kg/m3]

P_atm = 101325         # Pa
T = 293                # K
R = 8.314              # J/mol/K


# -------------------------
# Diffusion / leakage model
# -------------------------

# Equivalent diffusion flow per opening area
# [m3/s/m2]
k_diff = 0.15


# -------------------------
# Vent areas
# -------------------------

areas = [0,
    0.01,
    0.02,
    0.03,
    0.04,
    0.05,
    0.06,
    0.08
]


# -------------------------
# Read H2 generation profile
# -------------------------

data = pd.read_csv("H2_profile.csv")

time = data["Time_s"].to_numpy()
H2_gen = data["H2_Generation_m3_s"].to_numpy()



# -------------------------
# Multi-gas release composition
# -------------------------

# Total hydrogen volume released over the event [m3]
V_H2_total = np.sum(H2_gen) * dt

# Additional gases released during thermal runaway [m3]
# (from UL 9540A module report)
V_CO2 = 0.07875        # Carbon dioxide  [m3]  (78.75 L)
V_CO = 0.24640         # Carbon monoxide [m3]  (246.40 L)
V_HC = 0.26195         # Total hydrocarbons [m3] (261.95 L)

# CO2, CO and HC are assumed to follow exactly the same
# time-dependent release profile as hydrogen. The total gas
# generation rate is therefore the hydrogen rate scaled by the
# ratio of total released gas volume to hydrogen volume.
gas_factor = (
    V_H2_total + V_CO2 + V_CO + V_HC
) / V_H2_total

# Total (all-species) gas generation rate used for the pressure
# balance. Hydrogen alone (H2_gen) is still used for the
# explosion concentration assessment.
total_gen = H2_gen * gas_factor



# -------------------------
# Simulation
# -------------------------

pressure_results = {}
H2_results = {}


for A in areas:

    CH2 = np.zeros(len(time))

    P_inside = np.ones(len(time))*P_atm


    # Initial gas amount
    n_initial = P_atm*V_con/(R*T)

    n_extra = 0



    for i in range(1,len(time)):


        # -------------------------
        # Pressure difference
        # -------------------------

        deltaP = max(
            P_inside[i-1]-P_atm,
            0
        )


        # -------------------------
        # Pressure driven venting
        # -------------------------

        Q_pressure = (
            Cd*A*np.sqrt(
                2*deltaP/rho
            )
        )


        # -------------------------
        # Diffusion/leakage
        # dependent on opening area
        # -------------------------

        Q_diff = k_diff*A


        Q_total = Q_pressure + Q_diff



        # -------------------------
        # Hydrogen balance
        # (H2 only: hydrogen is the critical gas for
        #  explosion risk; CO2/CO/HC are NOT included here)
        # -------------------------

        Q_generated = H2_gen[i]


        # hydrogen leaving
        H2_removed = CH2[i-1]*Q_total


        CH2[i] = CH2[i-1] + (
            Q_generated -
            H2_removed
        )/V_con*dt


        CH2[i] = max(CH2[i],0)



        # -------------------------
        # Pressure balance
        # -------------------------

        # Generated gas (ALL species: H2 + CO2 + CO + HC)
        # Every released gas contributes to the total number of
        # gas molecules and therefore to the internal pressure.
        n_generated = (
            total_gen[i]*P_atm/(R*T)
        )


        # Removed gas
        n_removed = (
            Q_pressure*
            P_inside[i-1]
            /(R*T)
        )


        n_extra += (
            n_generated -
            n_removed
        )*dt


        n_extra = max(n_extra,0)



        # Ideal gas law

        P_inside[i] = (
            (n_initial+n_extra)
            *R*T
            /V_con
        )



    pressure_results[A] = P_inside.copy()
    H2_results[A] = CH2.copy()



# -------------------------
# H2 concentration
# -------------------------

plt.figure(figsize=(10,6))


for A in areas:

    plt.plot(
        time,
        H2_results[A]*100,
        label=f"A={A:.4f} m²"
    )


plt.axhline(
    1,
    color="red",
    linestyle="--",
    label="1% H₂ limit"
)


plt.xlabel("Time [s]")
plt.ylabel("Hydrogen concentration [%vol]")
plt.title("Hydrogen Concentration")

plt.grid()
plt.legend()
plt.tight_layout()
plt.show()



# -------------------------
# Pressure
# -------------------------

plt.figure(figsize=(10,6))


for A in areas:

    pressure_kPa = (
        pressure_results[A]-P_atm
    )/1000


    plt.plot(
        time,
        pressure_kPa,
        linewidth=2,
        label=f"A={A:.4f} m²"
    )


plt.xlabel("Time [s]")
plt.ylabel("Pressure rise [kPa]")
plt.title("Pressure Increase for Different Vent Areas")

plt.grid()
plt.legend()
plt.tight_layout()
plt.show()



# -------------------------
# Maximum pressure
# -------------------------

print("\nMaximum pressure rise:")

for A in areas:

    maxP = np.max(
        (pressure_results[A]-P_atm)/1000
    )

    print(
        f"A={A:.4f} m² --> {maxP:.3f} kPa"
    )