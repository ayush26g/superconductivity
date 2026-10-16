### First London Equation:
Accelerating superconducting carriers of density $n_s$, mass $m^*$, and charge $q^*$ without friction:
$$\frac{\partial \mathbf{J}_s}{\partial t} = \frac{n_s (q^*)^2}{m^*} \mathbf{E} = \frac{1}{\mu_0 \lambda_L^2} \mathbf{E}$$

### Second London Equation:
Taking the curl and substituting Faraday's law ($\nabla \times \mathbf{E} = -\frac{\partial \mathbf{B}}{\partial t}$):
$$\nabla \times \mathbf{J}_s = -\frac{1}{\mu_0 \lambda_L^2} \mathbf{B}$$

Substituting Ampère's law ($\nabla \times \mathbf{B} = \mu_0 \mathbf{J}_s$) yields the Helmholtz screening equation:
$$\nabla^2 \mathbf{B} = \frac{1}{\lambda_L^2} \mathbf{B}$$

### London Penetration Depth ($\lambda_L$):
For a flat superconducting boundary at $x = 0$, the external magnetic field decays exponentially into the material:
$$B(x) = B_0 e^{-x / \lambda_L}$$

Where the London penetration depth is:
$$\lambda_L = \sqrt{\frac{m^*}{\mu_0 n_s (q^*)^2}}$$

For YBCO, $\lambda_L \approx 150\text{–}200\text{ nm}$. Screening currents (persistent eddy currents) flow entirely within this microscopic surface layer, generating a counter-magnetic field that cancels the external field inside the bulk.

---

## 5. Type-I vs. Type-II Superconductors
Superconducting materials are classified by the Ginzburg–Landau parameter:

$$\kappa = \frac{\lambda_L}{\xi_{GL}}$$

where $\xi_{GL}$ is the superconducting coherence length (the spatial scale over which the superconducting order parameter changes).

* Type-I ($\kappa < 1/\sqrt{2}$): Includes pure elemental metals like lead ($\text{Pb}$), tin ($\text{Sn}$), and mercury ($\text{Hg}$). They maintain the Meissner state up to a single critical field $H_c$, where superconductivity abruptly collapses.
* Type-II ($\kappa > 1/\sqrt{2}$): Includes alloys and high-$T_c$ cuprates like YBCO. These materials exhibit two critical fields ($H_{c1}$ and $H_{c2}$):
  * $H < H_{c1}$: Complete Meissner state ($B = 0$).
  * $H_{c1} < H < H_{c2}$: Mixed State (Vortex / Shubnikov State). Magnetic flux enters in quantized bundles of flux (Abrikosov vortices), each carrying a flux quantum:
    $$\Phi_0 = \frac{h}{2e} \approx 2.0678 \times 10^{-15}\text{ Wb}$$
  * $H > H_{c2}$: Superconductivity is destroyed; material reverts to the normal state.

---

## 6. Flux Pinning and Magnetic Levitation Mechanics
Earnshaw's theorem states that stable levitation is impossible using static magnetic and gravitational fields alone. However, superconductors overcome this constraint through diamagnetic potential wells and flux pinning:

1. Vortex Pinning: In Type-II YBCO, normal non-superconducting inclusions, twin boundaries, and oxygen vacancies act as energy wells that trap magnetic vortices.
2. Restoring Force: When an external magnet tries to displace a pinned superconductor horizontally or vertically, work must be done against the pinned flux lines. This generates an opposing Lorentz restoring force:
   $$\mathbf{F} = \mathbf{J} \times \mathbf{B}$$
3. Static Stability: The superconductor remains stably locked at an equilibrium height above the magnet track. It can even be suspended upside-down beneath a magnet without falling.
