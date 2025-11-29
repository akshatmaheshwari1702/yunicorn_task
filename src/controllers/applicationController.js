const Application = require('../models/Application');
const Job = require('../models/Job');
const { applicationSchema } = require('../utils/validation');
const { generateOfferLetter } = require('../utils/pdfGenerator');

// @desc    Apply for a job
// @route   POST /applications
// @access  Private (Job Seeker)
const applyForJob = async (req, res) => {
    try {
        const { error } = applicationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { jobId } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const existingApplication = await Application.findOne({
            jobId,
            applicantId: req.user._id,
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        const application = await Application.create({
            jobId,
            applicantId: req.user._id,
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    View own applications
// @route   GET /applications
// @access  Private (Job Seeker)
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicantId: req.user._id })
            .populate('jobId', 'title location employmentType')
            .populate('applicantId', 'name email');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get application details
// @route   GET /applications/:id
// @access  Private (Job Seeker)
const getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('jobId')
            .populate('applicantId', 'name email');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.applicantId._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view this application' });
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Withdraw application
// @route   DELETE /applications/:id
// @access  Private (Job Seeker)
const withdrawApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.applicantId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to withdraw this application' });
        }

        if (application.status !== 'PENDING') {
            return res.status(400).json({ message: 'Cannot withdraw processed application' });
        }

        await application.deleteOne();

        res.json({ message: 'Application withdrawn' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get applications for own job posts
// @route   GET /employer/applications
// @access  Private (Employer)
const getEmployerApplications = async (req, res) => {
    try {
        const { status } = req.query;
        const jobs = await Job.find({ employerId: req.user._id });
        const jobIds = jobs.map((job) => job._id);

        const query = { jobId: { $in: jobIds } };
        if (status) {
            query.status = status;
        }

        const applications = await Application.find(query)
            .populate('jobId', 'title')
            .populate('applicantId', 'name email');

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Accept or reject an application
// @route   PUT /employer/applications/:id
// @access  Private (Employer)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['ACCEPTED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const application = await Application.findById(req.params.id).populate('jobId');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.jobId.employerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this application' });
        }

        application.status = status;
        await application.save();

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate Offer Letter
// @route   GET /applications/:id/offer
// @access  Private (Job Seeker)
const getOfferLetter = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate({
                path: 'jobId',
                populate: { path: 'employerId', select: 'name' }
            })
            .populate('applicantId', 'name');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.applicantId._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view this offer letter' });
        }

        if (application.status !== 'ACCEPTED') {
            return res.status(400).json({ message: 'Application not accepted yet' });
        }

        await generateOfferLetter(application, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    applyForJob,
    getMyApplications,
    getApplicationById,
    withdrawApplication,
    getEmployerApplications,
    updateApplicationStatus,
    getOfferLetter,
};
