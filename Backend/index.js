import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import 'dotenv/config';
import hmpiRoute from './src/route/hmpi.route.js';
import csvRouter from './src/route/csvProcessor.route.js'

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/csv',csvRouter)
app.use('/api/hmpi', hmpiRoute);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'HMPI Calculation API is running',
        timestamp: new Date().toISOString() 
    });
});

// Default route
app.get('/', (req, res) => {
    res.json({
        message: 'HMPI Calculation API',
        version: '1.0.0',
        endpoints: {
            single: 'POST /api/hmpi/calculate',
            bulk: 'POST /api/hmpi/calculate/bulk',
            fromFile: 'POST /api/hmpi/calculate/from-file',
            categories: 'GET /api/hmpi/categories'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: err.message
    });
});

// 404 handler - FIXED: Remove '*' path parameter
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'The requested endpoint does not exist'
    });
});

app.listen(PORT, () => {
    console.log(` HMPI API server running on port ${PORT}`);
   
});

export default app;