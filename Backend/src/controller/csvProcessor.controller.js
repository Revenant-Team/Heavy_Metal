import HMPIController from './hmpi.controller.js'
const hmpiController = new HMPIController();
const csvProcessor = async (req,res)=>{
     try {
        if (!req.file) {
            return res.status(400).json({
                error: 'No CSV file uploaded',
                message: 'Please upload a valid CSV file'
            });
        }

        const results = [];
        const errors = [];
        
        // Convert buffer to string and parse CSV
        const csvData = req.file.buffer.toString('utf8');
        const rows = csvData.split('\n');
        
        // Parse header row to identify columns
        const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
        
        // Process each data row
        for (let i = 1; i < rows.length; i++) {
            if (rows[i].trim() === '') continue; // Skip empty rows
            
            try {
                const values = rows[i].split(',');
                const processedRow = processCSVRow(headers, values, i + 1);
                
                if (processedRow.isValid) {
                    results.push(processedRow.data);
                } else {
                    errors.push({
                        row: i + 1,
                        error: processedRow.error,
                        rawData: values
                    });
                }
            } catch (error) {
                errors.push({
                    row: i + 1,
                    error: `Processing error: ${error.message}`,
                    rawData: rows[i]
                });
            }
        }

        const friendData = {
            success: true,
            totalRows: rows.length - 1,
            processedRows: results.length,
            errorRows: errors.length,
            data: results,
            errors: errors,
            summary: generateDataSummary(results)
        };
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
        res.status(500).json({
            error: 'CSV processing failed',
            message: error.message
        });
    }

 }

// Function to process individual CSV row
function processCSVRow(headers, values, rowNumber) {
    try {
        const rowData = {};
        
        // Map headers to values
        headers.forEach((header, index) => {
            const value = values[index] ? values[index].trim() : '';
            rowData[header] = value;
        });

        // Extract location information
        const locationData = extractLocationData(rowData);
        if (!locationData.isValid) {
            return {
                isValid: false,
                error: `Invalid location data: ${locationData.error}`
            };
        }

        // Extract heavy metals data
        const heavyMetalsData = extractHeavyMetalsData(rowData);
        if (!heavyMetalsData.isValid) {
            return {
                isValid: false,
                error: `Invalid heavy metals data: ${heavyMetalsData.error}`
            };
        }

        return {
            isValid: true,
            data: {
                rowNumber: rowNumber,
                location: locationData.data,
                heavyMetals: heavyMetalsData.data,
                additionalData: extractAdditionalData(rowData)
            }
        };

    } catch (error) {
        return {
            isValid: false,
            error: `Row processing error: ${error.message}`
        };
    }
}

function extractLocationData(rowData) {
    const locationFields = ['location', 'site_name', 'station_name', 'place'];
    const latFields = ['latitude', 'lat'];
    const lonFields = ['longitude', 'lon', 'long'];
    const yearFields = ['year', 'sampling_year', 'date'];

    try {
        // Find location name field
        const locationField = locationFields.find(field => rowData[field] && rowData[field] !== '');
        const location = locationField ? rowData[locationField] : 'Unknown Location';

        // Find coordinates
        const latField = latFields.find(field => rowData[field] && rowData[field] !== '');
        const lonField = lonFields.find(field => rowData[field] && rowData[field] !== '');

        if (!latField || !lonField) {
            return {
                isValid: false,
                error: 'Missing latitude or longitude data'
            };
        }

        const latitude = parseFloat(rowData[latField]);
        const longitude = parseFloat(rowData[lonField]);

        if (isNaN(latitude) || isNaN(longitude)) {
            return {
                isValid: false,
                error: 'Invalid coordinate values'
            };
        }

        // Find year
        const yearField = yearFields.find(field => rowData[field] && rowData[field] !== '');
        const year = yearField ? parseInt(rowData[yearField]) || new Date().getFullYear() : new Date().getFullYear();

        return {
            isValid: true,
            data: {
                name: location,
                state: rowData['state'] || 'Unknown State',
                district: rowData['district'] || 'Unknown District',
                latitude,
                longitude,
                year
            }
        };

    } catch (error) {
        return {
            isValid: false,
            error: `Location extraction error: ${error.message}`
        };
    }
}

// Extract heavy metals data from row data
function extractHeavyMetalsData(rowData) {
    const metalMapping = {
        'arsenic': ['arsenic', 'as'],
        'lead': ['lead', 'pb'],
        'mercury': ['mercury', 'hg'],
        'cadmium': ['cadmium', 'cd'],
        'chromium': ['chromium', 'cr'],
        'iron': ['iron', 'fe'],
        'manganese': ['manganese', 'mn'],
        'zinc': ['zinc', 'zn'],
        'copper': ['copper', 'cu'],
        'nickel': ['nickel', 'ni'],
        'fluoride': ['fluoride', 'f'],
        'nitrate': ['nitrate', 'no3']
    };

    const heavyMetals = {};
    let foundMetals = 0;

    try {
        // Extract each metal concentration
        Object.keys(metalMapping).forEach(metal => {
            const possibleFields = metalMapping[metal];
            
            for (const field of possibleFields) {
                if (rowData[field] && rowData[field] !== '' && rowData[field] !== '-') {
                    const concentration = parseFloat(rowData[field]);
                    if (!isNaN(concentration) && concentration >= 0) {
                        heavyMetals[metal] = concentration;
                        foundMetals++;
                        break;
                    }
                }
            }
        });

        if (foundMetals === 0) {
            return {
                isValid: false,
                error: 'No valid heavy metal concentrations found'
            };
        }

        return {
            isValid: true,
            data: heavyMetals
        };

    } catch (error) {
        return {
            isValid: false,
            error: `Heavy metals extraction error: ${error.message}`
        };
    }
}

// Extract additional water quality parameters
function extractAdditionalData(rowData) {
    const additionalParams = {};
    
    const paramMapping = {
        'ph': ['ph', 'ph_value'],
        'tds': ['tds', 'total_dissolved_solids'],
        'conductivity': ['conductivity', 'ec'],
        'temperature': ['temperature', 'temp'],
        'dissolved_oxygen': ['do', 'dissolved_oxygen']
    };

    Object.keys(paramMapping).forEach(param => {
        const possibleFields = paramMapping[param];
        
        for (const field of possibleFields) {
            if (rowData[field] && rowData[field] !== '' && rowData[field] !== '-') {
                const value = parseFloat(rowData[field]);
                if (!isNaN(value)) {
                    additionalParams[param] = value;
                    break;
                }
            }
        }
    });

    return additionalParams;
}

// Generate summary of processed data
function generateDataSummary(results) {
    if (results.length === 0) return {};

    const summary = {
        totalLocations: results.length,
        uniqueLocations: [...new Set(results.map(r => r.location.name))].length,
        dateRange: {
            earliest: Math.min(...results.map(r => r.location.year)),
            latest: Math.max(...results.map(r => r.location.year))
        },
        metalsCoverage: {}
    };

    // Calculate metals coverage
    const allMetals = new Set();
    results.forEach(result => {
        Object.keys(result.heavyMetals).forEach(metal => allMetals.add(metal));
    });

    allMetals.forEach(metal => {
        const coverage = results.filter(r => r.heavyMetals[metal] !== undefined).length;
        summary.metalsCoverage[metal] = {
            count: coverage,
            percentage: Math.round((coverage / results.length) * 100)
        };
    });

    return summary;
}


export {csvProcessor}