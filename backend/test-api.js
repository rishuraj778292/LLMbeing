#!/usr/bin/env node

/**
 * 🧪 COMPREHENSIVE API TESTING SCRIPT
 * Tests all Project and Gigs API endpoints
 * 
 * Usage: node test-api.js
 * Prerequisites: Server should be running on localhost:3300
 */

import fetch from 'node-fetch';
import fs from 'fs';

const BASE_URL = 'http://localhost:3300/api/v1';
const TEST_RESULTS = [];

// Test user credentials (you'll need to register these first)
const TEST_CLIENT = {
    email: 'client@test.com',
    password: 'password123'
};

const TEST_FREELANCER = {
    email: 'freelancer@test.com',
    password: 'password123'
};

let clientToken = '';
let freelancerToken = '';
let testProjectId = '';
let testGigId = '';

// Utility functions
const log = (message, type = 'INFO') => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${type}: ${message}`;
    console.log(logMessage);
    TEST_RESULTS.push(logMessage);
};

const makeRequest = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        const data = await response.json();
        return { response, data, status: response.status };
    } catch (error) {
        return { error: error.message, status: 500 };
    }
};

const setCookie = (headers, token) => {
    return {
        ...headers,
        'Cookie': `accessToken=${token}`
    };
};

// Test Authentication
const testAuth = async () => {
    log('🔐 Testing Authentication...', 'TEST');

    // Test client login
    const clientLogin = await makeRequest(`${BASE_URL}/user/login`, {
        method: 'POST',
        body: JSON.stringify(TEST_CLIENT)
    });

    if (clientLogin.status === 200) {
        // Extract token from Set-Cookie header (you might need to adjust this)
        clientToken = 'your-client-token'; // You'll need to get this from the response
        log('✅ Client login successful');
    } else {
        log('❌ Client login failed: ' + JSON.stringify(clientLogin.data), 'ERROR');
        return false;
    }

    // Test freelancer login
    const freelancerLogin = await makeRequest(`${BASE_URL}/user/login`, {
        method: 'POST',
        body: JSON.stringify(TEST_FREELANCER)
    });

    if (freelancerLogin.status === 200) {
        freelancerToken = 'your-freelancer-token'; // You'll need to get this from the response
        log('✅ Freelancer login successful');
    } else {
        log('❌ Freelancer login failed: ' + JSON.stringify(freelancerLogin.data), 'ERROR');
        return false;
    }

    return true;
};

// Test Project APIs
const testProjectAPIs = async () => {
    log('📋 Testing Project APIs...', 'TEST');

    // 1. GET /projects - Browse all projects (Public)
    const browseProjects = await makeRequest(`${BASE_URL}/project`);
    log(`GET /projects: ${browseProjects.status === 200 ? '✅' : '❌'} (${browseProjects.status})`);

    // 2. GET /projects/trending - Get trending projects (Public)
    const trendingProjects = await makeRequest(`${BASE_URL}/project/trending`);
    log(`GET /projects/trending: ${trendingProjects.status === 200 ? '✅' : '❌'} (${trendingProjects.status})`);

    // 3. GET /projects/most-liked - Get most liked projects (Public)
    const mostLikedProjects = await makeRequest(`${BASE_URL}/project/most-liked`);
    log(`GET /projects/most-liked: ${mostLikedProjects.status === 200 ? '✅' : '❌'} (${mostLikedProjects.status})`);

    // 4. POST /projects - Create project (Client only)
    const testProject = {
        title: "Test API Project for Testing",
        description: "This is a test project created by the API testing script to verify project creation functionality.",
        projectCategory: "web_development",
        skillsRequired: ["JavaScript", "Node.js", "Express"],
        experienceLevel: "intermediate",
        projectType: "one_time",
        budget: {
            min: 1000,
            max: 2000,
            isNegotiable: true
        }
    };

    const createProject = await makeRequest(`${BASE_URL}/project`, {
        method: 'POST',
        headers: setCookie({}, clientToken),
        body: JSON.stringify(testProject)
    });

    if (createProject.status === 201) {
        testProjectId = createProject.data.data._id;
        log(`✅ POST /projects: Success (${createProject.status}) - Project ID: ${testProjectId}`);
    } else {
        log(`❌ POST /projects: Failed (${createProject.status}) - ${JSON.stringify(createProject.data)}`, 'ERROR');
    }

    // 5. GET /projects/:id - Get project details
    if (testProjectId) {
        const projectDetails = await makeRequest(`${BASE_URL}/project/${testProjectId}`);
        log(`GET /projects/:id: ${projectDetails.status === 200 ? '✅' : '❌'} (${projectDetails.status})`);
    }

    // 6. GET /projects/my/projects - Get own projects (Client only)
    const ownProjects = await makeRequest(`${BASE_URL}/project/my/projects`, {
        headers: setCookie({}, clientToken)
    });
    log(`GET /projects/my/projects: ${ownProjects.status === 200 ? '✅' : '❌'} (${ownProjects.status})`);

    // 7. PUT /projects/:id - Update project (Client only)
    if (testProjectId) {
        const updateProject = await makeRequest(`${BASE_URL}/project/${testProjectId}`, {
            method: 'PUT',
            headers: setCookie({}, clientToken),
            body: JSON.stringify({ title: "Updated Test Project Title" })
        });
        log(`PUT /projects/:id: ${updateProject.status === 200 ? '✅' : '❌'} (${updateProject.status})`);
    }

    // 8. PUT /projects/:id/status - Update project status (Client only)
    if (testProjectId) {
        const updateStatus = await makeRequest(`${BASE_URL}/project/${testProjectId}/status`, {
            method: 'PUT',
            headers: setCookie({}, clientToken),
            body: JSON.stringify({ status: "active" })
        });
        log(`PUT /projects/:id/status: ${updateStatus.status === 200 ? '✅' : '❌'} (${updateStatus.status})`);
    }

    // 9. DELETE /projects/:id - Delete project (Client only) - Do this last
    if (testProjectId) {
        const deleteProject = await makeRequest(`${BASE_URL}/project/${testProjectId}`, {
            method: 'DELETE',
            headers: setCookie({}, clientToken)
        });
        log(`DELETE /projects/:id: ${deleteProject.status === 200 ? '✅' : '❌'} (${deleteProject.status})`);
    }
};

// Test Gigs APIs
const testGigsAPIs = async () => {
    log('🚀 Testing Gigs APIs...', 'TEST');

    // 1. GET /gigs - Browse all gigs (Public)
    const browseGigs = await makeRequest(`${BASE_URL}/gig`);
    log(`GET /gigs: ${browseGigs.status === 200 ? '✅' : '❌'} (${browseGigs.status})`);

    // 2. POST /gigs - Create gig (Freelancer only)
    const testGig = {
        title: "Test API Gig for Testing Purposes",
        description: "This is a test gig created by the API testing script to verify gig creation functionality. It includes all required fields.",
        category: "web_development",
        skills: ["JavaScript", "Node.js", "Express", "API Testing"],
        price: 299,
        deliveryTime: 7,
        packages: [
            {
                name: "Basic",
                description: "Basic package for testing",
                price: 299,
                deliveryTime: 7,
                features: ["Basic functionality", "Documentation", "1 revision"],
                revisions: 1
            }
        ],
        tags: ["api", "testing", "web-development"],
        requirements: ["Provide test requirements", "Specify testing scope"]
    };

    const createGig = await makeRequest(`${BASE_URL}/gig`, {
        method: 'POST',
        headers: setCookie({}, freelancerToken),
        body: JSON.stringify(testGig)
    });

    if (createGig.status === 201) {
        testGigId = createGig.data.data._id;
        log(`✅ POST /gigs: Success (${createGig.status}) - Gig ID: ${testGigId}`);
    } else {
        log(`❌ POST /gigs: Failed (${createGig.status}) - ${JSON.stringify(createGig.data)}`, 'ERROR');
    }

    // 3. GET /gigs/:id - Get gig details
    if (testGigId) {
        const gigDetails = await makeRequest(`${BASE_URL}/gig/${testGigId}`);
        log(`GET /gigs/:id: ${gigDetails.status === 200 ? '✅' : '❌'} (${gigDetails.status})`);
    }

    // 4. GET /gigs/my-gigs - Get own gigs (Freelancer only)
    const ownGigs = await makeRequest(`${BASE_URL}/gig/my-gigs`, {
        headers: setCookie({}, freelancerToken)
    });
    log(`GET /gigs/my-gigs: ${ownGigs.status === 200 ? '✅' : '❌'} (${ownGigs.status})`);

    // 5. PUT /gigs/:id - Update gig (Freelancer only)
    if (testGigId) {
        const updateGig = await makeRequest(`${BASE_URL}/gig/${testGigId}`, {
            method: 'PUT',
            headers: setCookie({}, freelancerToken),
            body: JSON.stringify({ title: "Updated Test Gig Title", price: 349 })
        });
        log(`PUT /gigs/:id: ${updateGig.status === 200 ? '✅' : '❌'} (${updateGig.status})`);
    }

    // 6. PUT /gigs/:id/status - Update gig status (Freelancer only)
    if (testGigId) {
        const updateStatus = await makeRequest(`${BASE_URL}/gig/${testGigId}/status`, {
            method: 'PUT',
            headers: setCookie({}, freelancerToken),
            body: JSON.stringify({ status: "paused" })
        });
        log(`PUT /gigs/:id/status: ${updateStatus.status === 200 ? '✅' : '❌'} (${updateStatus.status})`);
    }

    // 7. DELETE /gigs/:id - Delete gig (Freelancer only) - Do this last
    if (testGigId) {
        const deleteGig = await makeRequest(`${BASE_URL}/gig/${testGigId}`, {
            method: 'DELETE',
            headers: setCookie({}, freelancerToken)
        });
        log(`DELETE /gigs/:id: ${deleteGig.status === 200 ? '✅' : '❌'} (${deleteGig.status})`);
    }
};

// Test Advanced Features
const testAdvancedFeatures = async () => {
    log('🔍 Testing Advanced Features...', 'TEST');

    // Test filtering and pagination
    const filterTests = [
        `${BASE_URL}/project?page=1&limit=5&search=test`,
        `${BASE_URL}/project?sortBy=newest&budgetMin=500&budgetMax=2000`,
        `${BASE_URL}/gig?page=1&limit=5&search=development`,
        `${BASE_URL}/gig?category=web_development&sortBy=price&sortOrder=asc`
    ];

    for (const url of filterTests) {
        const result = await makeRequest(url);
        const endpoint = url.split('?')[0].split('/').pop();
        log(`Filter test ${endpoint}: ${result.status === 200 ? '✅' : '❌'} (${result.status})`);
    }
};

// Main test runner
const runTests = async () => {
    log('🧪 Starting Comprehensive API Testing...', 'START');
    log('📍 Testing Base URL: ' + BASE_URL);

    try {
        // Note: Authentication test is commented out because it requires real user accounts
        // await testAuth();

        await testProjectAPIs();
        await testGigsAPIs();
        await testAdvancedFeatures();

        log('✅ All tests completed!', 'COMPLETE');

        // Save results to file
        fs.writeFileSync('api-test-results.log', TEST_RESULTS.join('\n'));
        log('📄 Test results saved to api-test-results.log', 'INFO');

    } catch (error) {
        log('💥 Test suite failed: ' + error.message, 'ERROR');
    }
};

// Run the tests
runTests();
