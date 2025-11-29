const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all registered users
// @route   GET /admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const query = {};
        if (role) {
            query.role = role;
        }

        const users = await User.find(query).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all job posts
// @route   GET /admin/jobs
// @access  Private (Admin)
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('employerId', 'name email');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove inappropriate job post
// @route   DELETE /admin/jobs/:id
// @access  Private (Admin)
const deleteJobByAdmin = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        await job.deleteOne();

        res.json({ message: 'Job removed by admin' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all applications
// @route   GET /admin/applications
// @access  Private (Admin)
const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('jobId', 'title')
            .populate('applicantId', 'name email');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    getAllJobs,
    deleteJobByAdmin,
    getAllApplications,
};
