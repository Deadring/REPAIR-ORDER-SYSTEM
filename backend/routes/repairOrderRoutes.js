const express = require('express');
const router = express.Router();
const repairOrderController = require('../controllers/repairOrderController');
const { authenticateToken, authorizeRole, checkPermission } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Routes
// Anyone can view
router.get('/', repairOrderController.getAllRepairOrders);
router.get('/:id', repairOrderController.getRepairOrderById);

// Export to Excel - anyone can view
router.get('/export/excel', repairOrderController.exportToExcel);

// Only users with can_create permission can create
router.post('/', checkPermission('can_create'), repairOrderController.createRepairOrder);

// Only admin can update
router.put('/:id', authorizeRole(['admin']), repairOrderController.updateRepairOrder);

// Only admin can delete
router.delete('/:id', authorizeRole(['admin']), repairOrderController.deleteRepairOrder);

module.exports = router;
