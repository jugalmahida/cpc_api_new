module.exports = {
    insertInquiry: 'INSERT INTO inquiries (name, number, status, message) VALUES (?, ?, ?, ?)',
    findInquiryById: 'SELECT * FROM inquiries WHERE id = ?',
    findbyStatus: 'SELECT * FROM inquiries where status = ?',
    findAllInquiries: 'SELECT * FROM inquiries',
    updateInquiry: 'UPDATE inquiries SET name = ?, number = ?, status = ?, message = ? WHERE id = ?',
    deleteInquiry: 'DELETE FROM inquiries WHERE id = ?'
};