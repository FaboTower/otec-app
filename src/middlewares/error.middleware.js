module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;

  // Si es un error de Sequelize (ej: unique)
  const msg =
    err?.name?.includes("Sequelize") ? "Error de base de datos" : err.message;

  res.status(status).json({
    ok: false,
    message: msg,
  });
};