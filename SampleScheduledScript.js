/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */

define(['N/file', 'N/record', 'N/log', 'N/search'], function (file, record, log, search) {
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

                // Regex Breakdown: /\d{2}\/\d{2}\/\d{4}/
                // - \d{2}   : Matches exactly 2 digits (e.g., the month or day portion).
                // - \/      : Matches the forward slash '/' literally. The backslash '\' escapes it.
                // - \d{2}   : Matches exactly 2 digits (e.g., the day portion).
                // - \/      : Matches the second forward slash '/' literally.
                // - \d{4}   : Matches exactly 4 digits (e.g., the year portion).
                // Full Pattern: Matches dates in the format 'MM/DD/YYYY'.
                // Example Matches:
                //   - '12/17/2024'
                //   - '01/01/2023'
                // Non-Matches:
                //   - '12-17-2024' (wrong separator '-')
                //   - '1/1/2024'   (missing leading zeros)
                // Regex resources: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions
                if (fileName.match(/\d{2}\/\d{2}\/\d{4}/)) {
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
            // - files.sort((a, b) => b.created - a.created);
            //   Explanation:
            //   - The `sort()` method is used to sort the `files` array.
            //   - `a` and `b` represent two elements (objects) being compared from the array.
            //   - `b.created` and `a.created` are the 'created' dates (as Date objects) of the files.

            // Logic:
            // - Subtract `b.created` (date of the second file) from `a.created` (date of the first file).
            // - This comparison ensures that files are sorted in **descending order** (most recent dates come first):
            //      - If `b.created > a.created`, the result will be positive, and `b` comes before `a`.
            //      - If `b.created < a.created`, the result will be negative, and `a` comes before `b`.

            // Example:
            // Assume the `files` array contains:
            // [
            //     { name: "file1", created: new Date("12/15/2024") },
            //     { name: "file2", created: new Date("12/17/2024") },
            //     { name: "file3", created: new Date("12/16/2024") }
            // ]
            //
            // After sorting, the array becomes:
            // [
            //     { name: "file2", created: new Date("12/17/2024") }, // Most recent date
            //     { name: "file3", created: new Date("12/16/2024") },
            //     { name: "file1", created: new Date("12/15/2024") }
            // ]
            files.sort((a, b) => b.created - a.created);
            const recentFile = files[0];

            log.audit('Most Recent File', `File: ${recentFile.name}, ID: ${recentFile.id}`);

            // Step 2: Load the most recent file and parse its contents
            const paymentFile = file.load({ id: recentFile.id });
            const fileContents = paymentFile.getContents();

            const rows = fileContents.split('\n');
            rows.shift(); // Remove header row

            for (const row of rows) {
                if (!row.trim()) continue; // Skip empty rows - Javascript Documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
                const fields = row.split(','); // Split on the , - Javascript Documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split

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
