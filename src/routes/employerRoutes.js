const express = require('express');
const router = express.Router();
const {
    getEmployerApplications,
    updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.get('/applications', protect, authorize('Employer'), getEmployerApplications);
router.put('/applications/:id', protect, authorize('Employer'), updateApplicationStatus);

module.exports = router;
