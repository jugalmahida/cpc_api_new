module.exports = {
    insertFaculty: 'INSERT INTO faculty (name, profileImageUrl, position, briefProfile, qualifications, areasOfInterest, achievements, publications, course_id, vertical_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    findFacultyById: 'SELECT * FROM faculty WHERE id = ?',
    findAllFaculty: 'SELECT * FROM faculty',
    findFacultyByCourseId: 'SELECT * FROM faculty WHERE course_id = ?', 
    findFacultyByVerticalId: 'SELECT * FROM faculty WHERE vertical_id = ?',
    updateFaculty: 'UPDATE faculty SET name = ?, profileImageUrl = ?, position = ?, briefProfile = ?, qualifications = ?, areasOfInterest = ?, achievements = ?, publications = ?, course_id = ? WHERE id = ?',
    deleteFaculty: 'DELETE FROM faculty WHERE id = ?'
}; 