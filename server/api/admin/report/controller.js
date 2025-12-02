import service from "./service.js";

const getReportController = async (req, res) => {
  try {
    const report = await service.getReportService(req.params.id);
    console.log("pdf created", report);

    return res.json({ message: "report generated successfully", report });
  } catch (error) {
    return res.json({ message: "report generation failed" });
  }
};

const generatePdfController = async (req, res) => {
  try {
    const { user } = req.body; // get user from request body
    if (!user) return res.status(400).json({ message: "User data missing" });

    const doc = await service.pdfService(req.body);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=user_report_${user.id}.pdf`
    );

    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error("PDF generation failed:", error);
    return res.status(500).json({ message: "PDF download failed" });
  }
};

export default { getReportController, generatePdfController };
