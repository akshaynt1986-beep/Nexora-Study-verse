import { SmartChapter, SyllabusChapter, SyllabusExamType } from '../types';

export function calculateChapterProgress(chapter: SmartChapter): SmartChapter {
  let topicSum = 0;
  if (chapter.topics.length > 0) {
    topicSum = chapter.topics.reduce((acc, t) => {
      if (t.subtopics && t.subtopics.length > 0) {
        const completedSubs = t.subtopics.filter((s) => s.completed).length;
        const subPct = Math.round((completedSubs / t.subtopics.length) * 100);
        return acc + subPct;
      }
      return acc + (t.completionPercentage || 0);
    }, 0) / chapter.topics.length;
  }

  const {
    lecturesCompleted,
    totalLectures,
    dppsCompleted,
    totalDpps,
    pyqsSolved,
    totalPyqs,
    pyqAccuracy,
    formulasRevised,
    notesCompleted,
    revisionCompleted,
  } = chapter.metrics;

  const lecPct = totalLectures > 0 ? (lecturesCompleted / totalLectures) * 100 : 0;
  const dppPct = totalDpps > 0 ? (dppsCompleted / totalDpps) * 100 : 0;
  const pyqPct = totalPyqs > 0 ? (pyqsSolved / totalPyqs) * 100 : 0;
  const revPct =
    (formulasRevised ? 33 : 0) + (notesCompleted ? 33 : 0) + (revisionCompleted ? 34 : 0);

  const overall = Math.min(
    100,
    Math.round(topicSum * 0.4 + lecPct * 0.2 + dppPct * 0.15 + pyqPct * 0.15 + revPct * 0.1)
  );

  let healthStatus: 'Weak' | 'Average' | 'Strong' = 'Average';
  if (
    chapter.status === 'Needs Revision' ||
    (pyqsSolved >= 5 && pyqAccuracy < 60) ||
    (overall < 25 && chapter.status !== 'Not Started')
  ) {
    healthStatus = 'Weak';
  } else if (overall >= 75 && pyqAccuracy >= 75) {
    healthStatus = 'Strong';
  }

  let calculatedStatus = chapter.status;
  if (overall === 100) {
    calculatedStatus = 'Completed';
  } else if (overall > 0 && calculatedStatus === 'Not Started') {
    calculatedStatus = 'In Progress';
  }

  return {
    ...chapter,
    overallProgress: overall,
    healthStatus,
    status: calculatedStatus,
  };
}

