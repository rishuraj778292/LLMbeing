/**
 * Content Filter Test
 * Test the content validation functionality
 */

import contentFilter from './contentFilter.js';

// Test cases
const testProjects = [
    {
        title: "Build a React Dashboard",
        description: "I need a professional dashboard built with React and Material-UI. The dashboard should display analytics data and user management features.",
        legitimate: true
    },
    {
        title: "Adult Content Website",
        description: "Need to build a porn website with payment integration",
        legitimate: false
    },
    {
        title: "Dating App Development",
        description: "Build a professional dating application with matching algorithms and secure messaging",
        legitimate: true
    },
    {
        title: "Fucking amazing website",
        description: "This shit needs to be built quickly",
        legitimate: false
    }
];

console.log('Content Filter Test Results:');
console.log('================================');

testProjects.forEach((project, index) => {
    console.log(`\nTest ${index + 1}: ${project.title}`);
    console.log(`Expected: ${project.legitimate ? 'PASS' : 'FAIL'}`);

    const validation = contentFilter.validateProject(project);
    console.log(`Result: ${validation.isValid ? 'PASS' : 'FAIL'}`);

    if (!validation.isValid) {
        console.log(`Reason: ${contentFilter.getErrorMessage(validation.violatedFields)}`);
        console.log(`Violated fields: ${validation.violatedFields.map(f => f.field).join(', ')}`);
    }

    console.log(`Status: ${(validation.isValid === project.legitimate) ? '✅ CORRECT' : '❌ INCORRECT'}`);
});

export { testProjects };
