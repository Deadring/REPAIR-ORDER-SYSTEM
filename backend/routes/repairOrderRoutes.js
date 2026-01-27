const express = require('express');
const router = express.Router();
const repairOrderController = require('../controllers/repairOrderController');
const { authenticateToken, authorizeRole, checkPermission } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Routes
// Export to Excel - MUST be before /:id route
router.get('/export/excel', repairOrderController.exportToExcel);

// Anyone can view
router.get('/', repairOrderController.getAllRepairOrders);
router.get('/:id', repairOrderController.getRepairOrderById);

// Only users with can_create permission can create
router.post('/', checkPermission('can_create'), repairOrderController.createRepairOrder);

// Only admin can update
router.put('/:id', authorizeRole(['admin']), repairOrderController.updateRepairOrder);

// Only admin can delete
router.delete('/:id', authorizeRole(['admin']), repairOrderController.deleteRepairOrder);

module.exports = router;