// -------------------------------------------------------------
// JEE MAIN SYLLABUS
// -------------------------------------------------------------
export const INITIAL_JEE_MAIN_SMART: SmartChapter[] = [
  // --- PHYSICS ---
  {
    id: 'jm-phy-1',
    exam: 'JEE Main',
    name: 'Units, Dimensions & Errors',
    subject: 'Physics',
    classGrade: '11',
    weightage: 'High',
    status: 'In Progress',
    prerequisites: [],
    prerequisiteNames: [],
    topics: [
      {
        id: 'jm-phy-1-t1',
        title: 'SI Units & Dimensional Formulas',
        completionPercentage: 100,
        subtopics: [
          { id: 's1', title: 'Base vs Derived Units', completed: true },
          { id: 's2', title: 'Dimensional Analysis & Applications', completed: true },
        ],
      },
      {
        id: 'jm-phy-1-t2',
        title: 'Error Analysis & Measurement',
        completionPercentage: 75,
        subtopics: [
          { id: 's3', title: 'Absolute, Relative & Percentage Errors', completed: true },
          { id: 's4', title: 'Combination of Errors in Operations', completed: true },
          { id: 's5', title: 'Vernier Calipers & Screw Gauge Least Count', completed: false },
        ],
      },
    ],
    metrics: {
      lecturesCompleted: 4,
      totalLectures: 5,
      dppsCompleted: 3,
      totalDpps: 4,
      questionsPracticed: 42,
      pyqsSolved: 28,
      totalPyqs: 35,
      pyqAccuracy: 82,
      mockQuestionsAttempted: 15,
      formulasRevised: true,
      notesCompleted: true,
      revisionCompleted: false,
    },
    overallProgress: 82,
    healthStatus: 'Strong',
  },
  {
    id: 'jm-phy-2',
    exam: 'JEE Main',
    name: 'Vectors & Mathematical Physics',
    subject: 'Physics',
    classGrade: '11',
    weightage: 'High',
    status: 'Completed',
    prerequisites: ['jm-phy-1'],
    prerequisiteNames: ['Units, Dimensions & Errors'],
    topics: [
      {
        id: 'jm-phy-2-t1',
        title: 'Vector Addition & Resolution',
        completionPercentage: 100,
        subtopics: [
          { id: 'v1', title: 'Triangle & Parallelogram Law', completed: true },
          { id: 'v2', title: 'Component Form in 2D & 3D', completed: true },
        ],
      },
      {
        id: 'jm-phy-2-t2',
        title: 'Dot & Cross Product Applications',
        completionPercentage: 100,
        subtopics: [
          { id: 'v3', title: 'Scalar Product & Angle Between Vectors', completed: true },
          { id: 'v4', title: 'Vector Product & Area Calculation', completed: true },
        ],
      },
      {
        id: 'jm-phy-2-t3',
        title: 'Basic Calculus in Physics',
        completionPercentage: 100,
        subtopics: [
          { id: 'v5', title: 'Differentiation as Rate of Change', completed: true },
          { id: 'v6', title: 'Integration as Area Under Curve', completed: true },
        ],
      },
    ],
    metrics: {
      lecturesCompleted: 6,
      totalLectures: 6,
      dppsCompleted: 5,
      totalDpps: 5,
      questionsPracticed: 60,
      pyqsSolved: 40,
      totalPyqs: 40,
      pyqAccuracy: 90,
      mockQuestionsAttempted: 20,
      formulasRevised: true,
      notesCompleted: true,
      revisionCompleted: true,
    },
    overallProgress: 100,
    healthStatus: 'Strong',
  },
  {
    id: 'jm-phy-3',
    exam: 'JEE Main',
    name: 'Kinematics 1D & 2D',
    subject: 'Physics',
    classGrade: '11',
    weightage: 'High',
    status: 'In Progress',
    prerequisites: ['jm-phy-2'],
    prerequisiteNames: ['Vectors & Mathematical Physics'],
    topics: [
      {
        id: 'jm-phy-3-t1',
        title: 'Motion in 1D & Motion Under Gravity',
        completionPercentage: 80,
        subtopics: [
          { id: 'k1', title: 'Equations of Motion with Constant Acceleration', completed: true },
          { id: 'k2', title: 'Variable Acceleration Problems', completed: true },
          { id: 'k3', title: 'Vertical Motion Under Gravity', completed: false },
        ],
      },
      {
        id: 'jm-phy-3-t2',
        title: 'Projectile Motion',
        completionPercentage: 60,
        subtopics: [
          { id: 'k4', title: 'Ground to Ground Projectile', completed: true },
          { id: 'k5', title: 'Horizontal Projectile from Height', completed: true },
          { id: 'k6', title: 'Motion on Incline Plane', completed: false },
        ],
      },
      {
        id: 'jm-phy-3-t3',
        title: 'Relative Motion in 2D',
        completionPercentage: 40,
        subtopics: [
          { id: 'k7', title: 'River-Boat Problems', completed: true },
          { id: 'k8', title: 'Rain-Man Problems', completed: false },
          { id: 'k9', title: 'Aircraft Wind & Collision Conditions', completed: false },
        ],
      },
    ],
    metrics: {
      lecturesCompleted: 6,
      totalLectures: 8,
      dppsCompleted: 4,
      totalDpps: 6,
      questionsPracticed: 55,
      pyqsSolved: 30,
      totalPyqs: 50,
      pyqAccuracy: 70,
      mockQuestionsAttempted: 18,
      formulasRevised: true,
      notesCompleted: true,
      revisionCompleted: false,
    },
    overallProgress: 64,
    healthStatus: 'Average',
  },
  {
    id: 'jm-phy-4',
    exam: 'JEE Main',
    name: "Newton's Laws of Motion & Friction",
    subject: 'Physics',
    classGrade: '11',
    weightage: 'High',
    status: 'Learning',
    prerequisites: ['jm-phy-3'],
    prerequisiteNames: ['Kinematics 1D & 2D'],
    topics: [
      {
        id: 'jm-phy-4-t1',
        title: 'Free Body Diagrams & Constraint Motion',
        completionPercentage: 50,
        subtopics: [
          { id: 'n1', title: 'Pulley-Block Systems', completed: true },
          { id: 'n2', title: 'Wedge & String Constraints', completed: false },
        ],
      },
      {
        id: 'jm-phy-4-t2',
        title: 'Friction Dynamics',
        completionPercentage: 30,
        subtopics: [
          { id: 'n3', title: 'Static vs Kinetic Friction', completed: true },
          { id: 'n4', title: 'Two-Block Friction Problems', completed: false },
        ],
      },
      {
        id: 'jm-phy-4-t3',
        title: 'Pseudo Forces & Circular Motion Dynamics',
        completionPercentage: 20,
        subtopics: [
          { id: 'n5', title: 'Non-Inertial Frames & Centrifugal Force', completed: true },
          { id: 'n6', title: 'Banking of Roads & Vertical Circle', completed: false },
        ],
      },
    ],
    metrics: {
      lecturesCompleted: 3,
      totalLectures: 7,
      dppsCompleted: 2,
      totalDpps: 5,
      questionsPracticed: 30,
      pyqsSolved: 12,
      totalPyqs: 45,
      pyqAccuracy: 58,
      mockQuestionsAttempted: 10,
      formulasRevised: false,
      notesCompleted: false,
      revisionCompleted: false,
    },
    overallProgress: 36,
    healthStatus: 'Weak',
  },
  {
    id: 'jm-phy-5',
    exam: 'JEE Main',
    name: 'Work, Energy & Power',
    subject: 'Physics',
    classGrade: '11',
    weightage: 'High',
    status: 'Not Started',
    prerequisites: ['jm-phy-4'],
    prerequisiteNames: ["Newton's Laws of Motion & Friction"],
    topics: [
      {
        id: 'jm-phy-5-t1',
        title: 'Work-Energy Theorem',
        completionPercentage: 0,
        subtopics: [
          { id: 'w1', title: 'Work Done by Constant & Variable Force', completed: false },
          { id: 'w2', title: 'Work Energy Principle in Complex Frames', completed: false },
        ],
      },
      {
        id: 'jm-phy-5-t2',
        title: 'Conservative Forces & Potential Energy',
        completionPercentage: 0,
        subtopics: [
          { id: 'w3', title: 'Potential Energy Curves & Equilibrium Points', completed: false },
          { id: 'w4', title: 'Conservation of Mechanical Energy', completed: false },
        ],
      },
    ],
    metrics: {
      lecturesCompleted: 0,
      totalLectures: 6,
      dppsCompleted: 0,
      totalDpps: 5,
      questionsPracticed: 0,
      pyqsSolved: 0,
      totalPyqs: 50,
      pyqAccuracy: 0,
      mockQuestionsAttempted: 0,
      formulasRevised: false,
      notesCompleted: false,
      revisionCompleted: false,
    },
    overallProgress: 0,
    healthStatus: 'Average',
  },
  {
    id: 'jm-phy-6',
    exam: 'JEE Main',
    name: 'Electrostatics & Capacitance',
    subject: 'Physics',
    classGrade: '12',
    weightage: 'High',
    status: 'In Progress',
    prerequisites: ['jm-phy-2', 'jm-phy-5'],
    prerequisiteNames: ['Vectors & Mathematical Physics', 'Work, Energy & Power'],
    topics: [
      {
        id: 'jm-phy-6-t1',
        title: 'Coulomb Law & Electric Field',
        completionPercentage: 90,
        subtopics: [
          { id: 'e1', title: 'Vector Form of Coulomb Law', completed: true },
          { id: 'e2', title: 'Electric Field due to Continuous Charge Distribution', completed: true },
          { id: 'e3', title: 'Electric Dipole in Uniform Field', completed: false },
        ],
      },
      {
        id: 'jm-phy-6-t2',
        title: 'Gauss Law & Conductors',
        completionPercentage: 75,
        subtopics: [
          { id: 'e4', title: 'Electric Flux & Closed Surfaces', completed: true },
          { id: 'e5', title: 'Application of Gauss Law to Spheres/Planes', completed: true },
          { id: 'e6', title: 'Cavity in Conductors & Earthing', completed: false },
        ],
      },
      {
        id: 'jm-phy-6-t3',
        title: 'Electric Potential & Capacitors',
        completionPercentage: 50,
        subtopics: [
          { id: 'e7', title: 'Potential Difference & Electrostatic Energy', completed: true },
          { id: 'e8', title: 'Parallel Plate Capacitor & Dielectrics', completed: true },
          { id: 'e9', title: 'Circuit Reduction & Redistribution of Charges', completed: false },
        ],
      },
    ],
    metrics: {
      lecturesCompleted: 7,
      totalLectures: 9,
      dppsCompleted: 5,
      totalDpps: 7,
      questionsPracticed: 72,
      pyqsSolved: 48,
      totalPyqs: 65,
      pyqAccuracy: 78,
      mockQuestionsAttempted: 22,
      formulasRevised: true,
      notesCompleted: true,
      revisionCompleted: false,
    },
    overallProgress: 72,
    healthStatus: 'Strong',
  },
  {
    id: 'jm-phy-7',
    exam: 'JEE Main',
    name: 'Current Electricity',
    subject: 'Physics',
    classGrade: '12',
    weightage: 'High',
    status: 'Needs Revision',
    prerequisites: ['jm-phy-6'],
    prerequisiteNames: ['Electrostatics & Capacitance'],
    topics: [
      {
        id: 'jm-phy-7-t1',
        title: 'Drift Velocity & Resistance',
        completionPercentage: 80,
        subtopics: [
          { id: 'c1', title: "Ohm's Law & Temperature Dependence", completed: true },
          { id: 'c2', title: 'Drift Velocity & Microscopic Ohm Law', completed: true },
        ],
      },
      {
        id: 'jm-phy-7-t2',
        title: 'Circuit Analysis & Measuring Instruments',
        completionPercentage: 60,
        subtopics: [
          { id: 'c3', title: "Kirchhoff's Voltage & Current Laws", completed: true },
          { id: 'c4', title: 'Wheatstone Bridge & Meter Bridge', completed: true },
          { id: 'c5', title: 'Potentiometer Applications & Errors', completed: false },
        ],
      },
    ],
    metrics: {
      lecturesCompleted: 6,
      totalLectures: 7,
      dppsCompleted: 4,
      totalDpps: 5,
      questionsPracticed: 50,
      pyqsSolved: 32,
      totalPyqs: 55,
      pyqAccuracy: 52,
      mockQuestionsAttempted: 15,
      formulasRevised: false,
      notesCompleted: true,
      revisionCompleted: false,
    },
    overallProgress: 65,
    healthStatus: 'Weak',
  },

  // --- CHEMISTRY ---
  {
    id: 'jm-ch-1',
    exam: 'JEE Main',
    name: 'Mole Concept & Stoichiometry',
    subject: 'Chemistry',
    category: 'Physical',
    classGrade: '11',
    weightage: 'High',
    status: 'Completed',
    prerequisites: [],
    prerequisiteNames: [],
    topics: [
      {
        id: 'jm-ch-1-t1',
        title: 'Concentration Terms & Mole Calculations',
        completionPercentage: 100,
        subtopics: [
          { id: 'm1', title: 'Molarity, Molality, Mole Fraction & PPM', completed: true },
          { id: 'm2', title: 'Equivalent Weight & Normality', completed: true },
        ],
      },
      {
        id: 'jm-ch-1-t2',
        title: 'Stoichiometry & Limiting Reagents',
        completionPercentage: 100,
        subtopics: [
          { id: 'm3', title: 'Limiting Reagent & Percentage Yield', completed: true },
          { id: 'm4', title: 'Gravimetric Analysis & Mixture Problems', completed: true },
        ],
      },
    ],
    metrics: {
      lecturesCompleted: 5,
      totalLectures: 5,
      dppsCompleted: 4,
      totalDpps: 4,
      questionsPracticed: 55,
      pyqsSolved: 38,
      totalPyqs: 38,
      pyqAccuracy: 88,
      mockQuestionsAttempted: 16,
      formulasRevised: true,
      notesCompleted: true,
      revisionCompleted: true,
    },
    overallProgress: 100,
    healthStatus: 'Strong',
  },
  {
    id: 'jm-ch-2',
    exam: 'JEE Main',
    name: 'Atomic Structure & Quantum Numbers',
    subject: 'Chemistry',
    category: 'Physical',
    classGrade: '11',
    weightage: 'High',
    status: 'In Progress',
    prerequisites: ['jm-ch-1'],
    prerequisiteNames: ['Mole Concept & Stoichiometry'],
    topics: [
      {
        id: 'jm-ch-2-t1',
        title: 'Bohr Model & Spectrum',
        completionPercentage: 90,
        subtopics: [
          { id: 'a1', title: 'Radius, Velocity & Energy Formulas', completed: true },
          { id: 'a2', title: 'Hydrogen Spectral Lines & Rydberg Formula', completed: true },
        ],
      },
      {
        id: 'jm-ch-2-t2',
        title: 'Quantum Mechanical Model',
        completionPercentage: 60,
        subtopics: [
          { id: 'a3', title: 'De Broglie & Heisenberg Uncertainty', completed: true },
          { id: 'a4', title: 'Quantum Numbers (n, l, m, s) & Nodes', completed: true },
          { id: 'a5', title: 'Aufbau, Pauli & Hund Rules', completed: false },
        ],
      },
    ],
    metrics: {
      lecturesCompleted: 5,
      totalLectures: 6,
      dppsCompleted: 4,
      totalDpps: 5,
      questionsPracticed: 48,
      pyqsSolved: 30,
      totalPyqs: 40,
      pyqAccuracy: 80,
      mockQuestionsAttempted: 14,
      formulasRevised: true,
      notesCompleted: true,
      revisionCompleted: false,
    },
    overallProgress: 75,
    healthStatus: 'Strong',
  },
  {
    id: 'jm-ch-3',
    exam: 'JEE Main',
    name: 'Chemical Bonding & Molecular Structure',
    subject: 'Chemistry',
    category: 'Inorganic',
    classGrade: '11',
    weightage: 'High',
    status: 'In Progress',
    prerequisites: ['jm-ch-2'],
    prerequisiteNames: ['Atomic Structure & Quantum Numbers'],
    topics: [
      {
        id: 'jm-ch-3-t1',
        title: 'VSEPR Theory & Hybridization',
        completionPercentage: 85,
        subtopics: [
          { id: 'b1', title: 'Steric Number & Molecular Geometry', completed: true },
          { id: 'b2', title: 'sp, sp2, sp3, sp3d, sp3d2 Hybridization', completed: true },
          { id: 'b3', title: 'Dipole Moment & Fajan Rules', completed: false },
        ],
      },
      {
        id: 'jm-ch-3-t2',
        title: 'Molecular Orbital Theory (MOT)',
        completionPercentage: 70,
        subtopics: [
          { id: 'b4', title: 'Bond Order, Magnetic Behavior & Energy Diagrams', completed: true },
          { id: 'b5', title: 'Hydrogen Bonding & Intermolecular Forces', completed: false },
        ],
      },
    ],
    metrics: {
      lecturesCompleted: 6,
      totalLectures: 8,
      dppsCompleted: 5,
      totalDpps: 6,
      questionsPracticed: 65,
      pyqsSolved: 42,
      totalPyqs: 55,
      pyqAccuracy: 84,
      mockQuestionsAttempted: 20,
      formulasRevised: true,
      notesCompleted: true,
      revisionCompleted: false,
    },
    overallProgress: 78,
    healthStatus: 'Strong',
  },
  {
    id: 'jm-ch-4',
    exam: 'JEE Main',
    name: 'General Organic Chemistry (GOC) & Isomerism',
    subject: 'Chemistry',
    category: 'Organic',
    classGrade: '11',
    weightage: 'High',
    status: 'In Progress',
    prerequisites: ['jm-ch-3'],
    prerequisiteNames: ['Chemical Bonding & Molecular Structure'],
    topics: [
      {
        id: 'jm-ch-4-t1',
        title: 'Electronic Effects & Reaction Intermediates',
        completionPercentage: 80,
        subtopics: [
          { id: 'g1', title: 'Inductive, Resonance & Hyperconjugation', completed: true },
          { id: 'g2', title: 'Carbocations, Carbanions & Free Radicals Stability', completed: true },
          { id: 'g3', title: 'Acidic & Basic Strength Comparisons', completed: false },
        ],
      },
      {
        id: 'jm-ch-4-t2',
        title: 'Structural & Stereoisomerism',
        completionPercentage: 60,
        subtopics: [
          { id: 'g4', title: 'Tautomerism & Geometrical Isomerism', completed: true },
          { id: 'g5', title: 'Optical Isomerism, Chirality & Enantiomers', completed: false },
        ],
      },
    ],
    metrics: {
      lecturesCompleted: 7,
      totalLectures: 9,
      dppsCompleted: 5,
      totalDpps: 7,
      questionsPracticed: 70,
      pyqsSolved: 40,
      totalPyqs: 60,
      pyqAccuracy: 75,
      mockQuestionsAttempted: 18,
      formulasRevised: true,
      notesCompleted: true,
      revisionCompleted: false,
    },
    overallProgress: 70,
    healthStatus: 'Average',
  },

  // --- MATHEMATICS ---
  {
    id: 'jm-math-1',
    exam: 'JEE Main',
    name: 'Basic Mathematics, Sets & Quadratic Equations',
    subject: 'Mathematics',
    classGrade: '11',
    weightage: 'High',
    status: 'Completed',
    prerequisites: [],
    prerequisiteNames: [],
    topics: [
      {
        id: 'jm-m1-t1',
        title: 'Wavy Curve Method & Inequalities',
        completionPercentage: 100,
        subtopics: [
          { id: 'm1', title: 'Polynomial & Modulus Inequalities', completed: true },
          { id: 'm2', title: 'Logarithmic Properties & Equations', completed: true },
        ],
      },
      {
        id: 'jm-m1-t2',
        title: 'Quadratic Equations & Roots Location',
        completionPercentage: 100,
        subtopics: [
          { id: 'm3', title: 'Sum & Product of Roots, Discriminant', completed: true },
          { id: 'm4', title: 'Location of Roots & Common Roots', completed: true },
        ],
      },
    ],
    metrics: {
      lecturesCompleted: 6,
      totalLectures: 6,
      dppsCompleted: 5,
      totalDpps: 5,
      questionsPracticed: 60,
      pyqsSolved: 35,
      totalPyqs: 35,
      pyqAccuracy: 92,
      mockQuestionsAttempted: 15,
      formulasRevised: true,
      notesCompleted: true,
      revisionCompleted: true,
    },
    overallProgress: 100,
    healthStatus: 'Strong',
  },
  {
    id: 'jm-math-2',
    exam: 'JEE Main',
    name: 'Functions & Relations',
    subject: 'Mathematics',
    classGrade: '12',
    weightage: 'High',
    status: 'In Progress',
    prerequisites: ['jm-math-1'],
    prerequisiteNames: ['Basic Mathematics, Sets & Quadratic Equations'],
    topics: [
      {
        id: 'jm-m2-t1',
        title: 'Domain, Range & Types of Functions',
        completionPercentage: 85,
        subtopics: [
          { id: 'f1', title: 'Domain Rules for Roots & Logs', completed: true },
          { id: 'f2', title: 'Range Determination Techniques', completed: true },
          { id: 'f3', title: 'One-One, Many-One, Onto & Into Functions', completed: false },
        ],
      },
      {
        id: 'jm-m2-t2',
        title: 'Composite & Inverse Functions',
        completionPercentage: 70,
        subtopics: [
          { id: 'f4', title: 'f(g(x)) Domain & Range', completed: true },
          { id: 'f5', title: 'Inverse Function Existence & Calculation', completed: false },
        ],
      },
    ],
    metrics: {
      lecturesCompleted: 6,
      totalLectures: 8,
      dppsCompleted: 4,
      totalDpps: 6,
      questionsPracticed: 55,
      pyqsSolved: 32,
      totalPyqs: 45,
      pyqAccuracy: 76,
      mockQuestionsAttempted: 16,
      formulasRevised: true,
      notesCompleted: true,
      revisionCompleted: false,
    },
    overallProgress: 76,
    healthStatus: 'Strong',
  },
  {
    id: 'jm-math-3',
    exam: 'JEE Main',
    name: 'Limits, Continuity & Differentiability',
    subject: 'Mathematics',
    classGrade: '12',
    weightage: 'High',
    status: 'In Progress',
    prerequisites: ['jm-math-2'],
    prerequisiteNames: ['Functions & Relations'],
    topics: [
      {
        id: 'jm-m3-t1',
        title: 'Limits & Indeterminate Forms',
        completionPercentage: 80,
        subtopics: [
          { id: 'l1', title: 'L’Hôpital Rule & Standard Limits', completed: true },
          { id: 'l2', title: '1^infinity Form & Expansion Methods', completed: true },
        ],
      },
      {
        id: 'jm-m3-t2',
        title: 'Continuity & Differentiability Tests',
        completionPercentage: 60,
        subtopics: [
          { id: 'l3', title: 'Types of Discontinuity', completed: true },
          { id: 'l4', title: 'Left & Right Hand Derivative Criteria', completed: false },
        ],
      },
    ],
    metrics: {
      lecturesCompleted: 5,
      totalLectures: 7,
      dppsCompleted: 4,
      totalDpps: 5,
      questionsPracticed: 50,
      pyqsSolved: 28,
      totalPyqs: 42,
      pyqAccuracy: 70,
      mockQuestionsAttempted: 12,
      formulasRevised: true,
      notesCompleted: true,
      revisionCompleted: false,
    },
    overallProgress: 68,
    healthStatus: 'Average',
  },
  {
    id: 'jm-math-4',
    exam: 'JEE Main',
    name: 'Application of Derivatives (AOD)',
    subject: 'Mathematics',
    classGrade: '12',
    weightage: 'High',
    status: 'Learning',
    prerequisites: ['jm-math-3'],
    prerequisiteNames: ['Limits, Continuity & Differentiability'],
    topics: [
      {
        id: 'jm-m4-t1',
        title: 'Tangents, Normals & Rate Measure',
        completionPercentage: 50,
        subtopics: [
          { id: 'aod1', title: 'Slope of Tangent & Angle of Intersection', completed: true },
          { id: 'aod2', title: 'Rate of Change Problems', completed: false },
        ],
      },
      {
        id: 'jm-m4-t2',
        title: 'Monotonicity & Maxima-Minima',
        completionPercentage: 30,
        subtopics: [
          { id: 'aod3', title: 'First & Second Derivative Tests', completed: true },
          { id: 'aod4', title: 'Global Maxima/Minima on Intervals', completed: false },
        ],
      },
    ],
    metrics: {
      lecturesCompleted: 3,
      totalLectures: 8,
      dppsCompleted: 2,
      totalDpps: 6,
      questionsPracticed: 30,
      pyqsSolved: 15,
      totalPyqs: 50,
      pyqAccuracy: 58,
      mockQuestionsAttempted: 8,
      formulasRevised: false,
      notesCompleted: false,
      revisionCompleted: false,
    },
    overallProgress: 38,
    healthStatus: 'Weak',
  },
];

