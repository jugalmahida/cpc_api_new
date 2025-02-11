module.exports = {
    // Event Queries
    insertEvent: 'INSERT INTO events (name, date) VALUES (?, ?)',
    findEventById: 'SELECT * FROM events WHERE id = ?',
    findAllEvents: 'SELECT * FROM events',
    updateEvent: 'UPDATE events SET name = ?, date = ? WHERE id = ?',
    deleteEvent: 'DELETE FROM events WHERE id = ?',

    // EventImage Queries
    insertEventImage: 'INSERT INTO eventImages (imageurl, event_id) VALUES (?, ?)',
    findEventImagesByEventId: 'SELECT id, imageurl FROM eventImages WHERE event_id = ?',
    deleteEventImagesByEventId: 'DELETE FROM eventImages WHERE event_id = ?',
    findEventImagesById: 'SELECT id, imageurl FROM eventImages WHERE id = ?',
    deleteEventImage: 'DELETE FROM eventImages WHERE id = ?'
};