import express from 'express';
import HMPIController from '../controller/hmpi.controller.js';

const router = express.Router();
const hmpiController = new HMPIController();

// Handle friend's file data format
router.post('/calculate/from-file', (req, res) => {
    try {
        const friendData = req.body;

        if (!friendData || !friendData.success || !Array.isArray(friendData.data)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid file data format',
                expected: {
                    success: true,
                    data: [
                        {
                            location: { state: 'string', district: 'string' },
                            heavyMetals: { iron: 'number', arsenic: 'number' }
                        }
                    ]
                }
            });
        }

        if (friendData.data.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No data to process',
                message: 'File data array is empty'
            });
        }

        const result = hmpiController.processFileData(friendData);
        res.json(result);

    } catch (error) {
        console.error('File processing error:', error);
        res.status(500).json({
            success: false,
            error: 'File data processing failed',
            message: error.message
        });
    }
});

// Single sample HMPI calculation (original dataset format)
router.post('/calculate', (req, res) => {
    try {
        const sampleData = req.body;
        
        if (!sampleData || typeof sampleData !== 'object') {
            return res.status(400).json({
                success: false,
                error: 'Request body must be a valid JSON object'
            });
        }

        const requiredFields = ['State', 'District', 'Location', 'Longitude', 'Latitude', 'Year'];
        const missingFields = requiredFields.filter(field => !sampleData[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
                missingFields: missingFields,
                example: {
                    "State": "Test State",
                    "District": "Test District",
                    "Location": "Test Location",
                    "Longitude": 77.2090,
                    "Latitude": 28.6139,
                    "Year": 2023,
                    "pH": 7.5,
                    "EC": 500,
                    "Fe_ppm": 0.5,
                    "As_ppb": 20,
                    "U_ppb": 100,
                    "F_mgL": 0.8
                }
            });
        }

        const result = hmpiController.calculateHMPI(sampleData);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }

    } catch (error) {
        console.error('HMPI calculation error:', error);
        res.status(500).json({
            success: false,
            error: 'HMPI calculation failed',
            message: error.message
        });
    }
});

// Bulk calculation (original format)
router.post('/calculate/bulk', (req, res) => {
    try {
        const { samples } = req.body;

        if (!samples || !Array.isArray(samples)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid request format',
                message: 'Request must contain a "samples" array'
            });
        }

        if (samples.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Empty samples array',
                message: 'Provide at least one sample for bulk calculation'
            });
        }

        const result = hmpiController.calculateBulkHMPI(samples);
        res.json(result);

    } catch (error) {
        console.error('Bulk calculation error:', error);
        res.status(500).json({
            success: false,
            error: 'Bulk HMPI calculation failed',
            message: error.message
        });
    }
});

// Get pollution categories
router.get('/categories', (req, res) => {
    try {
        const categories = hmpiController.getPollutionCategories();
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Categories retrieval error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get pollution categories',
            message: error.message
        });
    }
});

// HMPI module health check
router.get('/health', (req, res) => {
    try {
        res.json({
            success: true,
            module: 'HMPI Calculation',
            status: 'OK',
            supportedFormats: ['dataset', 'file'],
            timestamp: new Date().toISOString(),
            standardLimits: hmpiController.standardLimits
        });
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({
            success: false,
            error: 'Health check failed',
            message: error.message
        });
    }
});

export default router;