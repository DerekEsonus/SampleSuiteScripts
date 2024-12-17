/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */

define(['N/file', 'N/record', 'N/log', 'N/search'], function(file, record, log, search) {
    const execute = (context) => {
        log.debug('Scheduled Script', 'Starting Approval Status Update Process');

        try {
            // Step 1: Search for files in the folder
            const folderId = 4180; // Replace with your File Cabinet folder ID
            const files = [];

            const fileSearch = search.create({
                type: 'folder',
                filters: [['internalid', 'is', folderId]],
                columns: [
                    search.createColumn({ name: 'internalid', join: 'file' }),
                    search.createColumn({ name: 'name', join: 'file' })
                ]
            });

            fileSearch.run().getRange({ start: 0, end: 1000 }).forEach(result => {
                const fileName = result.getValue({ name: 'name', join: 'file' });
                const fileId = result.getValue({ name: 'internalid', join: 'file' });
                
                if (fileName.match(/\d{2}\/\d{2}\/\d{4}/)) { // Check for date pattern in filename
                    files.push({
                        id: fileId,
                        name: fileName,
                        created: new Date(fileName.match(/\d{2}\/\d{2}\/\d{4}/)[0])
                    });
                }
            });

            if (files.length === 0) {
                log.error('No Files Found', 'No valid Vendor Bill CSV files found in the folder.');
                return;
            }

            // Sort files by the date extracted from their names (most recent first)
            files.sort((a, b) => b.created - a.created);
            const recentFile = files[0];

            log.debug('Most Recent File', `File: ${recentFile.name}, ID: ${recentFile.id}`);

            // Step 2: Load the most recent file and parse its contents
            const paymentFile = file.load({ id: recentFile.id });
            const fileContents = paymentFile.getContents();

            const rows = fileContents.split('\n');
            rows.shift(); // Remove header row

            for (const row of rows) {
                if (!row.trim()) continue; // Skip empty rows
                const fields = row.split(',');

                const recordId = fields[0].trim(); // Vendor Bill Internal ID
                const approvalStatus = fields[1].trim().toLowerCase(); // Approval Status (e.g., Approved)

                // Only process records with "approved" status
                if (approvalStatus !== 'approved') {
                    log.debug('Skipping Record', `Record ID: ${recordId}, Status: ${approvalStatus}`);
                    continue;
                }

                try {
                    // Step 3: Load the Vendor Bill and update Approval Status to Approved
                    const billRecord = record.load({
                        type: record.Type.VENDOR_BILL,
                        id: recordId
                    });

                    billRecord.setValue({
                        fieldId: 'approvalstatus',
                        value: 2 // Approved status
                    });

                    billRecord.save();
                    log.debug('Success', `Bill ID ${recordId} updated to Approved`);
                } catch (error) {
                    log.error('Error Updating Record', `Record ID: ${recordId}, Error: ${error.message}`);
                }
            }
        } catch (error) {
            log.error('Script Error', error.message);
        }

        log.debug('Scheduled Script', 'Approval Status Update Process Completed');
    };

    return { execute };
});
