class HMPIController {
    constructor() {
        // WHO/BIS standard permissible limits for heavy metals (mg/L)
        this.standardLimits = {
            iron: 0.3,        
            arsenic: 0.01,    
            uranium: 0.015,   
            fluoride: 1.5,
            lead: 0.01,       
            cadmium: 0.003,   
            chromium: 0.05    
        };
        
        this.K = 1; // Proportionality constant
    }

    // Convert friend's nested data format
    convertFriendData(friendDataItem) {
        return {
            State: friendDataItem.location.state,
            District: friendDataItem.location.district,
            Location: friendDataItem.location.name || 'Unknown Location',
            Longitude: friendDataItem.location.longitude,
            Latitude: friendDataItem.location.latitude,
            Year: friendDataItem.location.year,
            pH: friendDataItem.additionalData?.ph,
            EC: friendDataItem.additionalData?.ec,
            Total_Hardness: friendDataItem.additionalData?.["total hardness"],
            heavyMetals: friendDataItem.heavyMetals
        };
    }

    // Process heavy metals in mg/L format (friend's format)
    processHeavyMetalsFromFile(heavyMetals) {
        const processedMetals = {};
        
        if (heavyMetals.iron !== undefined) processedMetals.iron = parseFloat(heavyMetals.iron) || 0;
        if (heavyMetals.arsenic !== undefined) processedMetals.arsenic = parseFloat(heavyMetals.arsenic) || 0;
        if (heavyMetals.uranium !== undefined) processedMetals.uranium = parseFloat(heavyMetals.uranium) || 0;
        if (heavyMetals.fluoride !== undefined) processedMetals.fluoride = parseFloat(heavyMetals.fluoride) || 0;
        if (heavyMetals.lead !== undefined) processedMetals.lead = parseFloat(heavyMetals.lead) || 0;
        if (heavyMetals.cadmium !== undefined) processedMetals.cadmium = parseFloat(heavyMetals.cadmium) || 0;
        if (heavyMetals.chromium !== undefined) processedMetals.chromium = parseFloat(heavyMetals.chromium) || 0;

        return processedMetals;
    }

    // Original dataset format conversion
    convertUnits(data) {
        return {
            iron: parseFloat(data.Fe_ppm) || 0,                    
            arsenic: (parseFloat(data.As_ppb) || 0) / 1000,        
            uranium: (parseFloat(data.U_ppb) || 0) / 1000,         
            fluoride: parseFloat(data.F_mgL) || 0                  
        };
    }

    // Universal HMPI calculation method - UPDATED with description
    calculateHMPI(data, isFromFile = false) {
        try {
            let heavyMetals;
            let locationInfo;

            if (isFromFile) {
                const convertedData = this.convertFriendData(data);
                heavyMetals = this.processHeavyMetalsFromFile(data.heavyMetals);
                locationInfo = {
                    state: convertedData.State,
                    district: convertedData.District,
                    location: convertedData.Location,
                    coordinates: {
                        longitude: convertedData.Longitude,
                        latitude: convertedData.Latitude
                    }
                };
            } else {
                heavyMetals = this.convertUnits(data);
                locationInfo = {
                    state: data.State,
                    district: data.District,
                    location: data.Location,
                    coordinates: {
                        longitude: parseFloat(data.Longitude),
                        latitude: parseFloat(data.Latitude)
                    }
                };
            }
            
            let totalWeightedQi = 0;
            let totalWeights = 0;
            let metalContributions = {};
            let validMetals = 0;

            // Calculate for each heavy metal
            for (const [metal, concentration] of Object.entries(heavyMetals)) {
                if (this.standardLimits[metal] && concentration > 0) {
                    const Si = this.standardLimits[metal];     
                    const Wi = this.K / Si;                    
                    const Qi = 100 * (concentration / Si);     
                    
                    totalWeightedQi += (Wi * Qi);
                    totalWeights += Wi;
                    
                    metalContributions[metal] = {
                        concentration: parseFloat(concentration.toFixed(4)),
                        standardLimit: Si,
                        qualityRating: parseFloat(Qi.toFixed(2)),
                        unitWeight: parseFloat(Wi.toFixed(4)),
                        contribution: parseFloat((Wi * Qi).toFixed(2))
                    };
                    validMetals++;
                }
            }

            if (totalWeights === 0) {
                throw new Error('No valid heavy metals found for HMPI calculation');
            }

            const hmpiValue = totalWeightedQi / totalWeights;
            const pollutionStatus = this.getPollutionStatus(hmpiValue);

            return {
                success: true,
                location: locationInfo,
                sampleInfo: {
                    year: isFromFile ? data.location.year : parseInt(data.Year),
                    pH: isFromFile ? data.additionalData?.ph : parseFloat(data.pH),
                    EC: isFromFile ? data.additionalData?.ec : parseFloat(data.EC),
                    totalHardness: isFromFile ? data.additionalData?.["total hardness"] : parseFloat(data.Total_Hardness)
                },
                hmpiResult: {
                    value: parseFloat(hmpiValue.toFixed(2)),
                    status: pollutionStatus.status,
                    level: pollutionStatus.level,
                    color: pollutionStatus.color,
                    description: pollutionStatus.description,  // ✅ ADDED DESCRIPTION
                    validMetalsCount: validMetals,
                    metalContributions: metalContributions
                },
                calculationDate: new Date().toISOString()
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                location: data.location?.name || data.Location || 'Unknown'
            };
        }
    }

