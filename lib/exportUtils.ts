import * as XLSX from 'xlsx';

export interface ExportData {
    [key: string]: any;
}

export interface ExportOptions {
    filename: string;
    sheetName?: string;
    eventTitle?: string;
    totalAttendees?: number;
    exportDate?: string;
}

export function exportToExcel(data: ExportData[], options: ExportOptions): void {
    try {
        // Create a new workbook
        const workbook = XLSX.utils.book_new();
        
        // Create worksheet from data
        const worksheet = XLSX.utils.json_to_sheet(data);
        
        // Add some styling and metadata
        const sheetName = options.sheetName || 'Attendees';
        
        // Add metadata rows at the top if provided
        if (options.eventTitle || options.totalAttendees || options.exportDate) {
            const metadataRows: any[] = [];
            
            if (options.eventTitle) {
                metadataRows.push({ A: 'Event:', B: options.eventTitle });
            }
            if (options.totalAttendees !== undefined) {
                metadataRows.push({ A: 'Total Attendees:', B: options.totalAttendees });
            }
            if (options.exportDate) {
                metadataRows.push({ A: 'Export Date:', B: new Date(options.exportDate).toLocaleString() });
            }
            
            // Add empty row
            metadataRows.push({});
            
            // Convert metadata to worksheet format and prepend to main data
            const metadataWs = XLSX.utils.json_to_sheet(metadataRows, { skipHeader: true });
            const mainWs = XLSX.utils.json_to_sheet(data);
            
            // Combine metadata and main data
            const combinedData: any[][] = [
                ...XLSX.utils.sheet_to_json(metadataWs, { header: 1 }) as any[][],
                [], // Empty row
                ...XLSX.utils.sheet_to_json(mainWs, { header: 1 }) as any[][]
            ];
            
            const finalWs = XLSX.utils.aoa_to_sheet(combinedData);
            XLSX.utils.book_append_sheet(workbook, finalWs, sheetName);
        } else {
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        }
        
        // Auto-size columns
        const worksheet_final = workbook.Sheets[sheetName];
        const range = XLSX.utils.decode_range(worksheet_final['!ref'] || 'A1');
        const colWidths: number[] = [];
        
        for (let C = range.s.c; C <= range.e.c; ++C) {
            let maxWidth = 10; // minimum width
            for (let R = range.s.r; R <= range.e.r; ++R) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                const cell = worksheet_final[cellAddress];
                if (cell && cell.v) {
                    const cellLength = cell.v.toString().length;
                    maxWidth = Math.max(maxWidth, cellLength);
                }
            }
            colWidths[C] = Math.min(maxWidth + 2, 50); // max width of 50
        }
        
        worksheet_final['!cols'] = colWidths.map(width => ({ width }));
        
        // Write file
        XLSX.writeFile(workbook, options.filename);
        
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        throw new Error('Failed to export Excel file');
    }
}

export function exportToCSV(data: ExportData[], filename: string): void {
    try {
        if (data.length === 0) {
            throw new Error('No data to export');
        }
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header] || '';
                    // Escape quotes and wrap in quotes if contains comma, quote, or newline
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                }).join(',')
            )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error('Error exporting to CSV:', error);
        throw new Error('Failed to export CSV file');
    }
}