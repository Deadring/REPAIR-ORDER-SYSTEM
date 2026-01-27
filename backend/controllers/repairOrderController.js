const db = require('../config/db');
const ExcelJS = require('exceljs');

// Get all repair orders
exports.getAllRepairOrders = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM repair_orders ORDER BY arrival_date DESC');
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching repair orders',
            error: error.message
        });
    }
};

// Get single repair order by ID
exports.getRepairOrderById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM repair_orders WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Repair order not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching repair order',
            error: error.message
        });
    }
};

// Create new repair order
exports.createRepairOrder = async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        const {
            arrival_number,
            arrival_date,
            store,
            division,
            device_name,
            number_inventory,
            serial_number,
            issue,
            repair_note,
            departure_date,
            departure_number,
            repair_order,
            ship_address
        } = req.body;

        try {
            const [result] = await db.query(
                `INSERT INTO repair_orders (arrival_number, arrival_date, store, division, device_name, 
                 number_inventory, serial_number, issue, repair_note, departure_date, departure_number, repair_order, ship_address) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [arrival_number, arrival_date, store, division, device_name, number_inventory, serial_number,
                 issue, repair_note, departure_date || null, departure_number || null, repair_order || null, ship_address || null]
            );

            console.log('Insert successful, ID:', result.insertId);
            res.status(201).json({
                success: true,
                message: 'Repair order created successfully',
                data: { id: result.insertId }
            });
        } catch (dbError) {
            console.error('Database error:', dbError.message);
            console.error('SQL State:', dbError.sqlState);
            console.error('SQL:', dbError.sql);
            throw dbError;
        }
    } catch (error) {
        console.error('Full error details:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating repair order',
            error: error.message
        });
    }
};

// Update repair order
exports.updateRepairOrder = async (req, res) => {
    try {
        const {
            arrival_number,
            arrival_date,
            store,
            division,
            device_name,
            number_inventory,
            serial_number,
            issue,
            repair_note,
            departure_date,
            departure_number,
            repair_order,
            ship_address
        } = req.body;

        const [result] = await db.query(
            `UPDATE repair_orders SET arrival_number = ?, arrival_date = ?, store = ?, division = ?, 
             device_name = ?, number_inventory = ?, serial_number = ?, issue = ?, repair_note = ?, departure_date = ?, 
             departure_number = ?, repair_order = ?, ship_address = ? WHERE id = ?`,
            [arrival_number, arrival_date, store, division, device_name, number_inventory, serial_number,
             issue, repair_note, departure_date || null, departure_number || null, repair_order || null, ship_address || null, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Repair order not found'
            });
        }

        res.json({
            success: true,
            message: 'Repair order updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating repair order',
            error: error.message
        });
    }
};

// Delete repair order
exports.deleteRepairOrder = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM repair_orders WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Repair order not found'
            });
        }

        res.json({
            success: true,
            message: 'Repair order deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting repair order',
            error: error.message
        });
    }
};

// Export repair orders to Excel by month
exports.exportToExcel = async (req, res) => {
    try {
        const { year, month, store } = req.query;

        if (!year || !month) {
            return res.status(400).json({
                success: false,
                message: 'Year and month are required'
            });
        }

        // Check if non-admin user trying to export all stores
        if ((store === 'all' || !store) && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admin can export all stores. Please select a specific store.'
            });
        }

        // Build query with optional store filter
        let query = `
            SELECT * FROM repair_orders 
            WHERE YEAR(arrival_date) = ? AND MONTH(arrival_date) = ?
        `;
        const params = [year, month];

        if (store && store !== 'all') {
            query += ` AND store = ?`;
            params.push(store);
        }

        query += ` ORDER BY arrival_date ASC`;

        const [rows] = await db.query(query, params);

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Repair Orders');

        // Define columns
        worksheet.columns = [
            { header: 'No', key: 'no', width: 5, alignment: { horizontal: 'center' } },
            { header: 'Nomor SJ', key: 'arrival_number', width: 15, alignment: { horizontal: 'center' } },
            { header: 'Tanggal', key: 'arrival_date', width: 12, alignment: { horizontal: 'center' } },
            { header: 'Toko', key: 'store', width: 15, alignment: { horizontal: 'center' } },
            { header: 'Divisi', key: 'division', width: 15, alignment: { horizontal: 'center' } },
            { header: 'Nama Perangkat', key: 'device_name', width: 20, alignment: { horizontal: 'center' } },
            { header: 'Nomor Inventaris', key: 'number_inventory', width: 15, alignment: { horizontal: 'center' } },
            { header: 'Nomor Seri', key: 'serial_number', width: 15, alignment: { horizontal: 'center' } },
            { header: 'Kasus Permasalahan', key: 'issue', width: 25, alignment: { horizontal: 'center' } },
            { header: 'Catatan Perbaikan', key: 'repair_note', width: 25, alignment: { horizontal: 'center' } },
            { header: 'Tanggal Kirim', key: 'departure_date', width: 12, alignment: { horizontal: 'center' } },
            { header: 'Nomor SJ Kirim', key: 'departure_number', width: 15, alignment: { horizontal: 'center' } },
            { header: 'Repair Order', key: 'repair_order', width: 12, alignment: { horizontal: 'center' } },
            { header: ' Pengirim', key: 'ship_address', width: 25, alignment: { horizontal: 'center' } }
        ];

        // Add header style
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
        worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'center' };

        // Add data rows
        rows.forEach((row, index) => {
            worksheet.addRow({
                no: index + 1,
                arrival_number: row.arrival_number,
                arrival_date: row.arrival_date ? new Date(row.arrival_date).toLocaleDateString('id-ID') : '-',
                store: row.store,
                division: row.division,
                device_name: row.device_name,
                number_inventory: row.number_inventory || '-',
                serial_number: row.serial_number || '-',
                issue: row.issue || '-',
                repair_note: row.repair_note || '-',
                departure_date: row.departure_date ? new Date(row.departure_date).toLocaleDateString('id-ID') : '-',
                departure_number: row.departure_number || '-',
                repair_order: row.repair_order ? 'Yes' : 'No',
                ship_address: row.ship_address || '-'
            });
        });

        // Set response headers for Excel file
        const storeLabel = store && store !== 'all' ? `_${store}` : '';
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="Repair_Orders_${year}-${String(month).padStart(2, '0')}${storeLabel}.xlsx"`);

        // Write to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        res.status(500).json({
            success: false,
            message: 'Error exporting to Excel',
            error: error.message
        });
    }
};
