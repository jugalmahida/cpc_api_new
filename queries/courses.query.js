module.exports = {
    insertCourse: 'INSERT INTO courses (name, description, totalSeats, duration, course_type, vertical_id, pdflink) VALUES (?, ?, ?, ?, ?, ?, ?)',
    findCourseById: 'SELECT * FROM courses WHERE id = ?',
    findAllCourses: 'SELECT * FROM courses',
    findCoursesByVerticalId: 'SELECT * FROM courses WHERE vertical_id = ?',
    updateCourse: 'UPDATE courses SET name = ?, description = ?, totalSeats = ?, duration = ?, course_type = ?, vertical_id = ?, pdflink = ? WHERE id = ?',
    deleteCourse: 'DELETE FROM courses WHERE id = ?'
};