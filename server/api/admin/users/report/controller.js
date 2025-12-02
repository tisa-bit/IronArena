const getReport = async (req, res) => {
  try {
    const report = await service.getReportService(req.params.id);
    return report;
  } catch (error) {
    return res.json({ message: "report fetching failed" });
  }
};

export default { getReport };
