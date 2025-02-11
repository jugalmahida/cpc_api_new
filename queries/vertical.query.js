module.exports = {
    insertVertical: 'INSERT INTO vertical (name, description, code) VALUES (?, ?, ?)',
    findVerticalById: 'SELECT * FROM vertical WHERE id = ?',
    findAllVerticals: 'SELECT * FROM vertical',
    updateVertical: 'UPDATE vertical SET name = ?, description = ?, code = ? WHERE id = ?',
    deleteVertical: 'DELETE FROM vertical WHERE id = ?'
};