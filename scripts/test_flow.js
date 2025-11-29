const axios = require('axios');
const fs = require('fs');

const API_URL = 'http://localhost:3000';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const runTest = async () => {
    try {
        console.log('Starting Verification Flow...');

        // 1. Register Admin
        console.log('Registering Admin...');
        const adminRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Admin User',
            email: `admin_${Date.now()}@example.com`,
            password: 'password123',
            role: 'Admin' // Note: In real app, admin registration might be restricted, but schema allows it if not validated against
        }).catch(err => {
            // If admin registration is restricted, we might need to seed it or use a different approach.
            // My schema allows 'Admin' role in register, but let's see if I added any restriction.
            // validation.js: role: Joi.string().valid('Employer', 'Job Seeker').required()
            // Ah, I restricted it in validation.js! Good.
            // So I cannot register as Admin via API.
            console.log('Admin registration failed as expected (validation):', err.response?.data?.message);
            return null;
        });

        // Since I cannot register Admin via API, I will skip Admin actions for now or manually create one if needed.
        // But wait, the requirements said "Roles: Admin, Employer, Job Seeker".
        // And "POST /auth/register Public -> Register a new user (Employer / Job Seeker)".
        // So Admin probably needs to be seeded or created directly in DB.
        // For this test, I will focus on Employer and Job Seeker flow.

        // 2. Register Employer
        console.log('Registering Employer...');
        const employerEmail = `employer_${Date.now()}@example.com`;
        const employerRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Employer User',
            email: employerEmail,
            password: 'password123',
            role: 'Employer'
        });
        const employerToken = employerRes.data.token;
        console.log('Employer Registered:', employerRes.data._id);

        // 3. Register Job Seeker
        console.log('Registering Job Seeker...');
        const seekerEmail = `seeker_${Date.now()}@example.com`;
        const seekerRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Job Seeker User',
            email: seekerEmail,
            password: 'password123',
            role: 'Job Seeker'
        });
        const seekerToken = seekerRes.data.token;
        console.log('Job Seeker Registered:', seekerRes.data._id);

        // 4. Employer Creates Job
        console.log('Employer Creating Job...');
        const jobRes = await axios.post(`${API_URL}/jobs`, {
            title: 'Software Engineer',
            description: 'We need a developer',
            location: 'Remote',
            employmentType: 'Full-time'
        }, {
            headers: { Authorization: `Bearer ${employerToken}` }
        });
        const jobId = jobRes.data._id;
        console.log('Job Created:', jobId);

        // 5. Job Seeker Searches Jobs
        console.log('Searching Jobs...');
        const searchRes = await axios.get(`${API_URL}/jobs?title=Software`);
        console.log('Jobs Found:', searchRes.data.length);

        // 6. Job Seeker Applies
        console.log('Job Seeker Applying...');
        const applyRes = await axios.post(`${API_URL}/applications`, {
            jobId: jobId
        }, {
            headers: { Authorization: `Bearer ${seekerToken}` }
        });
        const applicationId = applyRes.data._id;
        console.log('Applied:', applicationId);

        // 7. Employer Views Applications
        console.log('Employer Viewing Applications...');
        const empAppsRes = await axios.get(`${API_URL}/employer/applications`, {
            headers: { Authorization: `Bearer ${employerToken}` }
        });
        console.log('Applications found for employer:', empAppsRes.data.length);

        // 8. Employer Accepts Application
        console.log('Employer Accepting Application...');
        await axios.put(`${API_URL}/employer/applications/${applicationId}`, {
            status: 'ACCEPTED'
        }, {
            headers: { Authorization: `Bearer ${employerToken}` }
        });
        console.log('Application Accepted');

        // 9. Job Seeker Gets Offer Letter
        console.log('Job Seeker Getting Offer Letter...');
        const offerRes = await axios.get(`${API_URL}/applications/${applicationId}/offer`, {
            headers: { Authorization: `Bearer ${seekerToken}` },
            responseType: 'arraybuffer' // PDF content
        });
        console.log('Offer Letter Received, size:', offerRes.data.length);
        fs.writeFileSync('test_offer_letter.pdf', offerRes.data);
        console.log('Offer Letter saved to test_offer_letter.pdf');

        console.log('Verification Flow Completed Successfully!');

    } catch (error) {
        console.error('Verification Failed:', error.response?.data || error.message);
    }
};

runTest();
