const db = require('../db');

async function logActivity({ userId, userName, userRole, action, entityType, entityId, entityName, details, ip }) {
  try {
    await db.execute({
      sql: `INSERT INTO activity_logs (user_id, user_name, user_role, action, entity_type, entity_id, entity_name, details, ip_address)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        userId || null, 
        userName || 'System', 
        userRole || 'unknown', 
        action, 
        entityType || null, 
        entityId || null, 
        entityName || null, 
        JSON.stringify(details || {}), 
        ip || 'unknown'
      ]
    });
  } catch (err) {
    console.error('❌ Failed to log activity:', err.message);
    // We catch the error so a logging failure doesn't crash the main app action
  }
}

module.exports = { logActivity };