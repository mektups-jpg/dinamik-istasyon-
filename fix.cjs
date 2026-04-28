const fs = require('fs');

const changes = {
    'fraction-reactor-3': 3,
    'data-capsule-4': 4,
    'zero-engine-4': 4,
    'neon-route': 5,
    'magnitude-core': 5,
    'equation-lab': 5,
    'fraction-synchronizer': 5,
    'trig-pendulum': 11,
    'algebraic-dimensions': 8,
    'absolute-value': 6,
    'coord-terminal': 8,
    'gear-ratio': 7,
    'number-line': 1,
    'number-line-sub': 1,
    'base-10-factory': 2,
    'unit-circle': 11,
    'cylinder-3d': 8,
    'prism-3d': 8,
    'cube-3d': 8,
    'pyramid-3d': 8,
    'cone-3d': 8,
    'vector-design-panel': 5,
    'triangular-prism-3d': 8,
    'galton-board': 12,
    'identity-blocks': 7,
    'laser-defense': 11,
    'pythagoras': 8,
    'slope-rollercoaster': 11,
    'polygon-collision-test': 5,
    'optic-laser-lab': 6,
    'area-pi-lab': 6
};

// Lets read it, split by `id: '...',`
let content = fs.readFileSync('src/registry/moduleRegistry.ts', 'utf8');

// replace "grade: <num>," back to a placeholder so we can uniformly fix it.
content = content.replace(/gradeRange:\s*'[^']+'/g, 'GRADE_PLACEHOLDER');
content = content.replace(/grade:\s*\d+/g, 'GRADE_PLACEHOLDER');

let parts = content.split('id: \'');
for (let i = 1; i < parts.length; i++) {
   const idMatch = parts[i].match(/^([^']+)'/);
   if (idMatch) {
       const id = idMatch[1];
       if (changes[id] !== undefined) {
           parts[i] = parts[i].replace('GRADE_PLACEHOLDER', `grade: ${changes[id]}`);
       } else {
           console.warn(`Id not found in changes: ${id}`);
           parts[i] = parts[i].replace('GRADE_PLACEHOLDER', `grade: 8`);
       }
   }
}

fs.writeFileSync('src/registry/moduleRegistry.ts', parts.join('id: \''));