// -------------------------------------------------------------
// JEE ADVANCED SYLLABUS
// -------------------------------------------------------------
export const INITIAL_JEE_ADVANCED_SMART: SmartChapter[] = INITIAL_JEE_MAIN_SMART.map((ch) => ({
  ...ch,
  id: 'ja-' + ch.id,
  exam: 'JEE Advanced',
  weightage: 'High',
  metrics: {
    ...ch.metrics,
    totalPyqs: ch.metrics.totalPyqs + 25,
    pyqAccuracy: Math.max(45, ch.metrics.pyqAccuracy - 10),
  },
}));

// -------------------------------------------------------------
// NEET SYLLABUS
// -------------------------------------------------------------
export const INITIAL_NEET_SMART: SmartChapter[] = [
  ...INITIAL_JEE_MAIN_SMART.filter((c) => c.subject !== 'Mathematics').map((c) => ({
    ...c,
    id: 'nt-' + c.id,
    exam: 'NEET' as SyllabusExamType,
  })),

  // BOTANY
  {
    id: 'nt-bot-1',
    exam: 'NEET',
    name: 'Cell: Structure, Organelles & Cell Cycle',
    subject: 'Biology',
    category: 'Botany',
    classGrade: '11',
    weightage: 'High',
    status: 'In Progress',
    prerequisites: [],
    prerequisiteNames: [],
    topics: [
      {
        id: 'nt-b1-t1',
        title: 'Cell Organelles & Endomembrane System',
        completionPercentage: 90,
        subtopics: [
          { id: 'bo1', title: 'Prokaryotic vs Eukaryotic Cell Wall', completed: true },
          { id: 'bo2', title: 'Mitochondria, Plastids & Ribosomes', completed: true },
          { id: 'bo3', title: 'Endoplasmic Reticulum & Golgi Apparatus', completed: true },
        ],
      },
      {
        id: 'nt-b1-t2',
        title: 'Cell Cycle, Mitosis & Meiosis',
        completionPercentage: 80,
        subtopics: [
          { id: 'bo4', title: 'Phases of Cell Cycle (G1, S, G2, M)', completed: true },
          { id: 'bo5', title: 'Stages of Meiosis I & Recombination', completed: true },
          { id: 'bo6', title: 'Significance of Reduction Division', completed: false },
        ],
      },
    ],
    metrics: {
      lecturesCompleted: 6,
      totalLectures: 7,
      dppsCompleted: 5,
      totalDpps: 5,
      questionsPracticed: 90,
      pyqsSolved: 65,
      totalPyqs: 75,
      pyqAccuracy: 88,
      mockQuestionsAttempted: 30,
      formulasRevised: true,
      notesCompleted: true,
      revisionCompleted: false,
    },
    overallProgress: 84,
    healthStatus: 'Strong',
  },
  {
    id: 'nt-bot-2',
    exam: 'NEET',
    name: 'Photosynthesis in Higher Plants',
    subject: 'Biology',
    category: 'Botany',
    classGrade: '11',
    weightage: 'High',
    status: 'In Progress',
    prerequisites: ['nt-bot-1'],
    prerequisiteNames: ['Cell: Structure, Organelles & Cell Cycle'],
    topics: [
      {
        id: 'nt-b2-t1',
        title: 'Light Reactions & Photophosphorylation',
        completionPercentage: 80,
        subtopics: [
          { id: 'p1', title: 'Chloroplast Anatomy & Pigments', completed: true },
          { id: 'p2', title: 'Cyclic & Non-Cyclic Photophosphorylation', completed: true },
          { id: 'p3', title: 'Chemiosmotic Hypothesis', completed: false },
        ],
      },
      {
        id: 'nt-b2-t2',
        title: 'Dark Reactions & C3/C4 Pathways',
        completionPercentage: 60,
        subtopics: [
          { id: 'p4', title: 'Calvin Cycle (C3 Pathway)', completed: true },
          { id: 'p5', title: 'Hatch and Slack Pathway (C4 Plants)', completed: true },
          { id: 'p6', title: 'Photorespiration (C2 Cycle)', completed: false },
        ],
      },
    ],
    metrics: {
      lecturesCompleted: 5,
      totalLectures: 6,
      dppsCompleted: 4,
      totalDpps: 5,
      questionsPracticed: 75,
      pyqsSolved: 48,
      totalPyqs: 60,
      pyqAccuracy: 82,
      mockQuestionsAttempted: 25,
      formulasRevised: true,
      notesCompleted: true,
      revisionCompleted: false,
    },
    overallProgress: 74,
    healthStatus: 'Strong',
  },
  {
    id: 'nt-bot-3',
    exam: 'NEET',
    name: 'Genetics & Molecular Basis of Inheritance',
    subject: 'Biology',
    category: 'Botany',
    classGrade: '12',
    weightage: 'High',
    status: 'In Progress',
    prerequisites: ['nt-bot-1'],
    prerequisiteNames: ['Cell: Structure, Organelles & Cell Cycle'],
    topics: [
      {
        id: 'nt-b3-t1',
        title: 'Mendelian Principles & Pedigree Analysis',
        completionPercentage: 85,
        subtopics: [
          { id: 'g1', title: 'Monohybrid & Dihybrid Crosses', completed: true },
          { id: 'g2', title: 'Incomplete Dominance & Co-Dominance', completed: true },
          { id: 'g3', title: 'Pedigree Chart Symbols & Disease Inheritance', completed: false },
        ],
      },
      {
        id: 'nt-b3-t2',
        title: 'DNA Replication, Transcription & Translation',
        completionPercentage: 70,
        subtopics: [
          { id: 'g4', title: 'Hershey-Chase & Meselson-Stahl Experiment', completed: true },
          { id: 'g5', title: 'Transcription Unit & Lac Operon Concept', completed: true },
          { id: 'g6', title: 'Genetic Code Features & tRNA Structure', completed: false },
        ],
      },
    ],
    metrics: {
      lecturesCompleted: 8,
      totalLectures: 10,
      dppsCompleted: 6,
      totalDpps: 8,
      questionsPracticed: 110,
      pyqsSolved: 70,
      totalPyqs: 90,
      pyqAccuracy: 80,
      mockQuestionsAttempted: 35,
      formulasRevised: true,
      notesCompleted: true,
      revisionCompleted: false,
    },
    overallProgress: 78,
    healthStatus: 'Strong',
  },

  // ZOOLOGY
  {
    id: 'nt-zoo-1',
    exam: 'NEET',
    name: 'Human Physiology: Circulation & Excretion',
    subject: 'Biology',
    category: 'Zoology',
    classGrade: '11',
    weightage: 'High',
    status: 'In Progress',
    prerequisites: ['nt-bot-1'],
    prerequisiteNames: ['Cell: Structure, Organelles & Cell Cycle'],
    topics: [
      {
        id: 'nt-z1-t1',
        title: 'Blood Composition & Cardiac Cycle',
        completionPercentage: 90,
        subtopics: [
          { id: 'z1', title: 'Blood Formed Elements & Coagulation', completed: true },
          { id: 'z2', title: 'Human Heart Structure & ECG Interpretation', completed: true },
          { id: 'z3', title: 'Double Circulation & Regulation', completed: false },
        ],
      },
      {
        id: 'nt-z1-t2',
        title: 'Nephron Function & Counter Current Mechanism',
        completionPercentage: 75,
        subtopics: [
          { id: 'z4', title: 'Glomerular Filtration Rate (GFR)', completed: true },
          { id: 'z5', title: 'Counter Current Mechanism in Henle Loop', completed: true },
          { id: 'z6', title: 'RAAS & ADH Hormonal Regulation', completed: false },
        ],
      },
    ],
    metrics: {
      lecturesCompleted: 7,
      totalLectures: 8,
      dppsCompleted: 5,
      totalDpps: 6,
      questionsPracticed: 85,
      pyqsSolved: 55,
      totalPyqs: 70,
      pyqAccuracy: 85,
      mockQuestionsAttempted: 28,
      formulasRevised: true,
      notesCompleted: true,
      revisionCompleted: false,
    },
    overallProgress: 81,
    healthStatus: 'Strong',
  },
  {
    id: 'nt-zoo-2',
    exam: 'NEET',
    name: 'Neural Control & Chemical Coordination',
    subject: 'Biology',
    category: 'Zoology',
    classGrade: '11',
    weightage: 'High',
    status: 'In Progress',
    prerequisites: ['nt-zoo-1'],
    prerequisiteNames: ['Human Physiology: Circulation & Excretion'],
    topics: [
      {
        id: 'nt-z2-t1',
        title: 'Nerve Impulse Conduction & Synapse',
        completionPercentage: 80,
        subtopics: [
          { id: 'n1', title: 'Resting Potential & Action Potential Propagation', completed: true },
          { id: 'n2', title: 'Chemical vs Electrical Synapse Transmission', completed: true },
        ],
      },
      {
        id: 'nt-z2-t2',
        title: 'Endocrine Glands & Hormone Mechanisms',
        completionPercentage: 60,
        subtopics: [
          { id: 'n3', title: 'Hypothalamus & Pituitary Gland Axes', completed: true },
          { id: 'n4', title: 'Thyroid, Adrenal & Pancreas Hormones', completed: true },
          { id: 'n5', title: 'Peptide vs Steroid Hormone Mechanism', completed: false },
        ],
      },
    ],
    metrics: {
      lecturesCompleted: 6,
      totalLectures: 7,
      dppsCompleted: 4,
      totalDpps: 5,
      questionsPracticed: 65,
      pyqsSolved: 40,
      totalPyqs: 55,
      pyqAccuracy: 78,
      mockQuestionsAttempted: 20,
      formulasRevised: true,
      notesCompleted: true,
      revisionCompleted: false,
    },
    overallProgress: 72,
    healthStatus: 'Strong',
  },
  {
    id: 'nt-zoo-3',
    exam: 'NEET',
    name: 'Human Reproduction & Reproductive Health',
    subject: 'Biology',
    category: 'Zoology',
    classGrade: '12',
    weightage: 'High',
    status: 'In Progress',
    prerequisites: ['nt-zoo-2'],
    prerequisiteNames: ['Neural Control & Chemical Coordination'],
    topics: [
      {
        id: 'nt-z3-t1',
        title: 'Gametogenesis & Menstrual Cycle',
        completionPercentage: 85,
        subtopics: [
          { id: 'r1', title: 'Spermatogenesis vs Oogenesis Timeline', completed: true },
          { id: 'r2', title: 'FSH, LH, Estrogen & Progesterone Fluctuations', completed: true },
          { id: 'r3', title: 'Fertilization & Blastocyst Implantation', completed: false },
        ],
      },
      {
        id: 'nt-z3-t2',
        title: 'Contraception & Assisted Reproduction (ART)',
        completionPercentage: 70,
        subtopics: [
          { id: 'r4', title: 'Barrier, IUD & Hormonal Contraceptives', completed: true },
          { id: 'r5', title: 'IVF, ZIFT, GIFT, ICSI Techniques', completed: true },
        ],
      },
    ],
    metrics: {
      lecturesCompleted: 6,
      totalLectures: 7,
      dppsCompleted: 4,
      totalDpps: 5,
      questionsPracticed: 70,
      pyqsSolved: 45,
      totalPyqs: 60,
      pyqAccuracy: 84,
      mockQuestionsAttempted: 22,
      formulasRevised: true,
      notesCompleted: true,
      revisionCompleted: false,
    },
    overallProgress: 77,
    healthStatus: 'Strong',
  },
];

