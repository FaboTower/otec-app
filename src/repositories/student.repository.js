const { Student } = require("../models");

const StudentRepository = {
  findAll: async () => Student.findAll({ order: [["id", "ASC"]] }),

  findById: async (id) => Student.findByPk(id),
  
  findByEmail: async (email) =>
    Student.findOne({ where: { email: String(email).toLowerCase() } }),

  create: async (data) => Student.create(data),

  update: async (id, data) => {
    const student = await Student.findByPk(id);
    if (!student) return null;
    return student.update(data);
  },

  remove: async (id) => {
    const student = await Student.findByPk(id);
    if (!student) return null;
    await student.destroy();
    return student;
  },
};

module.exports = StudentRepository;