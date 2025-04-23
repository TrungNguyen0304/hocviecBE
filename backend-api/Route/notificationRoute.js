const express = require('express');
const { checkMissedReports, markNotificationAsRead } = require('../Controller/notification.js');
const authenticateJWT = require('../middleware/auth.js');
const authorize = require('../middleware/authorize.js');

const router = express.Router();

router.get('/check-missed-reports', authenticateJWT, authorize('manager'), checkMissedReports);
router.put('/notifications/:id/read', authenticateJWT, authorize('manager'), markNotificationAsRead);

module.exports = router;
