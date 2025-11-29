const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getAllJobs,
    deleteJobByAdmin,
    getAllApplications,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.use(protect);
router.use(authorize('Admin'));

router.get('/users', getAllUsers);
router.get('/jobs', getAllJobs);
router.delete('/jobs/:id', deleteJobByAdmin);
router.get('/applications', getAllApplications);

module.exports = router;