    // Process friend's complete file data
    processFileData(friendData) {
        const results = [];
        let successCount = 0;
        let errorCount = 0;

        friendData.data.forEach((sample, index) => {
            const result = this.calculateHMPI(sample, true);
            result.originalRowNumber = sample.rowNumber;
            result.index = index + 1;
            
            if (result.success) {
                successCount++;
            } else {
                errorCount++;
            }
            
            results.push(result);
        });

        const validResults = results.filter(r => r.success);
        const hmpiValues = validResults.map(r => r.hmpiResult.value);
        
        return {
            success: true,
            fileProcessingSummary: {
                totalRows: friendData.totalRows,
                processedRows: friendData.processedRows,
                errorRows: friendData.errorRows,
                hmpiCalculations: {
                    successful: successCount,
                    failed: errorCount,
                    total: friendData.data.length
                }
            },
            statistics: hmpiValues.length > 0 ? {
                average: parseFloat((hmpiValues.reduce((a, b) => a + b, 0) / hmpiValues.length).toFixed(2)),
                minimum: Math.min(...hmpiValues),
                maximum: Math.max(...hmpiValues),
                range: parseFloat((Math.max(...hmpiValues) - Math.min(...hmpiValues)).toFixed(2))
            } : null,
            results: results,
            originalSummary: friendData.summary,
            calculationDate: new Date().toISOString()
        };
    }

    // Bulk HMPI calculation (original format)
    calculateBulkHMPI(dataArray) {
        const results = [];
        let successCount = 0;
        let errorCount = 0;

        dataArray.forEach((sample, index) => {
            const result = this.calculateHMPI(sample);
            result.index = index + 1;
            
            if (result.success) {
                successCount++;
            } else {
                errorCount++;
            }
            
            results.push(result);
        });

        const validResults = results.filter(r => r.success);
        const hmpiValues = validResults.map(r => r.hmpiResult.value);
        
        const summary = {
            totalSamples: dataArray.length,
            successfulCalculations: successCount,
            failedCalculations: errorCount,
            statistics: hmpiValues.length > 0 ? {
                average: parseFloat((hmpiValues.reduce((a, b) => a + b, 0) / hmpiValues.length).toFixed(2)),
                minimum: Math.min(...hmpiValues),
                maximum: Math.max(...hmpiValues),
                range: parseFloat((Math.max(...hmpiValues) - Math.min(...hmpiValues)).toFixed(2))
            } : null
        };

        return {
            success: true,
            summary: summary,
            results: results,
            calculationDate: new Date().toISOString()
        };
    }

    // UPDATED: Now includes description in return object
    getPollutionStatus(hmpiValue) {
        if (hmpiValue < 15) return { 
            status: 'Excellent', 
            level: 1, 
            color: '#00ff00', 
            description: 'Water quality is excellent for all uses' 
        };
        if (hmpiValue < 30) return { 
            status: 'Good', 
            level: 2, 
            color: '#90ee90', 
            description: 'Water quality is good for most uses' 
        };
        if (hmpiValue < 60) return { 
            status: 'Acceptable', 
            level: 3, 
            color: '#ffff00', 
            description: 'Water quality is acceptable with minor treatment' 
        };
        if (hmpiValue < 100) return { 
            status: 'Poor', 
            level: 4, 
            color: '#ffa500', 
            description: 'Water quality is poor, requires treatment' 
        };
        return { 
            status: 'Polluted', 
            level: 5, 
            color: '#ff0000', 
            description: 'Water is heavily polluted, not suitable for use' 
        };
    }

    getPollutionCategories() {
        return {
            categories: [
                { range: '< 15', status: 'Excellent', level: 1, color: '#00ff00', description: 'Water quality is excellent for all uses' },
                { range: '15-30', status: 'Good', level: 2, color: '#90ee90', description: 'Water quality is good for most uses' },
                { range: '30-60', status: 'Acceptable', level: 3, color: '#ffff00', description: 'Water quality is acceptable with minor treatment' },
                { range: '60-100', status: 'Poor', level: 4, color: '#ffa500', description: 'Water quality is poor, requires treatment' },
                { range: '> 100', status: 'Polluted', level: 5, color: '#ff0000', description: 'Water is heavily polluted, not suitable for use' }
            ],
            standardLimits: this.standardLimits,
            supportedMetals: {
                fromDataset: ['iron', 'arsenic', 'uranium', 'fluoride'],
                fromFile: ['iron', 'arsenic', 'lead', 'cadmium', 'chromium']
            },
            formula: {
                hmpi: 'HMPI = Σ(Wi × Qi) / ΣWi',
                unitWeight: 'Wi = K / Si',
                qualityRating: 'Qi = 100 × (Ci / Si)'
            }
        };
    }
}

export default HMPIController;
