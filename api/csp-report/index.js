
module.exports = async function (context, req) {
  // Recebe relatórios CSP (report-uri /report-to). Apenas loga (sem persistência).
  const body = req.body || {};
  context.log('CSP-Report', JSON.stringify(body));
  context.res = { status: 204 };
};
