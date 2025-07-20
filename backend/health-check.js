#!/usr/bin/env node

/**
 * 🏥 QUICK API HEALTH CHECK
 * Tests all endpoints quickly to verify they're responding
 */

const BASE_URL = 'http://localhost:3300/api/v1';

const endpoints = [
    // Project endpoints (public)
    { method: 'GET', url: `${BASE_URL}/project`, name: 'Browse Projects' },
    { method: 'GET', url: `${BASE_URL}/project/trending`, name: 'Trending Projects' },
    { method: 'GET', url: `${BASE_URL}/project/most-liked`, name: 'Most Liked Projects' },

    // Gigs endpoints (public)
    { method: 'GET', url: `${BASE_URL}/gig`, name: 'Browse Gigs' },

    // Test with query parameters
    { method: 'GET', url: `${BASE_URL}/project?page=1&limit=5`, name: 'Projects with Pagination' },
    { method: 'GET', url: `${BASE_URL}/gig?page=1&limit=5&search=test`, name: 'Gigs with Search' },
];

console.log('🏥 Starting API Health Check...\n');

async function checkEndpoint(endpoint) {
    try {
        const response = await fetch(endpoint.url);
        const status = response.status;
        const statusIcon = status === 200 ? '✅' : '❌';

        console.log(`${statusIcon} ${endpoint.name}: ${status}`);

        if (status === 200) {
            const data = await response.json();
            console.log(`   📊 Response structure: ${JSON.stringify(Object.keys(data), null, 2)}`);
        } else {
            console.log(`   ❗ Error: ${response.statusText}`);
        }
    } catch (error) {
        console.log(`❌ ${endpoint.name}: ERROR - ${error.message}`);
    }
    console.log(''); // Add spacing
}

async function runHealthCheck() {
    for (const endpoint of endpoints) {
        await checkEndpoint(endpoint);
    }

    console.log('🏁 Health check completed!');
}

// Check if fetch is available (Node 18+)
if (typeof fetch === 'undefined') {
    console.log('❌ This script requires Node.js 18+ or you need to install node-fetch');
    console.log('💡 Install node-fetch: npm install node-fetch');
    console.log('💡 Or use: node --experimental-fetch health-check.js');
} else {
    runHealthCheck();
}
