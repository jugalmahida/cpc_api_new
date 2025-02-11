module.exports = {
    insertAdmin: 'INSERT INTO admin (email, password) VALUES (?, ?)',
    findAdminByEmail: 'SELECT * FROM admin WHERE email = ?',
    findAllAdmins: 'SELECT * FROM admin',
    updateAdmin: 'UPDATE admin SET email = ?, password = ? WHERE id = ?',
    deleteAdmin: 'DELETE FROM admin WHERE id = ?'
};