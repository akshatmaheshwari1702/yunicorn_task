const express = require('express');
const router = express.Router();
const {
    createJob,
    updateJob,
    deleteJob,
    getJobs,
    getJobById,
} = require('../controllers/jobController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.route('/')
    .post(protect, authorize('Employer'), createJob)
    .get(getJobs);

router.route('/:id')
    .get(getJobById)
    .put(protect, authorize('Employer'), updateJob)
    .delete(protect, authorize('Employer'), deleteJob);

module.exports = router;
