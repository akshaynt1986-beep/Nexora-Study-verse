import { FormulaItem } from '../types';

export const COMPREHENSIVE_FORMULA_VAULT: FormulaItem[] = [
  // =========================================================================
  // PHYSICS
  // =========================================================================

  // --- 1. UNITS AND MEASUREMENT ---
  {
    id: 'f-phy-101',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Units and Measurements',
    subtopic: 'Errors in Measurement & Error Propagation',
    title: 'Relative & Percentage Error Propagation',
    latex: 'Z = \\frac{A^p B^q}{C^r} \\implies \\frac{\\Delta Z}{Z} = p\\frac{\\Delta A}{A} + q\\frac{\\Delta B}{B} + r\\frac{\\Delta C}{C}',
    explanation: 'Maximum fractional error in Z is the sum of fractional errors weighted by powers. Absolute errors always add up.',
    derivedFormulas: [
      '\\% \\text{ error in } Z = p(\\%A) + q(\\%B) + r(\\%C)',
      '\\text{Least Count Error} = \\pm \\text{Least Count of instrument}'
    ],
    specialCases: [
      'If Z = A \\pm B \\implies \\Delta Z = \\Delta A + \\Delta B (Absolute errors add up)',
      'Logarithmic differentiation used for deriving relative error: \\ln Z = p\\ln A + q\\ln B - r\\ln C'
    ],
    keyVariables: ['Z: Quantity being measured', 'ΔA, ΔB, ΔC: Absolute errors', 'p, q, r: Exponents'],
    conditions: 'Valid for small fractional errors (ΔX/X << 1).',
    units: 'Dimensionless ratio (Percentage / Fractional)',
    commonMistakes: 'Subtracting error terms when quantities are in the denominator. Errors ALWAYS add up to give maximum potential error.',
    shortcuts: 'For Z = A^n, relative error is n times relative error in A.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },
  {
    id: 'f-phy-102',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Units and Measurements',
    subtopic: 'Vernier Calipers & Screw Gauge',
    title: 'Least Count of Vernier Calipers & Screw Gauge',
    latex: '\\text{LC}_{VC} = 1\\text{ MSD} - 1\\text{ VSD} = \\left(1 - \\frac{m}{n}\\right)\\text{MSD}, \\quad \\text{LC}_{SG} = \\frac{\\text{Pitch}}{\\text{Total Circular Divisions}}',
    explanation: 'Least count represents the smallest value that can be measured accurately with an instrument.',
    derivedFormulas: [
      '\\text{Measured Reading} = \\text{MSR} + (VSR \\times LC) - (\\pm \\text{Zero Error})',
      '\\text{Pitch} = \\frac{\\text{Distance moved on main scale}}{\\text{Number of full rotations}}'
    ],
    specialCases: [
      'Positive Zero Error: Subtracted from observed reading.',
      'Negative Zero Error: Added to observed reading.'
    ],
    keyVariables: ['MSD: Main Scale Division', 'VSD: Vernier Scale Division', 'MSR: Main Scale Reading', 'VSR: Vernier Scale Reading'],
    conditions: 'Standard n Vernier divisions coincide with m Main scale divisions.',
    units: 'mm or cm (length units)',
    commonMistakes: 'Forgetting to subtract zero error with proper sign: True = Measured - (Zero Error).',
    shortcuts: 'If n VSD = (n-1) MSD, LC = 1 MSD / n.',
    difficulty: 'JEE Main',
    isFavorite: false,
  },

  // --- 2. VECTORS ---
  {
    id: 'f-phy-201',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Vectors',
    subtopic: 'Dot Product, Cross Product & Vector Projections',
    title: 'Dot & Cross Product Relations',
    latex: '\\vec{A} \\cdot \\vec{B} = |A||B|\\cos\\theta, \\quad \\vec{A} \\times \\vec{B} = |A||B|\\sin\\theta \\hat{n}',
    explanation: 'Dot product is scalar and measures parallel component; Cross product gives a vector orthogonal to both.',
    derivedFormulas: [
      '\\text{Projection of } \\vec{A} \\text{ on } \\vec{B} = \\frac{\\vec{A} \\cdot \\vec{B}}{|\\vec{B}|}',
      '\\text{Area of Parallelogram} = |\\vec{A} \\times \\vec{B}|',
      '\\text{Scalar Triple Product } [\\vec{A}\\;\\vec{B}\\;\\vec{C}] = \\vec{A} \\cdot (\\vec{B} \\times \\vec{C}) = \\text{Volume of Parallelopiped}'
    ],
    specialCases: [
      'Vector Triple Product: \\vec{A} \\times (\\vec{B} \\times \\vec{C}) = (\\vec{A} \\cdot \\vec{C})\\vec{B} - (\\vec{A} \\cdot \\vec{B})\\vec{C} (BAC - CAB rule)',
      'Orthogonal condition: \\vec{A} \\cdot \\vec{B} = 0 (for non-zero vectors)'
    ],
    keyVariables: ['θ: Angle between vectors (0° ≤ θ ≤ 180°)', 'n̂: Unit vector along right-hand thumb rule'],
    conditions: 'Valid in 3D Euclidean space.',
    units: 'Units equal product of units of A and B',
    commonMistakes: 'Confusing vector triple product order: A × (B × C) ≠ (A × B) × C.',
    shortcuts: 'Use BAC-CAB rule for vector triple productexpansion.',
    difficulty: 'JEE Advanced',
    isFavorite: true,
  },

  // --- 3. KINEMATICS ---
  {
    id: 'f-phy-401',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Kinematics',
    subtopic: 'Oblique & Inclined Projectile Motion',
    title: 'Oblique & Inclined Projectile Trajectory',
    latex: 'T = \\frac{2u\\sin\\theta}{g}, \\quad H = \\frac{u^2\\sin^2\\theta}{2g}, \\quad R = \\frac{u^2\\sin 2\\theta}{g}, \\quad y = x\\tan\\theta - \\frac{gx^2}{2u^2\\cos^2\\theta}',
    explanation: 'Motion of particle projected at angle θ to horizontal under constant downward gravitational acceleration.',
    derivedFormulas: [
      '\\text{Time on Incline } T_{inc} = \\frac{2u\\sin(\\theta - \\alpha)}{g\\cos\\alpha}',
      '\\text{Range on Incline } R_{inc} = \\frac{u^2}{g\\cos^2\\alpha}[\\sin(2\\theta - \\alpha) - \\sin\\alpha]'
    ],
    specialCases: [
      'Maximum Range on Horizontal Ground: R_max = u^2/g when θ = 45°',
      'Maximum Range Up An Incline: R_max = u^2 / [g(1 + sin α)] when θ = 45° + α/2'
    ],
    keyVariables: ['u: Initial velocity', 'θ: Angle with horizontal/incline', 'α: Angle of incline', 'g: Gravitational acceleration'],
    conditions: 'Neglecting air resistance and earth curvature.',
    units: 'T (s), H (m), R (m)',
    commonMistakes: 'Using horizontal projectile equations directly on inclined plane without resolving g along and perpendicular to incline.',
    shortcuts: 'R = 4H cot θ is a extremely useful direct relation between Range and Max Height.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },
  {
    id: 'f-phy-402',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Kinematics',
    subtopic: 'Relative Motion & River-Boat Problems',
    title: 'River Boat Crossing & Minimum Drift',
    latex: 't = \\frac{d}{v_{br}\\cos\\theta}, \\quad \\text{Drift } x = (v_r - v_{br}\\sin\\theta)t',
    explanation: 'Cross-river motion where v_r is river velocity and v_br is velocity of boat relative to river.',
    derivedFormulas: [
      '\\text{Shortest Time Crossing: } \\theta = 0^\\circ \\implies t_{min} = \\frac{d}{v_{br}}, \\quad x = v_r t_{min}',
      '\\text{Zero Drift Condition (if } v_{br} > v_r): \\sin\\theta = \\frac{v_r}{v_{br}} \\implies t = \\frac{d}{\\sqrt{v_{br}^2 - v_r^2}}'
    ],
    specialCases: [
      'If v_r > v_{br}, zero drift is impossible. Minimum drift occurs at sin θ = v_br / v_r with x_min = d √(v_r² - v_br²) / v_br.'
    ],
    keyVariables: ['d: Width of river', 'v_r: Speed of river flow', 'v_br: Speed of boat in still water', 'θ: Angle with normal to river bank'],
    conditions: 'Constant river current and boat speed.',
    units: 't (seconds), x (meters)',
    commonMistakes: 'Measuring θ from bank instead of perpendicular to bank.',
    shortcuts: 'For minimum drift when v_r > v_br, point steering perpendicular to resultant velocity vector.',
    difficulty: 'JEE Advanced',
    isFavorite: true,
  },

  // --- 5. LAWS OF MOTION ---
  {
    id: 'f-phy-501',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Laws of Motion',
    subtopic: 'Friction, Pulley Systems & Circular Motion',
    title: 'Limiting Friction & Banking of Roads',
    latex: 'f_s \\le \\mu_s N, \\quad f_k = \\mu_k N, \\quad \\tan\\theta = \\frac{v^2}{rg} \\quad \\text{(Safe Turning on Banked Road: } v_{max} = \\sqrt{rg\\frac{\\tan\\theta + \\mu}{1 - \\mu\\tan\\theta}}\\text{)}',
    explanation: 'Governs friction forces and optimal angle θ of road banking to prevent skidding at speed v.',
    derivedFormulas: [
      '\\text{Angle of Repose } \\theta = \\tan^{-1}(\\mu_s)',
      '\\text{Minimum speed on banked road } v_{min} = \\sqrt{rg\\frac{\\tan\\theta - \\mu}{1 + \\mu\\tan\\theta}}'
    ],
    specialCases: [
      'Smooth Banked Road (μ = 0): v_opt = √(rg tan θ)',
      'Flat Rough Road (θ = 0): v_max = √(μ_s r g)'
    ],
    keyVariables: ['μ_s: Static friction coefficient', 'μ_k: Kinetic friction coefficient', 'r: Turning radius', 'N: Normal force'],
    conditions: 'μ_k ≤ μ_s always.',
    units: 'μ is dimensionless; v (m/s)',
    commonMistakes: 'Assuming static friction is always equal to μ_s N. Static friction is self-adjusting from 0 up to μ_s N.',
    shortcuts: 'For block on incline of angle θ, friction is kinetic if θ > angle of repose.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 6. WORK, ENERGY AND POWER ---
  {
    id: 'f-phy-601',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Work, Energy and Power',
    subtopic: 'Work-Energy Theorem & Vertical Circular Motion',
    title: 'Work-Energy Theorem & Vertical Circle Critical Speeds',
    latex: 'W_{net} = \\Delta K = K_f - K_i, \\quad F = -\\frac{dU}{dx}, \\quad v_{bottom, min} = \\sqrt{5gR}, \\quad v_{top, min} = \\sqrt{gR}',
    explanation: 'Net work done by all forces equals change in kinetic energy. Potential energy U defined for conservative forces.',
    derivedFormulas: [
      '\\text{Tension at Bottom } T_{bottom} = \\frac{mv^2}{R} + mg',
      '\\text{Tension at Top } T_{top} = \\frac{mv^2}{R} - mg',
      'T_{bottom} - T_{top} = 6mg \\quad \\text{(for complete vertical loop)}'
    ],
    specialCases: [
      'Light Rigid Rod in Vertical Circle: v_bottom,min = √(4gR) for particle to just reach highest point (since v_top can be 0).'
    ],
    keyVariables: ['W_net: Work by conservative, non-conservative & pseudo forces', 'R: Radius of vertical circle', 'm: Mass'],
    conditions: 'Valid in inertial and non-inertial frames (when pseudo-force work is included).',
    units: 'Joule (J) or N·m',
    commonMistakes: 'Forgetting work done by normal force can be non-zero in moving reference frames.',
    shortcuts: 'Force is zero at equilibrium points (dU/dx = 0); d²U/dx² > 0 implies stable equilibrium.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 7. SYSTEM OF PARTICLES AND CENTRE OF MASS ---
  {
    id: 'f-phy-701',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'System of Particles and Centre of Mass',
    subtopic: 'Centre of Mass & Variable Mass Systems',
    title: 'Centre of Mass & Rocket Propulsion',
    latex: '\\vec{R}_{cm} = \\frac{\\sum m_i \\vec{r}_i}{\\sum m_i} = \\frac{\\int \\vec{r} dm}{M}, \\quad v_{rocket} = v_0 + u_{rel} \\ln\\left(\\frac{M_0}{M}\\right) - gt',
    explanation: 'Position vector of COM and velocity of variable mass rocket ejected at relative exhaust velocity u_rel.',
    derivedFormulas: [
      '\\text{COM of Semicircular Ring: } y_{cm} = \\frac{2R}{\\pi}',
      '\\text{COM of Semicircular Disc: } y_{cm} = \\frac{4R}{3\\pi}',
      '\\text{COM of Solid Hemisphere: } y_{cm} = \\frac{3R}{8}',
      '\\text{COM of Hollow Hemisphere: } y_{cm} = \\frac{R}{2}'
    ],
    specialCases: [
      'Thrust force on rocket: F_thrust = u_rel (-dM/dt)'
    ],
    keyVariables: ['M_0: Initial mass', 'M: Mass at time t', 'u_rel: Exhaust speed relative to rocket', 'dM/dt: Rate of fuel consumption'],
    conditions: 'Constant exhaust speed u_rel.',
    units: 'R_cm (m), Thrust (N)',
    commonMistakes: 'Confusing position of COM of solid cone (h/4 from base) with hollow cone (h/3 from base).',
    shortcuts: 'If no external force acts on system, R_cm remains stationary or moves at constant velocity.',
    difficulty: 'JEE Advanced',
    isFavorite: true,
  },

  // --- 8. COLLISION ---
  {
    id: 'f-phy-801',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Collision',
    subtopic: 'Coefficient of Restitution & Energy Loss',
    title: '1D/2D Collision Velocities & Energy Loss',
    latex: 'e = \\frac{v_2 - v_1}{u_1 - u_2}, \\quad v_1 = \\frac{(m_1 - e m_2)u_1 + m_2(1+e)u_2}{m_1 + m_2}, \\quad \\Delta E = \\frac{1}{2}\\frac{m_1 m_2}{m_1+m_2}(1-e^2)(u_1 - u_2)^2',
    explanation: 'Quantifies velocity restoration along line of impact and kinetic energy dissipated in collision.',
    derivedFormulas: [
      '\\text{Perfectly Elastic Collision (e = 1): } v_1 = \\frac{(m_1 - m_2)u_1 + 2m_2 u_2}{m_1 + m_2}',
      '\\text{Rebound Height after n bounces: } h_n = e^{2n} h_0'
    ],
    specialCases: [
      'Equal Masses (m1 = m2) in Elastic Collision: Particles exchange velocities.',
      'Target Mass Infinitely Heavy (m2 >> m1): v1 = -e u1.'
    ],
    keyVariables: ['e: Coefficient of restitution (0 ≤ e ≤ 1)', 'u1, u2: Initial velocities', 'v1, v2: Final velocities'],
    conditions: 'Line of impact analysis.',
    units: 'e is dimensionless; ΔE (Joules)',
    commonMistakes: 'Applying e formula along directions perpendicular to the line of impact.',
    shortcuts: 'For oblique collision with smooth surface, velocity component parallel to surface remains unchanged.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 9. ROTATIONAL MOTION ---
  {
    id: 'f-phy-901',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Rotational Motion',
    subtopic: 'Moment of Inertia Theorems & Rolling Motion',
    title: 'Parallel/Perpendicular Axis Theorems & Pure Rolling',
    latex: 'I = I_{cm} + M d^2, \\quad I_z = I_x + I_y, \\quad v_{cm} = R\\omega, \\quad a_{cm} = R\\alpha \\quad \\text{(Incline Acceleration: } a = \\frac{g\\sin\\theta}{1 + k^2/R^2}\\text{)}',
    explanation: 'Fundamental rotational dynamics theorems and pure rolling conditions without slipping.',
    derivedFormulas: [
      'I_{ring} = MR^2, \\quad I_{disc} = \\frac{1}{2}MR^2, \\quad I_{solid\\;sphere} = \\frac{2}{5}MR^2, \\quad I_{hollow\\;sphere} = \\frac{2}{3}MR^2',
      'I_{rod, end} = \\frac{1}{3}ML^2, \\quad I_{solid\\;cylinder} = \\frac{1}{2}MR^2',
      '\\text{Angular Momentum } \\vec{L} = \\vec{r} \\times \\vec{p} = I \\vec{\\omega}'
    ],
    specialCases: [
      'Perpendicular Axis Theorem ONLY applies to 2D planar bodies.',
      'Rolling Acceleration on Incline: Solid Sphere > Disc > Hollow Sphere > Ring (Sphere reaches bottom first).'
    ],
    keyVariables: ['k: Radius of gyration', 'I_cm: MOI about COM axis', 'd: Distance between parallel axes'],
    conditions: 'Pure rolling requires zero relative velocity at contact point.',
    units: 'MOI (kg·m²), Angular momentum (kg·m²/s)',
    commonMistakes: 'Applying I_z = I_x + I_y to 3D solid objects like spheres or cylinders.',
    shortcuts: 'Work done by friction force in pure rolling on fixed surface is ALWAYS ZERO.',
    difficulty: 'JEE Advanced',
    isFavorite: true,
  },

  // --- 10. GRAVITATION ---
  {
    id: 'f-phy-1001',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Gravitation',
    subtopic: 'Gravitational Potential, Escape & Orbital Velocity',
    title: 'Variation of g, Escape Speed & Kepler’s Laws',
    latex: 'g_h = g\\left(1 - \\frac{2h}{R}\\right), \\quad g_d = g\\left(1 - \\frac{d}{R}\\right), \\quad v_e = \\sqrt{\\frac{2GM}{R}} = \\sqrt{2gR}, \\quad v_o = \\sqrt{\\frac{GM}{R}}, \\quad T^2 = \\frac{4\\pi^2}{GM} a^3',
    explanation: 'Calculates acceleration due to gravity changes with elevation/depth, escape velocity, and satellite orbital period.',
    derivedFormulas: [
      'g_{\\phi} = g - \\omega^2 R \\cos^2\\phi \\quad \\text{(Latitude variation due to Earth rotation)}',
      '\\text{Total Energy of Satellite } E = -\\frac{GMm}{2r} = -K = \\frac{1}{2}U',
      '\\text{Gravitational Self Energy of Solid Sphere } U_{self} = -\\frac{3}{5}\\frac{GM^2}{R}'
    ],
    specialCases: [
      'At equator (ϕ = 0): g_eq = g - ω²R. At pole (ϕ = 90°): g_pole = g.',
      'Weightlessness in earth orbit: Effective g = 0.'
    ],
    keyVariables: ['G: 6.67 × 10^-11 N m²/kg²', 'R: Earth radius (~6400 km)', 'a: Semi-major axis'],
    conditions: 'g_h approximation valid for h << R.',
    units: 'v_e (m/s), T (seconds)',
    commonMistakes: 'Using g_h = g(1 - 2h/R) when height h is comparable to R (use g_h = g R² / (R+h)² instead).',
    shortcuts: 'v_e = √2 v_o for near-earth satellites.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 11. PROPERTIES OF SOLIDS ---
  {
    id: 'f-phy-1101',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Properties of Solids',
    subtopic: 'Young Modulus & Elastic Potential Energy',
    title: 'Hooke’s Law & Elastic Potential Energy Density',
    latex: 'Y = \\frac{\\text{Stress}}{\\text{Strain}} = \\frac{F/A}{\\Delta L / L_0}, \\quad u = \\frac{U}{V} = \\frac{1}{2} \\times \\text{Stress} \\times \\text{Strain} = \\frac{1}{2} Y (\\text{Strain})^2',
    explanation: 'Describes elastic deformation of solid wire under axial tensile/compressive load.',
    derivedFormulas: [
      '\\text{Bulk Modulus } B = -V\\frac{\\Delta P}{\\Delta V}, \\quad \\text{Compressibility } K = \\frac{1}{B}',
      '\\text{Poisson Ratio } \\sigma = -\\frac{\\text{Lateral Strain}}{\\text{Longitudinal Strain}} \\quad (-1 < \\sigma < 0.5)',
      '\\text{Relation between Moduli: } Y = 3B(1-2\\sigma) = 2\\eta(1+\\sigma)'
    ],
    specialCases: [
      'Work done in stretching wire by ΔL: W = (1/2) F ΔL = (1/2) (Y A / L) (ΔL)².'
    ],
    keyVariables: ['Y: Young Modulus', 'B: Bulk Modulus', 'η: Shear Modulus', 'σ: Poisson ratio'],
    conditions: 'Valid within elastic limit.',
    units: 'N/m² or Pascal (Pa)',
    commonMistakes: 'Confusing total elastic energy U with energy density u = U/Volume.',
    shortcuts: 'Equivalent spring constant of elastic wire: k_eq = Y A / L.',
    difficulty: 'JEE Main',
    isFavorite: false,
  },

  // --- 12. FLUID MECHANICS ---
  {
    id: 'f-phy-1201',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Fluid Mechanics',
    subtopic: 'Bernoulli Equation, Viscosity & Surface Tension',
    title: 'Bernoulli Equation, Terminal Speed & Excess Pressure',
    latex: 'P + \\frac{1}{2}\\rho v^2 + \\rho g z = \\text{const}, \\quad v_T = \\frac{2r^2(\\rho - \\sigma)g}{9\\eta}, \\quad \\Delta P_{liquid\\;drop} = \\frac{2T}{R}, \\quad \\Delta P_{soap\\;bubble} = \\frac{4T}{R}',
    explanation: 'Core equations governing ideal fluid flow, viscous drag (Stokes Law), and surface tension capillary forces.',
    derivedFormulas: [
      '\\text{Torricelli Efflux Speed: } v = \\sqrt{2gh}',
      '\\text{Capillary Height Rise: } h = \\frac{2T\\cos\\theta}{r\\rho g}',
      '\\text{Stokes Viscous Force: } F_v = 6\\pi \\eta r v'
    ],
    specialCases: [
      'Venturimeter Rate of Flow: Q = A1 A2 √(2g h / (A1² - A2²))',
      'For two soap bubbles merging at constant temp: R_new = √(R1² + R2²)'
    ],
    keyVariables: ['ρ: Fluid density', 'η: Viscosity', 'T: Surface tension', 'θ: Angle of contact'],
    conditions: 'Bernoulli holds for incompressible, non-viscous, stream-lined, steady flow.',
    units: 'Pressure (Pa), T (N/m), Viscosity (Pa·s)',
    commonMistakes: 'Using 2T/R for soap bubble instead of 4T/R (soap bubble has TWO free surfaces).',
    shortcuts: 'Time to empty cylindrical tank through bottom hole: t = (A/a) √(2H/g).',
    difficulty: 'JEE Advanced',
    isFavorite: true,
  },

  // --- 14. THERMODYNAMICS ---
  {
    id: 'f-phy-1401',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Thermodynamics',
    subtopic: 'First Law, Thermodynamic Processes & Carnot Engine',
    title: 'First Law, Work in Processes & Carnot Efficiency',
    latex: '\\Delta Q = \\Delta U + W, \\quad W_{iso} = nRT\\ln\\left(\\frac{V_2}{V_1}\\right), \\quad W_{adia} = \\frac{P_1 V_1 - P_2 V_2}{\\gamma - 1}, \\quad \\eta = 1 - \\frac{T_2}{T_1}',
    explanation: 'First law energy conservation, work done in standard thermodynamic processes, and max Carnot heat engine efficiency.',
    derivedFormulas: [
      '\\text{Adiabatic Equation: } P V^\\gamma = \\text{const}, \\quad T V^{\\gamma-1} = \\text{const}, \\quad P^{1-\\gamma} T^\\gamma = \\text{const}',
      '\\text{Mayer Relation: } C_p - C_v = R, \\quad \\gamma = \\frac{C_p}{C_v} = 1 + \\frac{2}{f}',
      '\\text{PolyTropic Process } P V^n = \\text{const} \\implies C = C_v + \\frac{R}{1-n}'
    ],
    specialCases: [
      'Isochoric (V = const): W = 0, ΔQ = ΔU = n Cv ΔT',
      'Isobaric (P = const): W = P ΔV = n R ΔT, ΔQ = n Cp ΔT'
    ],
    keyVariables: ['ΔU: Change in internal energy = n Cv ΔT', 'f: Degrees of freedom', 'T1, T2: Source and Sink temps in Kelvin'],
    conditions: 'Temperatures MUST be in Kelvin scale.',
    units: 'Work & Heat (Joules)',
    commonMistakes: 'Using Celsius instead of Kelvin in thermodynamic ratio equations.',
    shortcuts: 'Internal energy U depends ONLY on temperature for ideal gas.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 15. KINETIC THEORY OF GASES ---
  {
    id: 'f-phy-1501',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Kinetic Theory of Gases',
    subtopic: 'Molecular Speeds & Mean Free Path',
    title: 'RMS, Average, Most Probable Speeds & Mean Free Path',
    latex: 'v_{rms} = \\sqrt{\\frac{3RT}{M}}, \\quad v_{avg} = \\sqrt{\\frac{8RT}{\\pi M}}, \\quad v_{mp} = \\sqrt{\\frac{2RT}{M}}, \\quad \\lambda = \\frac{1}{\\sqrt{2}\\pi d^2 n}',
    explanation: 'Statistical velocity distributions of ideal gas molecules and average distance between collisions.',
    derivedFormulas: [
      'v_{rms} : v_{avg} : v_{mp} = \\sqrt{3} : \\sqrt{\\frac{8}{\\pi}} : \\sqrt{2} \\approx 1.732 : 1.595 : 1.414',
      '\\text{Total Energy of n moles } E = \\frac{f}{2} n R T'
    ],
    specialCases: [
      'Monoatomic Gas (f = 3): Cv = 3/2 R, Cp = 5/2 R, γ = 5/3 = 1.67',
      'Diatomic Gas (f = 5 at room temp): Cv = 5/2 R, Cp = 7/2 R, γ = 7/5 = 1.40'
    ],
    keyVariables: ['M: Molar mass in kg/mol', 'd: Molecular diameter', 'n: Number density of molecules'],
    conditions: 'Ideal gas approximation.',
    units: 'Speed (m/s), Mean free path (m)',
    commonMistakes: 'Plugging molar mass M in grams/mol instead of kg/mol in v_rms formula.',
    shortcuts: 'v_rms = √(3P/ρ). Pressure energy density = (2/3) E_vol.',
    difficulty: 'JEE Main',
    isFavorite: false,
  },

  // --- 16. SIMPLE HARMONIC MOTION ---
  {
    id: 'f-phy-1601',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Simple Harmonic Motion',
    subtopic: 'SHM Kinematics, Energy & Pendulum Systems',
    title: 'SHM Displacement, Velocity, Energy & Period',
    latex: 'x = A\\sin(\\omega t + \\phi), \\quad v = \\omega\\sqrt{A^2 - x^2}, \\quad E = \\frac{1}{2}m\\omega^2 A^2, \\quad T_{simple\\;pendulum} = 2\\pi\\sqrt{\\frac{L}{g}}',
    explanation: 'Governs linear restoring force motion F = -kx and mechanical energy conservation.',
    derivedFormulas: [
      '\\text{Spring-Mass Period } T = 2\\pi\\sqrt{\\frac{m}{k}}, \\quad T_{reduced\\;mass} = 2\\pi\\sqrt{\\frac{\\mu}{k}} \\quad \\text{(where } \\mu = \\frac{m_1 m_2}{m_1 + m_2}\\text{)}',
      '\\text{Physical Pendulum Period } T = 2\\pi\\sqrt{\\frac{I}{mgd}}',
      '\\text{Parallel Springs } k_{eq} = k_1 + k_2, \\quad \\text{Series Springs } \\frac{1}{k_{eq}} = \\frac{1}{k_1} + \\frac{1}{k_2}'
    ],
    specialCases: [
      'At mean position (x = 0): Potential energy is min, v_max = ωA.',
      'At extreme position (x = ±A): v = 0, Acceleration a_max = ω²A.'
    ],
    keyVariables: ['A: Amplitude', 'ω: Angular frequency = √(k/m)', 'ϕ: Initial phase angle'],
    conditions: 'Linear restoring force F ∝ -x.',
    units: 'Period (s), Frequency (Hz)',
    commonMistakes: 'Forgetting reduced mass when two masses are connected by a spring on smooth surface.',
    shortcuts: 'When spring is cut into ratio m:n, spring constants become k(m+n)/m and k(m+n)/n.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 17. WAVES ---
  {
    id: 'f-phy-1701',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Waves',
    subtopic: 'String Waves, Doppler Effect & Organ Pipes',
    title: 'Wave Speed, Standing Waves & Doppler Effect',
    latex: 'v_{string} = \\sqrt{\\frac{T}{\\mu}}, \\quad f\' = f\\left(\\frac{v \\pm v_o}{v \\mp v_s}\\right), \\quad f_{open\\;pipe} = n\\frac{v}{2L}, \\quad f_{closed\\;pipe} = (2n-1)\\frac{v}{4L}',
    explanation: 'Calculates transverse wave speed along stretched string, Doppler observed frequency shift, and organ pipe harmonics.',
    derivedFormulas: [
      '\\text{Beat Frequency } f_{beat} = |f_1 - f_2|',
      '\\text{Speed of Sound in Gas } v = \\sqrt{\\frac{\\gamma R T}{M}} = \\sqrt{\\frac{\\gamma P}{\\rho}}',
      '\\text{Sound Intensity Level (dB) } \\beta = 10 \\log_{10}\\left(\\frac{I}{I_0}\\right) \\quad (I_0 = 10^{-12}\\text{ W/m}^2)'
    ],
    specialCases: [
      'Closed pipe produces ONLY odd harmonics (1st, 3rd, 5th...).',
      'End correction for organ pipe: L_eff = L + 0.6 r (one open end) or L + 1.2 r (two open ends).'
    ],
    keyVariables: ['T: Tension in string', 'μ: Mass per unit length', 'v_s, v_o: Speeds of source and observer', 'v: Speed of sound'],
    conditions: 'Doppler equation signs: Upper sign for motion TOWARDS each other.',
    units: 'Frequency (Hz), Intensity (W/m²), Sound level (dB)',
    commonMistakes: 'Using closed pipe fundamental frequency v/(2L) instead of v/(4L).',
    shortcuts: 'For moving observer towards stationary source: f\' = f (1 + v_o/v).',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 18. ELECTROSTATICS ---
  {
    id: 'f-phy-1801',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Electrostatics',
    subtopic: 'Electric Field, Gauss Law & Dipole Dynamics',
    title: 'Electric Field Distributions, Gauss Law & Dipole Torque',
    latex: '\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{q_{enc}}{\\varepsilon_0}, \\quad E_{dipole, axial} = \\frac{1}{4\\pi\\varepsilon_0}\\frac{2p}{r^3}, \\quad E_{sheet} = \\frac{\\sigma}{2\\varepsilon_0}, \\quad \\vec{\\tau} = \\vec{p} \\times \\vec{E}',
    explanation: 'Gauss law field calculation for symmetric charge distributions and dipole field & torque behavior.',
    derivedFormulas: [
      'E_{dipole, eq} = \\frac{1}{4\\pi\\varepsilon_0}\\frac{p}{r^3}, \\quad U_{dipole} = -\\vec{p} \\cdot \\vec{E}',
      '\\text{E inside Solid Uniform Sphere: } E = \\frac{\\rho r}{3\\varepsilon_0} = \\frac{k Q r}{R^3} \\quad (r \\le R)',
      '\\text{E outside Sphere: } E = \\frac{k Q}{r^2} \\quad (r \\ge R)'
    ],
    specialCases: [
      'Electric field inside a hollow conducting shell is strictly ZERO.',
      'Stable equilibrium of dipole: θ = 0° (p parallel to E). Unstable: θ = 180°.'
    ],
    keyVariables: ['p: Dipole moment = q × 2a', 'q_enc: Enclosed charge', 'σ: Surface charge density'],
    conditions: 'Dipole formulas valid for r >> a (short dipole approximation).',
    units: 'Field (N/C or V/m), Flux (N·m²/C)',
    commonMistakes: 'Forgetting factor of 2 between axial field (2kp/r³) and equatorial field (kp/r³).',
    shortcuts: 'Work to rotate dipole from θ1 to θ2: W = pE (cos θ1 - cos θ2).',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 19. ELECTRIC POTENTIAL AND CAPACITANCE ---
  {
    id: 'f-phy-1901',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Electric Potential and Capacitance',
    subtopic: 'Capacitors, Dielectrics & Energy Density',
    title: 'Capacitance, Dielectric Insertion & Stored Energy',
    latex: 'C_0 = \\frac{\\varepsilon_0 A}{d}, \\quad C = K C_0, \\quad U = \\frac{1}{2} C V^2 = \\frac{Q^2}{2C}, \\quad u_E = \\frac{1}{2}\\varepsilon_0 E^2',
    explanation: 'Parallel plate capacitance, dielectric multiplier K, electrostatic stored energy and energy density.',
    derivedFormulas: [
      '\\text{Capacitor with slab of thickness t: } C = \\frac{\\varepsilon_0 A}{d - t + t/K}',
      '\\text{Series Capacitors: } \\frac{1}{C_{eq}} = \\sum \\frac{1}{C_i}, \\quad \\text{Parallel Capacitors: } C_{eq} = \\sum C_i',
      '\\text{Force between plates } F = \\frac{Q^2}{2\\varepsilon_0 A} = \\frac{1}{2} C V^2 / d'
    ],
    specialCases: [
      'Battery Connected during dielectric insertion: V remains constant, Q increases to KQ, U increases to KU.',
      'Battery Disconnected during dielectric insertion: Q remains constant, V drops to V/K, U drops to U/K.'
    ],
    keyVariables: ['A: Plate area', 'd: Plate separation', 'K: Dielectric constant', 'u_E: Energy density (J/m³)'],
    conditions: 'Uniform field approximation (neglecting edge fringing).',
    units: 'Farad (F), Energy (J)',
    commonMistakes: 'Using F = Q²/ (ε0 A) without factor of 1/2 (since each plate acts on charge in field E/2 of other plate).',
    shortcuts: 'When dielectric K is inserted with battery disconnected, mechanical work done by field = U_i - U_f.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 20. CURRENT ELECTRICITY ---
  {
    id: 'f-phy-2001',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Current Electricity',
    subtopic: 'Drift Velocity, Kirchhoff Laws & Potentiometer',
    title: 'Drift Speed, Kirchhoff Laws & Potentiometer Calibration',
    latex: 'v_d = \\frac{e E \\tau}{m}, \\quad I = n e A v_d, \\quad R = \\rho\\frac{L}{A}, \\quad V = E - I r, \\quad \\frac{E_1}{E_2} = \\frac{l_1}{l_2}',
    explanation: 'Microscopic electron conduction relations, battery terminal voltage with internal resistance r, and potentiometer voltage comparison.',
    derivedFormulas: [
      '\\text{Internal Resistance from Potentiometer: } r = R\\left(\\frac{l_1}{l_2} - 1\\right)',
      '\\text{Wheatstone Balance Condition: } \\frac{P}{Q} = \\frac{R}{S}',
      '\\text{Galvanometer to Ammeter Shunt: } S = \\frac{I_g G}{I - I_g}',
      '\\text{Galvanometer to Voltmeter Multiplier: } R = \\frac{V}{I_g} - G'
    ],
    specialCases: [
      'Maximum Power Transfer Theorem: Power delivered to load R is maximum when R = r_internal.',
      'Temperature dependence: R_T = R_0 (1 + α ΔT).'
    ],
    keyVariables: ['τ: Mean relaxation time', 'ρ: Resistivity', 'E: Battery EMF', 'r: Internal resistance', 'G: Galvanometer resistance'],
    conditions: 'Potentiometer draws zero current at balance point (ideal voltmeter).',
    units: 'Resistance (Ω), EMF (V), Current (A)',
    commonMistakes: 'Connecting shunt in series instead of parallel when converting galvanometer to ammeter.',
    shortcuts: 'Equivalent EMF of parallel cells: E_eq = (Σ E_i/r_i) / (Σ 1/r_i).',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 21. MAGNETIC EFFECTS OF CURRENT ---
  {
    id: 'f-phy-2101',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Magnetic Effects of Current',
    subtopic: 'Biot-Savart Law, Ampere Law & Lorentz Force',
    title: 'Biot-Savart Law, Magnetic Fields & Cyclotron Radius',
    latex: 'd\\vec{B} = \\frac{\\mu_0}{4\\pi}\\frac{I d\\vec{l} \\times \\hat{r}}{r^2}, \\quad B_{center, loop} = \\frac{\\mu_0 I}{2R}, \\quad B_{solenoid} = \\mu_0 n I, \\quad r_{cyclotron} = \\frac{m v}{q B}',
    explanation: 'Fundamental magnetic field equations for current elements, loops, solenoids, and charged particle trajectory radius in B field.',
    derivedFormulas: [
      '\\text{Field on Axis of Loop: } B = \\frac{\\mu_0 I R^2}{2(R^2 + x^2)^{3/2}}',
      '\\text{Field due to Infinite Straight Wire: } B = \\frac{\\mu_0 I}{2\\pi d}',
      '\\text{Cyclotron Pitch in Helical Motion: } p = v_{\\parallel} T = v\\cos\\theta \\left(\\frac{2\\pi m}{qB}\\right)'
    ],
    specialCases: [
      'Force between two parallel long wires: F/L = (μ0 I1 I2) / (2π d). Attract if currents parallel, repel if antiparallel.'
    ],
    keyVariables: ['μ0: 4π × 10^-7 T·m/A', 'n: Turns per unit length', 'q: Particle charge'],
    conditions: 'Infinite wire / long solenoid approximations.',
    units: 'Tesla (T) or Gauss (1 T = 10^4 G)',
    commonMistakes: 'Confusing turns per meter n with total turns N in B = μ0 n I.',
    shortcuts: 'Magnetic dipole moment of current loop: M = N I A.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 23. ELECTROMAGNETIC INDUCTION ---
  {
    id: 'f-phy-2301',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Electromagnetic Induction',
    subtopic: 'Faraday Law, Motional EMF & Inductance',
    title: 'Faraday Law, Motional EMF & LR Circuit Growth',
    latex: '\\mathcal{E} = -\\frac{d\\Phi_B}{dt}, \\quad \\mathcal{E}_{rod} = B v L, \\quad \\mathcal{E}_{rotating\\;rod} = \\frac{1}{2}B\\omega L^2, \\quad I(t) = \\frac{V}{R}\\left(1 - e^{-t/\\tau}\\right)',
    explanation: 'Induced EMF from changing flux, cutting magnetic field lines, and inductive growth current with time constant τ = L/R.',
    derivedFormulas: [
      '\\text{Energy Stored in Inductor } U = \\frac{1}{2} L I^2',
      '\\text{Self Inductance of Solenoid } L = \\frac{\\mu_0 N^2 A}{l} = \\mu_0 n^2 A l',
      '\\text{Mutual Inductance } M = k\\sqrt{L_1 L_2} \\quad (0 \\le k \\le 1)'
    ],
    specialCases: [
      'Discharging LR circuit: I(t) = I_0 e^(-t/τ).',
      'At t = 0 (switch closed), inductor acts as OPEN CIRCUIT. At t → ∞ (steady state), inductor acts as SHORT CIRCUIT (zero resistance wire).'
    ],
    keyVariables: ['Φ_B: Magnetic flux = B A cos θ', 'τ: Time constant = L/R', 'L: Self inductance (Henry)'],
    conditions: 'Lenz law dictates negative sign (opposes cause of flux change).',
    units: 'Henry (H), Weber (Wb)',
    commonMistakes: 'Assuming inductor voltage drops to zero immediately after opening switch.',
    shortcuts: 'Induced charge flow Q = ΔΦ / R (independent of time taken!).',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 24. ALTERNATING CURRENT ---
  {
    id: 'f-phy-2401',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Alternating Current',
    subtopic: 'LCR Circuit, Resonance & Power Factor',
    title: 'Impedance, LCR Resonance & Power Factor',
    latex: 'Z = \\sqrt{R^2 + (X_L - X_C)^2}, \\quad \\omega_0 = \\frac{1}{\\sqrt{LC}}, \\quad \\tan\\phi = \\frac{X_L - X_C}{R}, \\quad P_{avg} = V_{rms} I_{rms} \\cos\\phi',
    explanation: 'Series LCR circuit impedance, sharp resonance frequency ω0 where XL = XC, and average dissipated power.',
    derivedFormulas: [
      'X_L = \\omega L, \\quad X_C = \\frac{1}{\\omega C}, \\quad \\text{Quality Factor } Q = \\frac{\\omega_0 L}{R} = \\frac{1}{R}\\sqrt{\\frac{L}{C}}',
      'V_{rms} = \\frac{V_0}{\\sqrt{2}}, \\quad I_{rms} = \\frac{I_0}{\\sqrt{2}}'
    ],
    specialCases: [
      'At Resonance (XL = XC): Impedance is minimum Z_min = R, Current is maximum I_max = V/R, Power factor cos ϕ = 1 (purely resistive).'
    ],
    keyVariables: ['Z: Impedance (Ω)', 'XL, XC: Inductive and Capacitive Reactances', 'cos ϕ: Power factor'],
    conditions: 'Sinusoidal AC source.',
    units: 'Reactance & Impedance (Ω), Quality factor (dimensionless)',
    commonMistakes: 'Adding peak voltages algebraically V = VR + VL + VC instead of phasors V = √(VR² + (VL - VC)²).',
    shortcuts: 'Wattless current component: I_wattless = I_rms sin ϕ.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 26. RAY OPTICS ---
  {
    id: 'f-phy-2601',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Ray Optics',
    subtopic: 'Mirror, Lens Maker Formula & Prism Dispersion',
    title: 'Mirror Formula, Lens Maker & Minimum Deviation Prism',
    latex: '\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}, \\quad \\frac{1}{f} = (\\mu - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right), \\quad \\mu = \\frac{\\sin\\left(\\frac{A + \\delta_m}{2}\\right)}{\\sin\\left(\\frac{A}{2}\\right)}',
    explanation: 'Core equations for spherical mirrors, thin lenses using Lens Maker formula, and prism refractive index from minimum deviation δ_m.',
    derivedFormulas: [
      '\\text{Lens Formula: } \\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}, \\quad \\text{Power } P = \\frac{1}{f(m)}',
      '\\text{Combination of Lenses in contact: } P_{eq} = P_1 + P_2 \\implies \\frac{1}{f_{eq}} = \\frac{1}{f_1} + \\frac{1}{f_2}',
      '\\text{Apparent Depth } d\' = \\frac{d}{\\mu}, \\quad \\text{Critical Angle for TIR } \\sin\\theta_c = \\frac{1}{\\mu}'
    ],
    specialCases: [
      'Silvered Lens System: Acts as an effective mirror of power P_eq = 2 P_lens + P_mirror.',
      'Thin Prism Deviation (small A): δ = (μ - 1) A.'
    ],
    keyVariables: ['u, v, f: Object dist, image dist, focal length with Cartesian sign convention', 'R1, R2: Radii of curvature'],
    conditions: 'Paraxial rays assumption.',
    units: 'Power in Dioptres (D = m^-1)',
    commonMistakes: 'Forgetting Cartesian sign convention: Real object u is ALWAYS negative.',
    shortcuts: 'For silvered convex lens with back surface silvered: 1/F_eq = 2/f_l + 1/f_m.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 27. WAVE OPTICS ---
  {
    id: 'f-phy-2701',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Wave Optics',
    subtopic: 'Young Double Slit, Diffraction & Polarization',
    title: 'YDSE Fringe Width, Path Difference & Malus Law',
    latex: '\\beta = \\frac{\\lambda D}{d}, \\quad I = 4I_0 \\cos^2\\left(\\frac{\\phi}{2}\\right), \\quad \\Delta x_{bright} = n\\lambda, \\quad I = I_0 \\cos^2\\theta \\quad \\text{(Malus Law)}',
    explanation: 'Interference fringe spacing in YDSE, intensity distribution, and polarization intensity transmitted through analyzer.',
    derivedFormulas: [
      '\\text{Fringe Shift due to Thin Sheet } \\Delta y = \\frac{(\\mu - 1)t D}{d}',
      '\\text{Single Slit Diffraction Minima: } a \\sin\\theta = n\\lambda',
      '\\text{Brewster Law for Polarization: } \\tan i_p = \\mu'
    ],
    specialCases: [
      'If two interfering waves have different intensities I1 and I2: I_max = (√I1 + √I2)², I_min = (√I1 - √I2)².'
    ],
    keyVariables: ['λ: Wavelength', 'D: Screen distance', 'd: Slit separation', 't: Sheet thickness', 'i_p: Brewster polarization angle'],
    conditions: 'Coherent sources in YDSE.',
    units: 'Fringe width β in meters or mm',
    commonMistakes: 'Confusing YDSE maxima condition (d sin θ = nλ) with single slit diffraction MINIMA condition (a sin θ = nλ).',
    shortcuts: 'Fringe shift equals N fringes where N = (μ - 1)t / λ.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 28. DUAL NATURE ---
  {
    id: 'f-phy-2801',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Dual Nature',
    subtopic: 'Photoelectric Effect & de Broglie Wavelength',
    title: 'Einstein Photoelectric Equation & Matter Wavelength',
    latex: 'K_{max} = e V_s = h \\nu - \\Phi, \\quad \\lambda_{de\\;Broglie} = \\frac{h}{p} = \\frac{h}{\\sqrt{2m K}} = \\frac{h}{\\sqrt{2 m q V}}',
    explanation: 'Photoelectric photon energy equation and de Broglie matter wave expression for accelerated particles.',
    derivedFormulas: [
      '\\text{Electron Wavelength } \\lambda_e = \\frac{12.27}{\\sqrt{V}} \\text{ \\AA}',
      '\\text{Proton Wavelength } \\lambda_p = \\frac{0.286}{\\sqrt{V}} \\text{ \\AA}',
      '\\text{Gas Molecule Wavelength } \\lambda = \\frac{h}{\\sqrt{3 m k_B T}}'
    ],
    specialCases: [
      'Threshold Wavelength λ_0 = hc / Φ. Photoelectric emission occurs ONLY if λ ≤ λ_0.'
    ],
    keyVariables: ['h: Planck constant 6.626 × 10^-34 J·s', 'V_s: Stopping potential', 'Φ: Work function'],
    conditions: 'Non-relativistic particle speeds.',
    units: 'Wavelength in Angstroms (1 Å = 10^-10 m), Potential in Volts',
    commonMistakes: 'Assuming photocurrent increases with photon frequency. Photocurrent depends ONLY on light intensity (for ν > ν0).',
    shortcuts: 'hc ≈ 1240 eV·nm or 12400 eV·Å.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 29. ATOMIC PHYSICS ---
  {
    id: 'f-phy-2901',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Atomic Physics',
    subtopic: 'Bohr Model & Hydrogen Spectral Series',
    title: 'Bohr Radius, Energy Levels & Rydberg Formula',
    latex: 'r_n = 0.529 \\frac{n^2}{Z} \\text{ \\AA}, \\quad E_n = -13.6 \\frac{Z^2}{n^2} \\text{ eV}, \\quad \\frac{1}{\\lambda} = R Z^2 \\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right)',
    explanation: 'Bohr hydrogenic atom energy levels, orbital radius quantization, and emission spectrum Rydberg formula.',
    derivedFormulas: [
      '\\text{Velocity of electron in n-th orbit: } v_n = 2.18 \\times 10^6 \\frac{Z}{n} \\text{ m/s}',
      '\\text{Time period of electron: } T_n \\propto \\frac{n^3}{Z^2}',
      '\\text{Lyman Series (UV): } n_1 = 1, \\quad \\text{Balmer Series (Visible): } n_1 = 2, \\quad \\text{Paschen (IR): } n_1 = 3'
    ],
    specialCases: [
      'Max number of spectral lines emitted from level n to ground state: N = n(n-1)/2.'
    ],
    keyVariables: ['Z: Atomic number', 'n: Principal quantum number', 'R: Rydberg constant = 1.097 × 10^7 m^-1'],
    conditions: 'Valid ONLY for single-electron hydrogenic ions (H, He+, Li2+).',
    units: 'Energy in eV, Radius in Å',
    commonMistakes: 'Applying Bohr formula to multi-electron atoms without shielding correction.',
    shortcuts: 'Ionization energy = +13.6 Z² eV.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 30. NUCLEAR PHYSICS ---
  {
    id: 'f-phy-3001',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Nuclear Physics',
    subtopic: 'Mass Defect, Radioactive Decay & Q-Value',
    title: 'Nuclear Radius, Binding Energy & Radioactive Decay Law',
    latex: 'R = R_0 A^{1/3}, \\quad N(t) = N_0 e^{-\\lambda t}, \\quad T_{1/2} = \\frac{\\ln 2}{\\lambda} = \\frac{0.693}{\\lambda}, \\quad Q = (m_{reactants} - m_{products}) c^2',
    explanation: 'Nuclear size scaling with mass number A, exponential radioactive decay law, half-life relation, and nuclear Q-value.',
    derivedFormulas: [
      '\\text{Mean Life } \\tau = \\frac{1}{\\lambda} = 1.44 T_{1/2}',
      '\\text{Activity } A(t) = \\lambda N(t) = A_0 e^{-\\lambda t}',
      '\\text{Binding Energy } BE = \\Delta m (931.5 \\text{ MeV/amu})'
    ],
    specialCases: [
      'Alpha decay Q-value: Q = (M_parent - M_daughter - M_alpha) × 931.5 MeV.',
      'Kinetic energy of alpha particle: K_alpha = Q × (A - 4)/A.'
    ],
    keyVariables: ['R_0: 1.2 fm (1.2 × 10^-15 m)', 'A: Mass number', 'λ: Decay constant'],
    conditions: 'Spontaneous nuclear decay.',
    units: 'Half-life (s / years), Activity in Becquerel (1 Bq = 1 decay/s) or Curie (1 Ci = 3.7 × 10^10 Bq)',
    commonMistakes: 'Confusing mean life τ with half-life T_1/2.',
    shortcuts: 'Fraction remaining after n half-lives: N/N_0 = (1/2)^n.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 31. SEMICONDUCTORS ---
  {
    id: 'f-phy-3101',
    exam: 'Both',
    subject: 'Physics',
    chapter: 'Semiconductors',
    subtopic: 'Diode, Zener Diode & Logic Gates',
    title: 'Intrinsic Charge Carrier, Zener Voltage & De Morgan Laws',
    latex: 'n_i^2 = n_e n_h, \\quad I = I_e + I_h, \\quad \\overline{A \\cdot B} = \\bar{A} + \\bar{B}, \\quad \\overline{A + B} = \\bar{A} \\cdot \\bar{B}',
    explanation: 'Mass action law for semiconductors in thermal equilibrium and fundamental Boolean algebra De Morgan theorems.',
    derivedFormulas: [
      '\\text{NAND as Universal Gate: } A \\text{ NAND } A = \\bar{A}, \\quad (A \\text{ NAND } B) \\text{ NAND } (A \\text{ NAND } B) = A \\cdot B',
      '\\text{Zener Voltage Regulation: } I_Z = I_L + I_R, \\quad V_{out} = V_Z'
    ],
    specialCases: [
      'N-type semiconductor: n_e >> n_h, majority carriers are electrons.',
      'P-type semiconductor: n_h >> n_e, majority carriers are holes.'
    ],
    keyVariables: ['n_i: Intrinsic carrier density', 'n_e, n_h: Electron and hole concentrations'],
    conditions: 'Thermal equilibrium state.',
    units: 'Carrier density in m^-3',
    commonMistakes: 'Thinking semiconductor becomes charged upon doping. Semiconductor remains electrically NEUTRAL overall.',
    shortcuts: 'NOR and NAND are universal gates.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // =========================================================================
  // CHEMISTRY — PHYSICAL, ORGANIC, INORGANIC
  // =========================================================================

  // --- PHYSICAL CHEMISTRY: 1. MOLE CONCEPT ---
  {
    id: 'f-chem-101',
    exam: 'Both',
    subject: 'Chemistry',
    category: 'Physical',
    chapter: 'Mole Concept',
    subtopic: 'Stoichiometry & Concentration Terms',
    title: 'Molarity, Molality, Normality & Dilution Formula',
    latex: 'M = \\frac{n_{solute}}{V_{soln}(L)}, \\quad m = \\frac{n_{solute}}{W_{solvent}(kg)}, \\quad N = M \\times \\text{n-factor}, \\quad M_1 V_1 + M_2 V_2 = M_f V_f',
    explanation: 'Core solution concentration definitions and dilution / mixing relations.',
    derivedFormulas: [
      '\\text{Relation between Molarity and Molality: } m = \\frac{1000 M}{1000 d - M M_{solute}}',
      '\\text{Mole Fraction } \chi_A = \\frac{n_A}{n_A + n_B}',
      '\\text{ppm} = \\frac{\\text{Mass of solute}}{\\text{Total Mass of solution}} \\times 10^6'
    ],
    specialCases: [
      'Molality and Mole fraction are independent of temperature (mass-based).',
      'Molarity and Normality decrease with increasing temperature (volume expands).'
    ],
    keyVariables: ['d: Density of solution in g/mL', 'n-factor: Valency / change in oxidation number / replaceable H+ or OH-'],
    conditions: 'Solutions under thermal stability.',
    units: 'M (mol/L), m (mol/kg), N (eq/L)',
    commonMistakes: 'Using total volume of solution instead of solvent mass in denominator for Molality calculation.',
    shortcuts: 'Molarity = (% w/w × 10 × d) / M_solute.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- PHYSICAL CHEMISTRY: 2. ATOMIC STRUCTURE ---
  {
    id: 'f-chem-201',
    exam: 'Both',
    subject: 'Chemistry',
    category: 'Physical',
    chapter: 'Atomic Structure',
    subtopic: 'Bohr Model, Quantum Numbers & Heisenberg Principle',
    title: 'Rydberg Formula, Quantum Numbers & Uncertainty Principle',
    latex: '\\bar{\\nu} = \\frac{1}{\\lambda} = R_H Z^2 \\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right), \\quad \\Delta x \\cdot \\Delta p \\ge \\frac{h}{4\\pi}, \\quad \\mu_s = \\sqrt{n(n+2)} \\text{ BM}',
    explanation: 'Hydrogen wave number spectral equation, Heisenberg uncertainty bounds, and spin-only magnetic moment.',
    derivedFormulas: [
      '\\text{Orbital Angular Momentum } L = \\sqrt{l(l+1)} \\frac{h}{2\\pi}',
      '\\text{Spin Angular Momentum } S = \\sqrt{s(s+1)} \\frac{h}{2\\pi}'
    ],
    specialCases: [
      'Max electrons in a subshell = 2(2l + 1).',
      'Radial nodes = n - l - 1. Angular nodes = l. Total nodes = n - 1.'
    ],
    keyVariables: ['R_H: 109,677 cm^-1', 'BM: Bohr Magneton = 9.27 × 10^-24 A·m²', 'n: Unpaired electrons count'],
    conditions: 'Spin-only formula valid when orbital contribution is quenched.',
    units: 'Wave number in cm^-1, Magnetic moment in BM',
    commonMistakes: 'Counting total nodes instead of radial nodes in quantum mechanical graphs.',
    shortcuts: 'Spin-only magnetic moment for n = 1: 1.73 BM, n = 2: 2.83 BM, n = 3: 3.87 BM, n = 4: 4.90 BM, n = 5: 5.92 BM.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- PHYSICAL CHEMISTRY: 3. STATES OF MATTER ---
  {
    id: 'f-chem-301',
    exam: 'Both',
    subject: 'Chemistry',
    category: 'Physical',
    chapter: 'States of Matter',
    subtopic: 'Real Gases & van der Waals Equation',
    title: 'van der Waals Equation & Critical Constants',
    latex: '\\left(P + \\frac{a n^2}{V^2}\\right)(V - n b) = n R T, \\quad P_c = \\frac{a}{27 b^2}, \\quad V_c = 3b, \\quad T_c = \\frac{8a}{27 R b}',
    explanation: 'Modifies ideal gas law for real gases accounting for intermolecular attraction (a) and finite molecular volume (b).',
    derivedFormulas: [
      '\\text{Compressibility Factor } Z = \\frac{P V_m}{R T}',
      '\\text{Boyle Temperature } T_b = \\frac{a}{R b}',
      '\\text{Inversion Temperature } T_i = \\frac{2a}{R b} = 2 T_b'
    ],
    specialCases: [
      'At Low Pressure: Z = 1 - a / (V_m R T) < 1 (attractive forces dominate).',
      'At High Pressure: Z = 1 + P b / (R T) > 1 (repulsive forces dominate).'
    ],
    keyVariables: ['a: Measure of intermolecular attraction (atm L²/mol²)', 'b: Excluded volume = 4 × (4/3 π r³) N_A (L/mol)'],
    conditions: 'Compressibility Z = 1 for ideal gas.',
    units: 'a in atm·L²/mol², b in L/mol',
    commonMistakes: 'Confusing Boyle temperature T_b = a/(Rb) with critical temperature T_c = 8a/(27Rb).',
    shortcuts: 'Critical compressibility factor Z_c = P_c V_c / (R T_c) = 3/8 = 0.375 for all van der Waals gases.',
    difficulty: 'JEE Advanced',
    isFavorite: true,
  },

  // --- PHYSICAL CHEMISTRY: 4. THERMODYNAMICS ---
  {
    id: 'f-chem-401',
    exam: 'Both',
    subject: 'Chemistry',
    category: 'Physical',
    chapter: 'Thermodynamics',
    subtopic: 'Enthalpy, Gibbs Energy & Spontaneity',
    title: 'Gibbs Free Energy & Reaction Spontaneity',
    latex: '\\Delta G = \\Delta H - T \\Delta S, \\quad \\Delta G^\\circ = -R T \\ln K_{eq}, \\quad \\Delta S_{univ} = \\Delta S_{sys} + \\Delta S_{surr} > 0',
    explanation: 'Criterion for thermodynamic spontaneity at constant temperature and pressure.',
    derivedFormulas: [
      '\\text{van \'t Hoff Equation: } \\frac{d \\ln K}{dT} = \\frac{\\Delta H^\\circ}{R T^2} \\implies \\ln\\left(\\frac{K_2}{K_1}\\right) = \\frac{\\Delta H^\\circ}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)',
      '\\text{Enthalpy-Internal Energy Relation: } \\Delta H = \\Delta U + \\Delta n_g R T'
    ],
    specialCases: [
      'ΔG < 0: Spontaneous forward reaction.',
      'ΔG = 0: System at chemical equilibrium.',
      'ΔG > 0: Non-spontaneous (spontaneous in reverse direction).'
    ],
    keyVariables: ['ΔH: Change in Enthalpy', 'ΔS: Change in Entropy', 'Δn_g: Moles of gaseous products - Moles of gaseous reactants'],
    conditions: 'Temperature MUST be in Kelvin.',
    units: 'ΔG & ΔH in kJ/mol, ΔS in J/(mol·K)',
    commonMistakes: 'Adding ΔH (kJ) and TΔS (J) directly without converting units to same scale!',
    shortcuts: 'Exothermic (ΔH < 0) with entropy increase (ΔS > 0) is spontaneous at ALL temperatures.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- PHYSICAL CHEMISTRY: 5. CHEMICAL EQUILIBRIUM ---
  {
    id: 'f-chem-501',
    exam: 'Both',
    subject: 'Chemistry',
    category: 'Physical',
    chapter: 'Chemical Equilibrium',
    subtopic: 'Equilibrium Constants Kp, Kc & Le Chatelier',
    title: 'Kp vs Kc Relation & Degree of Dissociation',
    latex: 'K_p = K_c (R T)^{\\Delta n_g}, \\quad \\alpha = \\frac{D - d}{(n - 1) d} = \\frac{M_t - M_o}{(n - 1) M_o}',
    explanation: 'Relates pressure and concentration equilibrium constants and calculates degree of dissociation α from vapor density.',
    derivedFormulas: [
      '\\text{Reaction Quotient Q: } Q < K \\implies \\text{Forward}, \\quad Q > K \\implies \\text{Backward}',
      '\\text{If reaction multiplied by n: } K_{new} = K^{n}',
      '\\text{If reaction reversed: } K_{new} = 1/K'
    ],
    specialCases: [
      'If Δn_g = 0: Kp = Kc (units cancel out).',
      'Le Chatelier: Increasing pressure shifts equilibrium towards side with FEWER gas moles.'
    ],
    keyVariables: ['R: 0.0821 L·atm/(mol·K) or 8.314 J/(mol·K)', 'D: Theoretical vapor density', 'd: Observed vapor density'],
    conditions: 'Valid at constant temperature in closed system.',
    units: 'Kp (atm^Δn_g), Kc (M^Δn_g)',
    commonMistakes: 'Including pure solids and pure liquids in Kc / Kp equilibrium expressions.',
    shortcuts: 'Addition of inert gas at constant VOLUME causes NO SHIFT in equilibrium.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- PHYSICAL CHEMISTRY: 6. IONIC EQUILIBRIUM ---
  {
    id: 'f-chem-601',
    exam: 'Both',
    subject: 'Chemistry',
    category: 'Physical',
    chapter: 'Ionic Equilibrium',
    subtopic: 'pH, Buffer Solutions & Solubility Product',
    title: 'Henderson-Hasselbalch Buffer Equation & Ksp',
    latex: '\\text{pH} = \\text{p}K_a + \\log\\left(\\frac{[\\text{Salt}]}{[\\text{Acid}]}\\right), \\quad \\text{pOH} = \\text{p}K_b + \\log\\left(\\frac{[\\text{Salt}]}{[\\text{Base}]}\\right), \\quad K_{sp} = x^x y^y S^{x+y}',
    explanation: 'Calculates buffer pH for weak acid/base mixtures and solubility product Ksp for sparingly soluble salt A_x B_y.',
    derivedFormulas: [
      '\\text{pH of Weak Acid: } \\text{pH} = \\frac{1}{2}(\\text{p}K_a - \\log c)',
      '\\text{pH of Salt of Weak Acid & Strong Base: } \\text{pH} = 7 + \\frac{1}{2}(\\text{p}K_a + \\log c)',
      '\\text{pH of Salt of Weak Acid & Weak Base: } \\text{pH} = 7 + \\frac{1}{2}(\\text{p}K_a - \\text{p}K_b)',
      'K_w = K_a \\cdot K_b = 10^{-14} \\quad (\\text{at } 25^\\circ\\text{C})'
    ],
    specialCases: [
      'Precipitation occurs ONLY if Ionic Product Q_sp > K_sp.',
      'Common Ion Effect decreases solubility S of sparingly soluble salt.'
    ],
    keyVariables: ['c: Salt / Acid concentration in M', 'S: Solubility in mol/L', 'K_w: Autoionization constant of water'],
    conditions: 'Valid for dilute solutions at 25°C.',
    units: 'pH is dimensionless, Ksp in (mol/L)^(x+y)',
    commonMistakes: 'Forgetting water contribution [H+] = 10^-7 M when calculating pH of extremely dilute acid (e.g. 10^-8 M HCl).',
    shortcuts: 'Maximum buffer capacity occurs when [Salt] = [Acid] (pH = pKa).',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- PHYSICAL CHEMISTRY: 8. ELECTROCHEMISTRY ---
  {
    id: 'f-chem-801',
    exam: 'Both',
    subject: 'Chemistry',
    category: 'Physical',
    chapter: 'Electrochemistry',
    subtopic: 'Nernst Equation, Kohlrausch Law & Faraday Laws',
    title: 'Nernst Cell Potential, Molar Conductivity & Faraday Laws',
    latex: 'E_{cell} = E^\\circ_{cell} - \\frac{0.0591}{n}\\log Q, \\quad \\Lambda_m = \\frac{\\kappa \\times 1000}{M}, \\quad w = Z I t = \\frac{E_{eq}}{96500} I t',
    explanation: 'Cell EMF calculation under non-standard conditions, molar conductivity from specific conductance κ, and mass deposited by electrolysis.',
    derivedFormulas: [
      '\\Delta G^\\circ = -n F E^\\circ_{cell}, \\quad E^\\circ_{cell} = \\frac{0.0591}{n}\\log K_{eq}',
      '\\text{Kohlrausch Law: } \\Lambda_m^0(A_x B_y) = x \\lambda_A^0 + y \\lambda_B^0'
    ],
    specialCases: [
      'Concentration Cell (E°_cell = 0): E_cell = -(0.0591/n) log (C1/C2). Spontaneous if C2 > C1.'
    ],
    keyVariables: ['F: Faraday constant = 96,485 C/mol e-', 'n: Number of electrons transferred', 'κ: Specific conductance (S cm^-1)'],
    conditions: '0.0591 constant valid at T = 298 K (25°C).',
    units: 'E (Volts), Λ_m (S cm² mol^-1), w (grams)',
    commonMistakes: 'Forgetting to reverse sign when flipping half-reaction oxidation/reduction potential.',
    shortcuts: '1 Faraday (96500 C) deposits 1 Gram-Equivalent weight of any substance.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- PHYSICAL CHEMISTRY: 9. CHEMICAL KINETICS ---
  {
    id: 'f-chem-901',
    exam: 'Both',
    subject: 'Chemistry',
    category: 'Physical',
    chapter: 'Chemical Kinetics',
    subtopic: 'Integrated Rate Laws & Arrhenius Equation',
    title: 'Zero/First Order Kinetics & Arrhenius Activation Energy',
    latex: 'k_{1st} = \\frac{2.303}{t}\\log\\left(\\frac{[A]_0}{[A]_t}\\right), \\quad t_{1/2, 1st} = \\frac{0.693}{k}, \\quad k = A e^{-E_a / R T} \\implies \\log\\left(\\frac{k_2}{k_1}\\right) = \\frac{E_a}{2.303 R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)',
    explanation: 'First-order integrated rate law, constant half-life property, and Arrhenius activation energy temperature dependence.',
    derivedFormulas: [
      '\\text{Zero Order: } [A]_t = [A]_0 - k t, \\quad t_{1/2, 0th} = \\frac{[A]_0}{2k}',
      '\\text{General Half-Life Relation: } t_{1/2} \\propto \\frac{1}{[A]_0^{n-1}} \\quad (n = \\text{reaction order})'
    ],
    specialCases: [
      'Pseudo First-Order Reaction: High excess reagent concentration remains effectively constant (e.g. ester hydrolysis in water).'
    ],
    keyVariables: ['k: Rate constant', '[A]_0: Initial concentration', 'E_a: Activation energy (J/mol)', 'A: Pre-exponential frequency factor'],
    conditions: 'Valid for elementary or simple step-wise reactions.',
    units: 'k for 1st order (s^-1), k for 0th order (M·s^-1), E_a (kJ/mol)',
    commonMistakes: 'Confusing order of reaction (experimental) with molecularity (theoretical elementary collisions count).',
    shortcuts: 'For 1st order reaction: t_99.9% ≈ 10 × t_1/2.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- PHYSICAL CHEMISTRY: 10. SOLUTIONS ---
  {
    id: 'f-chem-1001',
    exam: 'Both',
    subject: 'Chemistry',
    category: 'Physical',
    chapter: 'Solutions',
    subtopic: 'Raoult Law & Colligative Properties',
    title: 'Raoult Law, Boiling Point Elevation, Freezing Depression & Osmotic Pressure',
    latex: '\\frac{P^0 - P}{P^0} = i X_{solute}, \\quad \\Delta T_b = i K_b m, \\quad \\Delta T_f = i K_f m, \\quad \\pi = i C R T',
    explanation: 'Four colligative properties governed by van \'t Hoff dissociation factor i and solute molality / concentration.',
    derivedFormulas: [
      '\\text{van \'t Hoff Factor for Dissociation: } i = 1 + (n - 1)\\alpha',
      '\\text{van \'t Hoff Factor for Association: } i = 1 + \\left(\\frac{1}{n} - 1\\right)\\alpha',
      '\\text{Raoult Law for Volatile Binary Mixture: } P_{total} = P_A^0 X_A + P_B^0 X_B'
    ],
    specialCases: [
      'Positive Deviation from Raoult Law: A-B interactions weaker than A-A and B-B (ΔH_mix > 0, ΔV_mix > 0, e.g. Ethanol + Acetone).',
      'Negative Deviation: A-B interactions stronger (ΔH_mix < 0, ΔV_mix < 0, e.g. Chloroform + Acetone).'
    ],
    keyVariables: ['i: van \'t Hoff factor', 'K_b: Ebullioscopic constant (K kg/mol)', 'K_f: Cryoscopic constant (K kg/mol)', 'π: Osmotic pressure (atm)'],
    conditions: 'Dilute ideal solutions.',
    units: 'ΔT in K or °C, π in atm or Pa',
    commonMistakes: 'Forgetting van \'t Hoff factor i for ionic electrolytes like NaCl (i = 2) or BaCl2 (i = 3).',
    shortcuts: 'Isotonic solutions have equal osmotic pressure: C1 T1 = C2 T2.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- PHYSICAL CHEMISTRY: 11. SOLID STATE ---
  {
    id: 'f-chem-1101',
    exam: 'Both',
    subject: 'Chemistry',
    category: 'Physical',
    chapter: 'Solid State',
    subtopic: 'Unit Cell Density & Radius Ratios',
    title: 'Unit Cell Density, Packing Efficiency & Radius Ratios',
    latex: '\\rho = \\frac{Z \\cdot M}{a^3 \\cdot N_A}, \\quad r_{fcc} = \\frac{a}{2\\sqrt{2}}, \\quad r_{bcc} = \\frac{\\sqrt{3} a}{4}, \\quad r_{sc} = \\frac{a}{2}',
    explanation: 'Calculates crystal lattice density from effective atom count Z and unit cell edge length a.',
    derivedFormulas: [
      '\\text{Packing Fraction: } SC = 52.4\\%, \\quad BCC = 68\\%, \\quad FCC/HCP = 74\\%',
      '\\text{Tetrahedral Void Radius: } r_{void} = 0.225 R_{sphere}',
      '\\text{Octahedral Void Radius: } r_{void} = 0.414 R_{sphere}'
    ],
    specialCases: [
      'Radius Ratio Rules: 0.225 - 0.414 (Tetrahedral CN=4), 0.414 - 0.732 (Octahedral CN=6), 0.732 - 1.000 (Cubic CN=8).'
    ],
    keyVariables: ['Z: Number of formula units per cell (SC=1, BCC=2, FCC=4)', 'a: Edge length', 'M: Molar mass'],
    conditions: 'Crystalline cubic lattices.',
    units: 'Density in g/cm³ (ensure a is in cm)',
    commonMistakes: 'Plugging edge length a in pm without converting to cm (1 pm = 10^-10 cm) before cubing a³.',
    shortcuts: 'In FCC unit cell: 4 Octahedral Voids (at body center & edge centers) and 8 Tetrahedral Voids (2 on each body diagonal).',
    difficulty: 'JEE Main',
    isFavorite: false,
  },

  // --- ORGANIC CHEMISTRY: 1. GOC & ISOMERISM ---
  {
    id: 'f-chem-1201',
    exam: 'Both',
    subject: 'Chemistry',
    category: 'Organic',
    chapter: 'General Organic Chemistry',
    subtopic: 'Electronic Effects & Reaction Mechanisms',
    title: 'Carbocation, Carbanion, Radical Stability & Acidity Trends',
    latex: '\\text{Carbocation Stability: } 3^\\circ > 2^\\circ > 1^\\circ > \\text{CH}_3^+, \\quad \\text{Carbanion Stability: } \\text{CH}_3^- > 1^\\circ > 2^\\circ > 3^\\circ',
    explanation: 'Stability orders governed by Hyperconjugation (α-H count), Inductive (+I/-I), and Resonance (+M/-M) effects.',
    derivedFormulas: [
      '\\text{Acidity: } -M, -I \\text{ increase acidity}; \\quad +M, +I \\text{ decrease acidity}',
      '\\text{Basicity: } +M, +I \\text{ increase basicity}; \\quad -M, -I \\text{ decrease basicity}',
      '\\text{Optical Activity / Stereoisomers count } = 2^n \\quad (n = \\text{chiral centers, asymmetric})'
    ],
    specialCases: [
      'Aromaticity (Hückel Rule): Planar, fully conjugated cyclic ring with (4n + 2) π electrons is aromatic.',
      'Antiaromatic: Planar, fully conjugated cyclic ring with 4n π electrons (highly unstable).'
    ],
    keyVariables: ['n: Number of chiral centers', 'α-H: Hydrogens adjacent to sp² carbocation / alkene'],
    conditions: 'Standard organic electronic displacement principles.',
    units: 'pKa scale for acidity (Lower pKa = Stronger Acid)',
    commonMistakes: 'Confusing basicity order of aliphatic amines in aqueous medium: 2° > 1° > 3° > NH3 (for methyl) due to combined inductive + hydration + steric hindrance.',
    shortcuts: 'Resonance (+M/-M) dominates Inductive (+I/-I) EXCEPT for Halogens where -I dominates +M.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- ORGANIC CHEMISTRY: 2. HYDROCARBONS & HALOALKANES ---
  {
    id: 'f-chem-1301',
    exam: 'Both',
    subject: 'Chemistry',
    category: 'Organic',
    chapter: 'Haloalkanes and Haloarenes',
    subtopic: 'SN1 vs SN2 & E1 vs E2 Mechanisms',
    title: 'SN1 vs SN2 Substitution & Elimination Rules',
    latex: '\\text{SN1 Rate} = k[R-X] \\quad (3^\\circ > 2^\\circ > 1^\\circ), \\quad \\text{SN2 Rate} = k[R-X][Nu^-] \\quad (1^\\circ > 2^\\circ > 3^\\circ)',
    explanation: 'Nucleophilic substitution mechanisms: SN1 proceeds via carbocation (racemization), SN2 via backside attack (Walden inversion).',
    derivedFormulas: [
      '\\text{Saytzeff Rule: } \\text{More substituted alkene is major elimination product}',
      '\\text{Hofmann Rule: } \\text{Less substituted alkene is major product with bulky bases (e.g. t-BuOK)}'
    ],
    specialCases: [
      'Polar Protic Solvents (Water, Alcohols, AcOH) favor SN1.',
      'Polar Aprotic Solvents (DMSO, DMF, Acetone) favor SN2.'
    ],
    keyVariables: ['Nu^-: Nucleophile', 'R-X: Alkyl halide leaving group (I- > Br- > Cl- > F-)'],
    conditions: 'Steric hindrance strongly inhibits SN2.',
    units: 'Rate in M/s',
    commonMistakes: 'Expecting SN2 on tertiary alkyl halides or aryl/vinyl halides (strictly prohibited due to steric/resonance).',
    shortcuts: 'Allylic and Benzylic halides undergo BOTH rapid SN1 (stable carbocation) and SN2 (unhindered π transition state).',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- ORGANIC CHEMISTRY: 3. ALDEHYDES & KETONES ---
  {
    id: 'f-chem-1401',
    exam: 'Both',
    subject: 'Chemistry',
    category: 'Organic',
    chapter: 'Aldehydes and Ketones',
    subtopic: 'Aldol Condensation & Cannizzaro Reaction',
    title: 'Aldol Condensation, Cannizzaro & Named Tests',
    latex: '\\text{Aldol: } R-CH_2-CHO \\xrightarrow{dil. NaOH} R-CH_2-CH(OH)-CH(R)-CHO \\xrightarrow{\\Delta} R-CH_2-CH=C(R)-CHO',
    explanation: 'Aldol requires α-hydrogen. Cannizzaro occurs for aldehydes WITHOUT α-hydrogen using conc. NaOH (disproportionation).',
    derivedFormulas: [
      '\\text{Cannizzaro: } 2 HCHO \\xrightarrow{conc. NaOH} CH_3OH + HCOONa',
      '\\text{Tollens Test (Silver Mirror): } RCHO + 2[Ag(NH_3)_2]^+ + 3OH^- \\rightarrow RCOO^- + 2Ag\\downarrow + 4NH_3 + 2H_2O',
      '\\text{Fehling Test: } RCHO + 2Cu^{2+} + 5OH^- \\rightarrow RCOO^- + Cu_2O\\downarrow(\\text{red}) + 3H_2O'
    ],
    specialCases: [
      'Benzaldehyde (C6H5CHO) undergoes Cannizzaro (no α-H) and cross-aldol with acetone.',
      'Iodoform Test (NaOH + I2): Positive for CH3-C(=O)-R and CH3-CH(OH)-R groups (yellow CHI3 precipitate).'
    ],
    keyVariables: ['α-H: Hydrogen atom attached to carbon adjacent to carbonyl group'],
    conditions: 'Aldol uses dilute base; Cannizzaro uses 50% concentrated base.',
    units: 'Qualitative reaction paths',
    commonMistakes: 'Expecting Fehling test to reduce aromatic aldehydes (benzaldehyde does NOT reduce Fehling solution!).',
    shortcuts: 'Aldol condensation product shortcut: Remove H2O between carbonyl oxygen of one molecule and two α-hydrogens of second molecule.',
    difficulty: 'JEE Advanced',
    isFavorite: true,
  },

  // --- INORGANIC CHEMISTRY: 1. CHEMICAL BONDING ---
  {
    id: 'f-chem-1501',
    exam: 'Both',
    subject: 'Chemistry',
    category: 'Inorganic',
    chapter: 'Chemical Bonding',
    subtopic: 'VSEPR, Hybridization & Dipole Moment',
    title: 'Steric Number, Hybridization Geometry & Dipole Moment',
    latex: 'SN = \\frac{1}{2}\\left[V + M - C + A\\right], \\quad \\vec{\\mu} = q \\times d \\quad (1 \\text{ Debye} = 3.336 \\times 10^{-30} \\text{ C}\\cdot\\text{m})',
    explanation: 'Steric number determines hybridization (sp=2, sp2=3, sp3=4, sp3d=5, sp3d2=6) and molecular VSEPR geometry.',
    derivedFormulas: [
      '\\text{Percentage Ionic Character } = 16 |\\Delta X| + 3.5 (|\\Delta X|)^2 \\quad (\\text{Hannay-Smyth formula})',
      '\\text{Formal Charge } FC = V - L - \\frac{B}{2}'
    ],
    specialCases: [
      'Fajan Rules: Small cation + Large anion + High charge = High Covalent character.',
      'Bent Rule: More electronegative substituents prefer orbitals with LESS s-character (axial in sp3d).'
    ],
    keyVariables: ['V: Valence electrons of central atom', 'M: Monovalent atoms attached', 'C: Cation charge', 'A: Anion charge'],
    conditions: 'Valid for main group molecules.',
    units: 'μ in Debye (D)',
    commonMistakes: 'Counting lone pairs on surrounding atoms in Steric Number equation.',
    shortcuts: 'NH3 (1 lp, pyramidal, 107°), H2O (2 lp, bent, 104.5°), SF4 (1 lp, see-saw), ClF3 (2 lp, T-shape), XeF2 (3 lp, linear).',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- INORGANIC CHEMISTRY: 2. COORDINATION COMPOUNDS ---
  {
    id: 'f-chem-1601',
    exam: 'Both',
    subject: 'Chemistry',
    category: 'Inorganic',
    chapter: 'Coordination Compounds',
    subtopic: 'EAN, Crystal Field Splitting & Isomerism',
    title: 'EAN Rule, CFT Splitting Energy Δo & Magnetic Moment',
    latex: '\\text{EAN} = Z - \\text{OS} + 2(\\text{CN}), \\quad \\mu = \\sqrt{n(n+2)} \\text{ BM}, \\quad \\Delta_t = \\frac{4}{9}\\Delta_o',
    explanation: 'Effective Atomic Number octet rule, crystal field splitting energy in octahedral (Δo) vs tetrahedral (Δt) field.',
    derivedFormulas: [
      '\\text{Spectrochemical Series: } I^- < Br^- < SCN^- < Cl^- < F^- < OH^- < C_2O_4^{2-} < H_2O < NCS^- < edta^{4-} < NH_3 < en < CN^- < CO',
      '\\text{CFSE for Octahedral } = (-0.4 n_{t2g} + 0.6 n_{eg}) \\Delta_o + P'
    ],
    specialCases: [
      'Strong Field Ligands (CN-, CO, en, NH3) cause electron pairing (Low Spin complexes).',
      'Weak Field Ligands (F-, Cl-, H2O) retain high spin configuration.'
    ],
    keyVariables: ['Z: Atomic number of metal', 'OS: Oxidation state', 'CN: Coordination number', 'n: Unpaired electrons'],
    conditions: 'CFT neglects metal-ligand covalent orbital overlap.',
    units: 'Δo in cm^-1 or kJ/mol, Magnetic moment in BM',
    commonMistakes: 'Assuming NH3 is always strong field. NH3 acts as weak field with Fe2+ and Mn2+.',
    shortcuts: 'Synergic bonding in metal carbonyls M-C≡O increases M-C bond strength while WEAKENING C-O bond.',
    difficulty: 'JEE Advanced',
    isFavorite: true,
  },

  // =========================================================================
  // MATHEMATICS
  // =========================================================================

  // --- 1. QUADRATIC EQUATIONS ---
  {
    id: 'f-math-301',
    exam: 'Both',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    subtopic: 'Roots, Vieta Formulas & Location of Roots',
    title: 'Quadratic Roots, Vieta Relations & Location of Roots',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}, \\quad \\alpha + \\beta = -\\frac{b}{a}, \\quad \\alpha\\beta = \\frac{c}{a}, \\quad D = b^2 - 4ac',
    explanation: 'Roots of ax² + bx + c = 0, Vieta sum and product relations, and discriminant condition.',
    derivedFormulas: [
      '|\\alpha - \\beta| = \\frac{\\sqrt{D}}{|a|}',
      '\\text{Common Root Condition for } a_1 x^2 + b_1 x + c_1 = 0 \\text{ and } a_2 x^2 + b_2 x + c_2 = 0:',
      '(c_1 a_2 - c_2 a_1)^2 = (a_1 b_2 - a_2 b_1)(b_1 c_2 - b_2 c_1)'
    ],
    specialCases: [
      'D > 0: Real and distinct roots.',
      'D = 0: Real and equal roots.',
      'D < 0: Complex conjugate roots (if a, b, c are real).'
    ],
    keyVariables: ['a, b, c: Real coefficients (a ≠ 0)', 'D: Discriminant'],
    conditions: 'Location of roots conditions require checking f(k), D, and vertex position -b/(2a).',
    units: 'Algebraic equations',
    commonMistakes: 'Forgetting condition a ≠ 0 when solving parametric quadratic problems.',
    shortcuts: 'If a + b + c = 0, roots are always 1 and c/a.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 2. SEQUENCE AND SERIES ---
  {
    id: 'f-math-401',
    exam: 'Both',
    subject: 'Mathematics',
    chapter: 'Sequence and Series',
    subtopic: 'AP, GP, HP & AM-GM-HM Inequality',
    title: 'AP, GP, Infinite GP & AM ≥ GM ≥ HM Inequality',
    latex: 'S_n^{AP} = \\frac{n}{2}[2a + (n-1)d], \\quad S_n^{GP} = \\frac{a(r^n - 1)}{r - 1}, \\quad S_{\\infty}^{GP} = \\frac{a}{1 - r} \\quad (|r| < 1), \\quad AM \\ge GM \\ge HM',
    explanation: 'Standard summation formulas for Arithmetic and Geometric progressions and classic inequality relation.',
    derivedFormulas: [
      'AM = \\frac{a+b}{2}, \\quad GM = \\sqrt{ab}, \\quad HM = \\frac{2ab}{a+b}',
      '\\sum_{k=1}^n k = \\frac{n(n+1)}{2}, \\quad \\sum_{k=1}^n k^2 = \\frac{n(n+1)(2n+1)}{6}, \\quad \\sum_{k=1}^n k^3 = \\left[\\frac{n(n+1)}{2}\\right]^2'
    ],
    specialCases: [
      'AM = GM = HM holds ONLY when all positive numbers are equal (a = b = c...).',
      'Arithmetico-Geometric Series (AGP): S_∞ = a/(1-r) + dr / (1-r)².'
    ],
    keyVariables: ['a: First term', 'd: Common difference', 'r: Common ratio (|r| < 1 for infinite GP)'],
    conditions: 'AM-GM-HM inequality holds strictly for POSITIVE real numbers.',
    units: 'Dimensionless sequences',
    commonMistakes: 'Applying AM-GM inequality to negative real numbers.',
    shortcuts: 'For finding minimum value of sum of positive reciprocals (e.g. x + 1/x), use AM ≥ GM directly.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 3. COMPLEX NUMBERS ---
  {
    id: 'f-math-501',
    exam: 'Both',
    subject: 'Mathematics',
    chapter: 'Complex Numbers',
    subtopic: 'Euler Form, De Moivre & Cube Roots of Unity',
    title: 'Euler Representation, De Moivre & Cube Roots of Unity (ω)',
    latex: 'z = r e^{i\\theta} = r(\\cos\\theta + i\\sin\\theta), \\quad (\\cos\\theta + i\\sin\\theta)^n = \\cos(n\\theta) + i\\sin(n\\theta), \\quad 1 + \\omega + \\omega^2 = 0, \\quad \\omega^3 = 1',
    explanation: 'Polar & exponential forms, De Moivre power reduction, and properties of complex cube roots of unity.',
    derivedFormulas: [
      '\\omega = \\frac{-1 + i\\sqrt{3}}{2}, \\quad \\omega^2 = \\frac{-1 - i\\sqrt{3}}{2}',
      '|z_1 + z_2| \\le |z_1| + |z_2| \\quad (\\text{Triangle Inequality})',
      '|z - z_1| + |z - z_2| = k \\quad (\\text{Ellipse if } k > |z_1 - z_2|)'
    ],
    specialCases: [
      '|z - z_1| = |z - z_2| represents the perpendicular bisector of segment joining z1 and z2.',
      'arg(z - z1) / arg(z - z2) = θ represents circle segment locus.'
    ],
    keyVariables: ['r = |z| = √(x² + y²)', 'θ = arg(z) = tan^-1(y/x)', 'i = √(-1)'],
    conditions: 'De Moivre holds for any integer n or rational exponent.',
    units: 'Complex plane coordinates',
    commonMistakes: 'Assuming arg(z1 z2) = arg(z1) + arg(z2) without principal value adjustment (-π < Arg ≤ π).',
    shortcuts: '1 + ω^k + ω^(2k) = 3 if k is multiple of 3; else equals 0.',
    difficulty: 'JEE Advanced',
    isFavorite: true,
  },

  // --- 4. MATRICES AND DETERMINANTS ---
  {
    id: 'f-math-601',
    exam: 'Both',
    subject: 'Mathematics',
    chapter: 'Matrices and Determinants',
    subtopic: 'Matrix Inverse, Adjoint & Cramer Rule',
    title: 'Matrix Inverse, Properties of Adjoint & Cramer Rule',
    latex: 'A^{-1} = \\frac{\\text{adj}(A)}{|A|}, \\quad |\\text{adj}(A)| = |A|^{n-1}, \\quad A \\cdot \\text{adj}(A) = |A| I_n, \\quad x = \\frac{D_x}{D}, \\quad y = \\frac{D_y}{D}, \\quad z = \\frac{D_z}{D}',
    explanation: 'Square matrix inverse existence condition (|A| ≠ 0), key adjoint properties for n×n matrix, and Cramer system solution.',
    derivedFormulas: [
      '\\text{adj}(\\text{adj}(A)) = |A|^{n-2} A, \\quad |\\text{adj}(\\text{adj}(A))| = |A|^{(n-1)^2}',
      '(A B)^{-1} = B^{-1} A^{-1}, \\quad (A B)^T = B^T A^T'
    ],
    specialCases: [
      'Cramer System: D ≠ 0 ⇒ Unique solution (Consistent).',
      'D = 0 and at least one Dx, Dy, Dz ≠ 0 ⇒ No solution (Inconsistent).',
      'D = Dx = Dy = Dz = 0 ⇒ Infinitely many solutions or inconsistent.'
    ],
    keyVariables: ['|A|: Determinant of matrix A', 'n: Order of square matrix'],
    conditions: 'Matrix inverse exists ONLY if non-singular (|A| ≠ 0).',
    units: 'Matrix algebra',
    commonMistakes: 'Using |adj(A)| = |A|^n instead of |A|^(n-1).',
    shortcuts: 'For 2×2 matrix A = [[a, b], [c, d]], adj(A) = [[d, -b], [-c, a]] (swap main diagonal, flip signs of off-diagonal).',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 5. PERMUTATIONS AND COMBINATIONS ---
  {
    id: 'f-math-701',
    exam: 'Both',
    subject: 'Mathematics',
    chapter: 'Permutation and Combination',
    subtopic: 'Permutations, Combinations & Derangements',
    title: 'nPr, nCr, Circular Permutation & Derangements D_n',
    latex: '^nP_r = \\frac{n!}{(n-r)!}, \\quad ^nC_r = \\frac{n!}{r!(n-r)!}, \\quad P_{circular} = (n-1)!, \\quad D_n = n!\\left(1 - \\frac{1}{1!} + \\frac{1}{2!} - \\frac{1}{3!} + \\dots + \\frac{(-1)^n}{n!}\\right)',
    explanation: 'Fundamental counting formulas for ordered arrangements, unordered combinations, circular seating, and derangements.',
    derivedFormulas: [
      '^nC_r + ^nC_{r-1} = ^{n+1}C_r \\quad (\\text{Pascal Identity})',
      '\\text{Number of non-negative integer solutions to } x_1 + x_2 + \\dots + x_r = n \\text{ is } ^{n+r-1}C_{r-1}'
    ],
    specialCases: [
      'Circular necklace / garland (clockwise and anticlockwise identical): P = (n-1)! / 2.',
      'Derangements: D1 = 0, D2 = 1, D3 = 2, D4 = 9, D5 = 44.'
    ],
    keyVariables: ['n: Total objects', 'r: Objects selected / arranged'],
    conditions: '0 ≤ r ≤ n.',
    units: 'Integer combinations count',
    commonMistakes: 'Confusing positive integer solutions (n-1 C r-1) with non-negative integer solutions (n+r-1 C r-1).',
    shortcuts: 'Pascal identity ^nCr + ^nC(r-1) = ^(n+1)Cr simplifies long binomial coefficient sums.',
    difficulty: 'JEE Advanced',
    isFavorite: true,
  },

  // --- 6. BINOMIAL THEOREM ---
  {
    id: 'f-math-801',
    exam: 'Both',
    subject: 'Mathematics',
    chapter: 'Binomial Theorem',
    subtopic: 'General Term & Binomial Coefficient Identities',
    title: 'Binomial General Term & Coefficient Sum Identities',
    latex: '(a + b)^n = \\sum_{r=0}^n ^nC_r a^{n-r} b^r, \\quad T_{r+1} = ^nC_r a^{n-r} b^r, \\quad \\sum_{r=0}^n ^nC_r = 2^n, \\quad \\sum_{r=0}^n (-1)^r ^nC_r = 0',
    explanation: 'General term in binomial expansion and core binomial coefficient summation identities.',
    derivedFormulas: [
      '\\sum_{r=1}^n r \\cdot ^nC_r = n \\cdot 2^{n-1}',
      '\\sum_{r=0}^n \\frac{^nC_r}{r+1} = \\frac{2^{n+1} - 1}{n+1}',
      '\\text{Multinomial Expansion: } (x_1 + x_2 + \\dots + x_k)^n = \\sum \\frac{n!}{n_1! n_2! \\dots n_k!} x_1^{n_1} x_2^{n_2} \\dots x_k^{n_k}'
    ],
    specialCases: [
      'Middle term when n is even: T_(n/2 + 1).',
      'Middle terms when n is odd: T_((n+1)/2) and T_((n+3)/2).'
    ],
    keyVariables: ['n: Positive integer index', 'T_{r+1}: (r+1)-th term in expansion'],
    conditions: 'Holds for positive integral exponent n.',
    units: 'Binomial coefficients',
    commonMistakes: 'Writing T_r = ^nCr a^(n-r) b^r instead of T_(r+1) = ^nCr a^(n-r) b^r (indexing shift!).',
    shortcuts: 'Sum of even coefficients = Sum of odd coefficients = 2^(n-1).',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 7. PROBABILITY ---
  {
    id: 'f-math-901',
    exam: 'Both',
    subject: 'Mathematics',
    chapter: 'Probability',
    subtopic: 'Conditional Probability & Bayes Theorem',
    title: 'Bayes’ Theorem, Total Probability & Expectation',
    latex: 'P(E_i | A) = \\frac{P(E_i) P(A | E_i)}{\\sum_{j=1}^k P(E_j) P(A | E_j)}, \\quad P(A \\cup B) = P(A) + P(B) - P(A \\cap B)',
    explanation: 'Calculates posterior probability of event E_i given observation A using Bayes theorem.',
    derivedFormulas: [
      '\\text{Conditional Probability } P(A|B) = \\frac{P(A \\cap B)}{P(B)}',
      '\\text{Independent Events: } P(A \\cap B) = P(A) \\cdot P(B)',
      '\\text{Binomial Distribution: } P(X = k) = ^nC_k p^k (1-p)^{n-k}, \\quad Mean = n p, \\quad Var = n p (1-p)'
    ],
    specialCases: [
      'Mutually Exclusive Events: P(A ∩ B) = 0.',
      'Variance is maximum when p = 0.5 (Var_max = n/4).'
    ],
    keyVariables: ['P(E_i): Prior probability of mutually exclusive partition E_i', 'p: Success probability', 'n: Trials count'],
    conditions: 'Partition events E1, E2... Ek must be exhaustive and mutually exclusive.',
    units: 'Probability scale (0 ≤ P ≤ 1)',
    commonMistakes: 'Confusing mutually exclusive events (P(A∩B)=0) with independent events (P(A∩B)=P(A)P(B)).',
    shortcuts: 'Odds in favor of event A = P(A) : P(A\').',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 8. TRIGONOMETRY ---
  {
    id: 'f-math-1101',
    exam: 'Both',
    subject: 'Mathematics',
    chapter: 'Trigonometry',
    subtopic: 'Compound Angles, Transformations & Inverse Functions',
    title: 'Compound Angle Identities, Transformations & Inverse Formulas',
    latex: '\\sin(A \\pm B) = \\sin A \\cos B \\pm \\cos A \\sin B, \\quad \\tan(A \\pm B) = \\frac{\\tan A \\pm \\tan B}{1 \\mp \\tan A \\tan B}, \\quad \\tan^{-1}x + \\tan^{-1}y = \\tan^{-1}\\left(\\frac{x+y}{1-xy}\\right) \\quad (xy < 1)',
    explanation: 'Core trigonometric compound addition identities and inverse tan sum property.',
    derivedFormulas: [
      '\\sin 2\\theta = 2\\sin\\theta\\cos\\theta = \\frac{2\\tan\\theta}{1+\\tan^2\\theta}, \\quad \\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta = \\frac{1-\\tan^2\\theta}{1+\\tan^2\\theta}',
      '\\sin C + \\sin D = 2\\sin\\left(\\frac{C+D}{2}\\right)\\cos\\left(\\frac{C-D}{2}\\right)',
      '\\sin^{-1}x + \\cos^{-1}x = \\frac{\\pi}{2}, \\quad \\tan^{-1}x + \\cot^{-1}x = \\frac{\\pi}{2}'
    ],
    specialCases: [
      'a sin θ + b cos θ range is always [-√(a² + b²), +√(a² + b²)].',
      'If xy > 1 in tan^-1 x + tan^-1 y (with x,y > 0): Result is π + tan^-1((x+y)/(1-xy)).'
    ],
    keyVariables: ['θ, A, B: Angles in radians', 'x, y: Domain parameters for inverse trig functions'],
    conditions: 'Domain restrictions for inverse functions: sin^-1 x (x ∈ [-1, 1]), tan^-1 x (x ∈ ℝ).',
    units: 'Angles in Radians',
    commonMistakes: 'Forgetting factor π + in tan^-1 x + tan^-1 y when xy > 1.',
    shortcuts: 'cos 20° cos 40° cos 80° = 1/8 (using product formula ∏ cos(2^k θ) = sin(2^n θ) / (2^n sin θ)).',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 9. STRAIGHT LINES ---
  {
    id: 'f-math-1201',
    exam: 'Both',
    subject: 'Mathematics',
    chapter: 'Straight Lines',
    subtopic: 'Line Forms, Distance & Family of Lines',
    title: 'Line Forms, Perpendicular Distance & Foot of Perpendicular',
    latex: 'y - y_1 = m(x - x_1), \\quad d = \\frac{|a x_1 + b y_1 + c|}{\\sqrt{a^2 + b^2}}, \\quad \\frac{x - x_1}{a} = \\frac{y - y_1}{b} = -\\frac{a x_1 + b y_1 + c}{a^2 + b^2}',
    explanation: 'Slope-point line equation, perpendicular distance from point (x1, y1) to line ax + by + c = 0, and foot of perpendicular formula.',
    derivedFormulas: [
      '\\text{Distance between parallel lines: } d = \\frac{|c_1 - c_2|}{\\sqrt{a^2 + b^2}}',
      '\\text{Image of Point (x1, y1) in Line: } \\frac{x - x_1}{a} = \\frac{y - y_1}{b} = -2\\frac{a x_1 + b y_1 + c}{a^2 + b^2}',
      '\\text{Angle between lines: } \\tan\\theta = \\left|\\frac{m_1 - m_2}{1 + m_1 m_2}\\right|'
    ],
    specialCases: [
      'Parallel lines: m1 = m2 (a1/a2 = b1/b2).',
      'Perpendicular lines: m1 m2 = -1 (a1 a2 + b1 b2 = 0).'
    ],
    keyVariables: ['m: Slope = tan θ', '(x1, y1): Point coordinates', 'a, b, c: Line coefficients'],
    conditions: 'a² + b² ≠ 0.',
    units: 'Distance in length units',
    commonMistakes: 'Forgetting factor of 2 when finding image of point compared to foot of perpendicular.',
    shortcuts: 'Family of lines passing through intersection of L1=0 and L2=0 is L1 + λ L2 = 0.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 10. CIRCLE ---
  {
    id: 'f-math-1301',
    exam: 'Both',
    subject: 'Mathematics',
    chapter: 'Circle',
    subtopic: 'Standard Circle, Tangent & Radical Axis',
    title: 'Circle General Equation, Tangent & Power of Point',
    latex: 'x^2 + y^2 + 2gx + 2fy + c = 0 \\implies C(-g, -f), \\; r = \\sqrt{g^2 + f^2 - c}, \\quad \\text{Tangent: } y = mx \\pm r\\sqrt{1 + m^2}',
    explanation: 'General circle equation parameters and slope-form tangent equation to circle x² + y² = r².',
    derivedFormulas: [
      '\\text{Length of Tangent from } (x_1, y_1): L = \\sqrt{S_1} = \\sqrt{x_1^2 + y_1^2 + 2gx_1 + 2fy_1 + c}',
      '\\text{Radical Axis of two circles: } S_1 - S_2 = 0',
      '\\text{Chord of Contact: } T = 0 \\implies x x_1 + y y_1 + g(x + x_1) + f(y + y_1) + c = 0'
    ],
    specialCases: [
      'Circles touch externally: C1 C2 = r1 + r2 (4 common tangents).',
      'Circles touch internally: C1 C2 = |r1 - r2| (1 common tangent).'
    ],
    keyVariables: ['C(-g, -f): Center coordinates', 'r: Radius', 'S1: Point power value'],
    conditions: 'g² + f² - c > 0 for real circle.',
    units: 'Coordinates & radius units',
    commonMistakes: 'Using non-monic coefficients (e.g. 2x² + 2y²...) without dividing whole equation by 2 first.',
    shortcuts: 'Equation of circle on line segment joining (x1, y1) and (x2, y2) as diameter: (x-x1)(x-x2) + (y-y1)(y-y2) = 0.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 11. PARABOLA, ELLIPSE & HYPERBOLA ---
  {
    id: 'f-math-1401',
    exam: 'Both',
    subject: 'Mathematics',
    chapter: 'Parabola',
    subtopic: 'Standard Conics, Eccentricity & Tangents',
    title: 'Parabola, Ellipse, Hyperbola Equations & Eccentricity',
    latex: 'y^2 = 4ax, \\quad \\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1 \\;(e = \\sqrt{1 - \\frac{b^2}{a^2}}), \\quad \\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1 \\;(e = \\sqrt{1 + \\frac{b^2}{a^2}})',
    explanation: 'Standard canonical equations and eccentricity formulas for parabola, ellipse, and hyperbola.',
    derivedFormulas: [
      '\\text{Parabola Tangent in Slope Form: } y = mx + \\frac{a}{m}',
      '\\text{Ellipse Tangent in Slope Form: } y = mx \\pm \\sqrt{a^2 m^2 + b^2}',
      '\\text{Hyperbola Tangent in Slope Form: } y = mx \\pm \\sqrt{a^2 m^2 - b^2}',
      '\\text{Rectangular Hyperbola } xy = c^2 \\implies e = \\sqrt{2}'
    ],
    specialCases: [
      'Parabola e = 1, Ellipse 0 < e < 1, Hyperbola e > 1.',
      'Latus Rectum Length: Parabola = 4a, Ellipse = 2b²/a, Hyperbola = 2b²/a.'
    ],
    keyVariables: ['a, b: Semi-major / semi-minor axes', 'e: Eccentricity', 'm: Tangent slope'],
    conditions: 'For ellipse a > b; for hyperbola a, b positive.',
    units: 'Conic geometry',
    commonMistakes: 'Confusing parabola slope tangent y = mx + a/m with normal y = mx - 2am - am³.',
    shortcuts: 'Sum of focal distances for any point on ellipse = 2a (constant!). Difference for hyperbola = 2a.',
    difficulty: 'JEE Advanced',
    isFavorite: true,
  },

  // --- 12. LIMITS, CONTINUITY & DIFFERENTIATION ---
  {
    id: 'f-math-1701',
    exam: 'Both',
    subject: 'Mathematics',
    chapter: 'Limits',
    subtopic: 'Standard Limits & L’Hôpital Rule',
    title: 'Standard Trigonometric, Exponential Limits & L’Hôpital Rule',
    latex: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1, \\quad \\lim_{x \\to 0} \\frac{e^x - 1}{x} = 1, \\quad \\lim_{x \\to 0} (1 + x)^{1/x} = e, \\quad \\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f\'(x)}{g\'(x)}',
    explanation: 'Fundamental limits and L’Hôpital evaluation rule for indeterminate 0/0 and ∞/∞ forms.',
    derivedFormulas: [
      '\\lim_{x \\to 0} \\frac{1 - \\cos x}{x^2} = \\frac{1}{2}',
      '\\lim_{x \\to 0} \\frac{\\ln(1+x)}{x} = 1',
      '\\text{Form } 1^{\\infty}: \\lim_{x \\to a} [f(x)]^{g(x)} = e^{\\lim_{x \\to a} g(x)[f(x) - 1]}'
    ],
    specialCases: [
      'L’Hôpital rule applies ONLY when direct substitution yields 0/0 or ∞/∞ forms.',
      'If L’Hôpital yields 0/0 again, differentiate top and bottom a second time!'
    ],
    keyVariables: ['f(x), g(x): Differentiable functions near x = a'],
    conditions: 'x in trigonometric limits MUST be in radians.',
    units: 'Mathematical limits',
    commonMistakes: 'Applying quotient rule d/dx [f/g] inside L’Hôpital instead of differentiating numerator f\'(x) and denominator g\'(x) SEPARATELY!',
    shortcuts: 'Use Taylor series expansion (e.g. sin x ≈ x - x³/6, cos x ≈ 1 - x²/2) for quick higher-order limit evaluations.',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 13. APPLICATION OF DERIVATIVES ---
  {
    id: 'f-math-2001',
    exam: 'Both',
    subject: 'Mathematics',
    chapter: 'Application of Derivatives',
    subtopic: 'Monotonicity, Maxima/Minima & Mean Value Theorems',
    title: 'First/Second Derivative Tests & Rolle / Lagrange MVT',
    latex: 'f\'(x) > 0 \\implies \\text{Increasing}, \\quad f\'(c) = 0 \\;\\&\\; f\'\'(c) < 0 \\implies \\text{Local Max}, \\quad f\'(c) = \\frac{f(b) - f(a)}{b - a}',
    explanation: 'Determines function monotonicity, extrema conditions, and Lagrange Mean Value Theorem slope guarantee in (a, b).',
    derivedFormulas: [
      '\\text{Rolle Theorem: } f(a) = f(b) \\implies \\exists c \\in (a, b) \\text{ such that } f\'(c) = 0',
      '\\text{Tangent Equation at } (x_1, y_1): y - y_1 = f\'(x_1)(x - x_1)',
      '\\text{Normal Equation at } (x_1, y_1): y - y_1 = -\\frac{1}{f\'(x_1)}(x - x_1)'
    ],
    specialCases: [
      'Inflection Point: f\'\'(c) = 0 and f\'\'(x) changes sign across x = c.',
      'Global Maxima/Minima on closed interval [a, b] check critical points AND boundary endpoints a, b.'
    ],
    keyVariables: ['c: Point in interior (a, b)', 'f\'(x): First derivative slope'],
    conditions: 'MVT requires f(x) to be continuous on [a, b] and differentiable on (a, b).',
    units: 'Rate of change',
    commonMistakes: 'Forgetting to check boundary endpoints when finding absolute max/min on closed interval [a, b].',
    shortcuts: 'If f\'(x) > 0 for all x ∈ ℝ, function is strictly 1-to-1 (Injective / One-One).',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 14. DEFINITE INTEGRATION & LEIBNIZ RULE ---
  {
    id: 'f-math-2201',
    exam: 'Both',
    subject: 'Mathematics',
    chapter: 'Definite Integration',
    subtopic: 'Integration Properties, King Property & Leibniz Rule',
    title: 'King’s Property & Leibniz Rule for Differentiation under Integral',
    latex: '\\int_a^b f(x) dx = \\int_a^b f(a + b - x) dx, \\quad \\frac{d}{dx} \\left[\\int_{g(x)}^{h(x)} f(t) dt\\right] = f(h(x)) h\'(x) - f(g(x)) g\'(x)',
    explanation: 'King’s reflection property for definite integrals and Leibniz formula for differentiating integral with variable limits.',
    derivedFormulas: [
      '\\int_{-a}^a f(x) dx = 2\\int_0^a f(x) dx \\quad (\\text{if } f \\text{ is even}), \\quad 0 \\quad (\\text{if } f \\text{ is odd})',
      '\\int_0^{2a} f(x) dx = 2\\int_0^a f(x) dx \\quad (\\text{if } f(2a-x) = f(x)), \\quad 0 \\quad (\\text{if } f(2a-x) = -f(x))',
      '\\text{Area between curves: } A = \\int_a^b |f(x) - g(x)| dx'
    ],
    specialCases: [
      'King’s property combined with adding original integral eliminates complex x factors (e.g. ∫ x sin x / (1 + cos²x) dx).',
      'Wallis Formula for ∫_0^(π/2) sin^n x dx.'
    ],
    keyVariables: ['g(x), h(x): Differentiable limit functions', 'f(t): Integrand'],
    conditions: 'Integrand f must be continuous on integration range.',
    units: 'Area / Integral value',
    commonMistakes: 'Forgetting to multiply by derivatives h\'(x) and g\'(x) when applying Leibniz rule!',
    shortcuts: '∫_0^(π/2) ln(sin x) dx = - (π/2) ln 2 ≈ -0.5493.',
    difficulty: 'JEE Advanced',
    isFavorite: true,
  },

  // --- 15. DIFFERENTIAL EQUATIONS ---
  {
    id: 'f-math-2401',
    exam: 'Both',
    subject: 'Mathematics',
    chapter: 'Differential Equations',
    subtopic: 'Variable Separable, Homogeneous & Linear Differential Equations',
    title: 'First Order Linear Differential Equation & Integrating Factor',
    latex: '\\frac{dy}{dx} + P(x) y = Q(x) \\implies IF = e^{\\int P(x) dx}, \\quad y \\cdot IF = \\int Q(x) \\cdot IF dx + C',
    explanation: 'Solves first-order linear differential equations using Integrating Factor IF.',
    derivedFormulas: [
      '\\text{Form } \\frac{dx}{dy} + P(y) x = Q(y) \\implies IF = e^{\\int P(y) dy}, \\quad x \\cdot IF = \\int Q(y) \\cdot IF dy + C',
      '\\text{Bernoulli Equation: } \\frac{dy}{dx} + P(x) y = Q(x) y^n \\implies \\text{Substitute } v = y^{1-n}',
      '\\text{Homogeneous Equation } \\frac{dy}{dx} = f\\left(\\frac{y}{x}\\right) \\implies \\text{Substitute } y = v x'
    ],
    specialCases: [
      'Variable Separable Form: f(y) dy = g(x) dx ⇒ Integrate both sides directly.'
    ],
    keyVariables: ['P(x), Q(x): Functions of x alone', 'IF: Integrating factor'],
    conditions: 'Equation must be linear in y (or x).',
    units: 'Differential calculus',
    commonMistakes: 'Including constant C inside exponent when computing IF = e^(∫P dx + C). (Do not add C to IF!).',
    shortcuts: 'd(x y) = x dy + y dx, d(x/y) = (y dx - x dy) / y².',
    difficulty: 'JEE Main',
    isFavorite: true,
  },

  // --- 16. VECTOR ALGEBRA & 3D GEOMETRY ---
  {
    id: 'f-math-2501',
    exam: 'Both',
    subject: 'Mathematics',
    chapter: 'Vector Algebra',
    subtopic: 'Scalar & Vector Triple Products & Shortest Distance',
    title: 'Scalar / Vector Triple Products & Shortest Distance Between Skew Lines',
    latex: '[\\vec{a}\\;\\vec{b}\\;\\vec{c}] = \\vec{a} \\cdot (\\vec{b} \\times \\vec{c}), \\quad \\vec{a} \\times (\\vec{b} \\times \\vec{c}) = (\\vec{a} \\cdot \\vec{c})\\vec{b} - (\\vec{a} \\cdot \\vec{b})\\vec{c}, \\quad d_{skew} = \\frac{|(\\vec{a}_2 - \\vec{a}_1) \\cdot (\\vec{b}_1 \\times \\vec{b}_2)|}{|\\vec{b}_1 \\times \\vec{b}_2|}',
    explanation: 'Scalar triple product volume of parallelopiped, vector triple product expansion, and shortest distance between skew lines.',
    derivedFormulas: [
      '\\text{Coplanar Vectors Condition: } [\\vec{a}\\;\\vec{b}\\;\\vec{c}] = 0',
      '\\text{Volume of Tetrahedron } V = \\frac{1}{6} |[\\vec{a}\\;\\vec{b}\\;\\vec{c}]|',
      '\\text{Distance from Point } \\vec{r}_0 \\text{ to Plane } \\vec{r} \\cdot \\vec{n} = d : \\quad d_{perp} = \\frac{|\\vec{r}_0 \\cdot \\vec{n} - d|}{|\\vec{n}|}'
    ],
    specialCases: [
      'If two skew lines intersect: Shortest distance d_skew = 0 ⇒ (a2 - a1) · (b1 × b2) = 0.',
      'Parallel Lines Shortest Distance: d = |(a2 - a1) × b̂|.'
    ],
    keyVariables: ['a1, a2: Points on lines', 'b1, b2: Direction vectors of lines', 'n: Normal to plane'],
    conditions: 'b1 × b2 ≠ 0 for non-parallel skew lines.',
    units: '3D spatial geometry distance',
    commonMistakes: 'Forgetting absolute value brackets when computing triple product volume (volume cannot be negative!).',
    shortcuts: 'BAC-CAB rule for vector triple product: A × (B × C) = B(A·C) - C(A·B).',
    difficulty: 'JEE Advanced',
    isFavorite: true,
  }
];
