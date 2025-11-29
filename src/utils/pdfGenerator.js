const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

const generateOfferLetter = async (application, res) => {
    const doc = new PDFDocument();
    const filename = `Offer_Letter_${application.applicantId.name.replace(/ /g, '_')}.pdf`;

    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // Header
    doc.fontSize(25).text('OFFER LETTER', { align: 'center' });
    doc.moveDown();

    // Content
    doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    doc.text(`Dear ${application.applicantId.name},`);
    doc.moveDown();
    doc.text(`We are pleased to offer you the position of ${application.jobId.title} at ${application.jobId.employerId.name}.`);
    doc.moveDown();
    doc.text(`Employment Type: ${application.jobId.employmentType}`);
    doc.text(`Location: ${application.jobId.location}`);
    doc.moveDown();
    doc.text('We look forward to having you on our team.');
    doc.moveDown();
    doc.text('Sincerely,');
    doc.text(application.jobId.employerId.name);

    // QR Code
    const qrData = `http://localhost:3000/jobs/${application.jobId._id}`; // Assuming frontend URL or API URL for job details
    const qrImage = await QRCode.toDataURL(qrData);

    doc.moveDown(2);
    doc.image(qrImage, {
        fit: [100, 100],
        align: 'center',
        valign: 'center'
    });
    doc.text('Scan to view job details', { align: 'center' });

    doc.end();
};

module.exports = { generateOfferLetter };
