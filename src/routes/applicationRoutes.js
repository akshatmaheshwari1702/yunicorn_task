const express = require('express');
const router = express.Router();
const {
    applyForJob,
    getMyApplications,
    getApplicationById,
    withdrawApplication,
    getEmployerApplications,
    updateApplicationStatus,
    getOfferLetter,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// Job Seeker Routes
router.route('/')
    .post(protect, authorize('Job Seeker'), applyForJob)
    .get(protect, authorize('Job Seeker'), getMyApplications);

router.get('/:id/offer', protect, authorize('Job Seeker'), getOfferLetter);

router.route('/:id')
    .get(protect, authorize('Job Seeker'), getApplicationById)
    .delete(protect, authorize('Job Seeker'), withdrawApplication);

// Employer Routes (Using a different path prefix in app.js or handling here)
// The requirement says /employer/applications. 
// I will handle this by creating a separate router for employer or just mounting this router at different paths.
// Let's create a separate router for employer applications to keep it clean, or handle it in app.js.
// Actually, I'll put the employer routes here but they will be mounted under /employer/applications in app.js? 
// No, the requirement says GET /employer/applications.
// So I should probably have a separate route file for employer or just add it to app.js.
// Let's create a separate route file `employerRoutes.js` for clarity or just mix them if I mount at root.
// But standard practice is to mount routers.
// Let's stick to the plan: `applicationRoutes.js` for /applications.
// And I will create `employerRoutes.js` for /employer.

module.exports = router;
