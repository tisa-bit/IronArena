import prisma from "../../../models/prismaClient.js";
import PDFDocument from "pdfkit";

const getReportService = async (userId) => {
  // coclearnsole.log("pdf id", userId);

  const Id = parseInt(userId);
  const user = await prisma.user.findUnique({
    where: { id: Id },
    include: { answers: { include: { control: true } } },
  });

  // console.log("pdf user", user);

  if (!user) throw new Error("user not found");
  const totalSubmission = user.answers.length;
  const implementedCount = user.answers.filter(
    (a) => a.status === "IMPLEMENTED"
  ).length;
  const not_implementedCount = user.answers.filter(
    (a) => a.status === "NOT_IMPLEMENTED"
  ).length;
  const not_applicableCount = user.answers.filter(
    (a) => a.status === "NOT_APPLICABLE"
  ).length;

  const reportContent = {
    user: {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      companyname: user.companyname,
      subscriptionStatus: user.subscriptionStatus,
    },
    summary: {
      totalSubmission,
      implementedCount,
      not_implementedCount,
      not_applicableCount,
    },
    answers: user.answers.map((answer) => ({
      controlNumber: answer.control.controlnumber,
      controlDescription: answer.control.description,
      status: answer.status,
      reason: answer.reason || "",
      submittedAt: answer.createdAt,
    })),
  };

  console.log("pdf ", reportContent);

  return reportContent;
};

const pdfService = async (data) => {
  const { user, summary, answers } = data;

  if (!user || !summary || !answers) {
    throw new Error("No necessary information");
  }

  const doc = new PDFDocument({ margin: 30, size: "A4" });

  // Title
  doc.fontSize(18).text("User Control Report", { align: "center" });
  doc.moveDown();

  // User info
  doc.fontSize(12).text(`Name: ${user.firstname} ${user.lastname}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Company: ${user.companyname || "N/A"}`);
  doc.text(`Subscription Status: ${user.subscriptionStatus}`);
  doc.moveDown();

  // Summary
  doc.text(`Total Submissions: ${summary.totalSubmissions}`);
  doc.text(`Implemented: ${summary.implementedCount}`);
  doc.text(`Not Implemented: ${summary.notImplementedCount}`);
  doc.text(`Not Applicable: ${summary.notApplicableCount}`);
  doc.moveDown();

  // Table headers
  doc.fontSize(12).text("Control #", { continued: true, width: 80 });
  doc.text("Description", { continued: true, width: 250 });
  doc.text("Status", { continued: true, width: 100 });
  doc.text("Reason / Attachment", { width: 150 });
  doc.moveDown();

  // Table data
  answers.forEach((answer) => {
    doc.text(answer.controlNumber.toString(), { continued: true, width: 80 });
    doc.text(answer.controlDescription, { continued: true, width: 250 });
    doc.text(answer.status, { continued: true, width: 100 });
    const reasonAttachment = [answer.reason, answer.attachment]
      .filter(Boolean)
      .join(" | ");
    doc.text(reasonAttachment, { width: 150 });
    doc.moveDown();
  });

  // ✅ DO NOT call doc.end() here
  return doc; // return the PDFDocument to controller
};

export default { getReportService, pdfService };
