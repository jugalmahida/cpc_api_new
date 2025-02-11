module.exports = {
    insertPlacement: 'INSERT INTO placements (student_name, student_image_url, company_name, package, course_id, year) VALUES (?, ?, ?, ?, ?, ?)',
    findPlacementById: 'SELECT * FROM placements WHERE id = ?',
    findAllPlacements: 'SELECT * FROM placements',
    findPlacementsByCourseId: 'SELECT * FROM placements WHERE course_id = ?', // New query
    updatePlacement: 'UPDATE placements SET student_name = ?, student_image_url = ?, company_name = ?, package = ?, course_id = ?, year = ? WHERE id = ?',
    deletePlacement: 'DELETE FROM placements WHERE id = ?'
};