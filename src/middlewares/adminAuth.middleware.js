require("dotenv").config();

module.exports = (req, res, next) => {
  const token = req.header("x-admin-token");

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, message: "No autorizado (admin)" });
  }

  next();
};