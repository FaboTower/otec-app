const { Course } = require("../models");

const CourseRepository = {
  findAll: async () => Course.findAll({ order: [["id", "ASC"]] }),

  findById: async (id) => Course.findByPk(id),

  create: async (data) => Course.create(data),

  update: async (id, data) => {
    const course = await Course.findByPk(id);
    if (!course) return null;
    return course.update(data);
  },

  remove: async (id) => {
    const course = await Course.findByPk(id);
    if (!course) return null;
    await course.destroy();
    return course;
  },
};

module.exports = CourseRepository;