export function getInitialSmartSyllabus(exam: SyllabusExamType): SmartChapter[] {
  if (exam === 'JEE Advanced') {
    return INITIAL_JEE_ADVANCED_SMART.map(calculateChapterProgress);
  }
  if (exam === 'NEET') {
    return INITIAL_NEET_SMART.map(calculateChapterProgress);
  }
  return INITIAL_JEE_MAIN_SMART.map(calculateChapterProgress);
}

// Backward compatibility exports
export const INITIAL_JEE_SYLLABUS: SyllabusChapter[] = INITIAL_JEE_MAIN_SMART.map((c) => ({
  id: c.id,
  name: c.name,
  subject: c.subject,
  category: c.category,
  classGrade: c.classGrade,
  weightage: c.weightage,
  status: 'Learning',
  topics: c.topics.map((t) => ({
    id: t.id,
    title: t.title,
    status: 'Learning',
    subtopics: t.subtopics?.map((s) => s.title),
  })),
  totalQuestionsCount: c.metrics.totalPyqs,
  completedQuestionsCount: c.metrics.pyqsSolved,
}));

export const INITIAL_NEET_SYLLABUS: SyllabusChapter[] = INITIAL_NEET_SMART.map((c) => ({
  id: c.id,
  name: c.name,
  subject: c.subject,
  category: c.category,
  classGrade: c.classGrade,
  weightage: c.weightage,
  status: 'Learning',
  topics: c.topics.map((t) => ({
    id: t.id,
    title: t.title,
    status: 'Learning',
    subtopics: t.subtopics?.map((s) => s.title),
  })),
  totalQuestionsCount: c.metrics.totalPyqs,
  completedQuestionsCount: c.metrics.pyqsSolved,
}));
