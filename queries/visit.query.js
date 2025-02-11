module.exports = {
    increaseCount: 'UPDATE visit_counter SET total_visits = total_visits + 1 WHERE id = 1',
    getCount: 'SELECT total_visits FROM visit_counter WHERE id = 1',
};