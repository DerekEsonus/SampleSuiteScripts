/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(['N/currentRecord', 'N/runtime', 'N/format'], function(currentRecord, runtime, format) {

    function pageInit(context) {
        try {
            // Check if the record is being created
            if (context.mode === 'create') {
                var rec = currentRecord.get(); // Get the current Sales Order record
                var employeeName = runtime.getCurrentUser().name; // Get the current logged-in employee name
                
                // Get today's date and format it as 'MM/DD/YYYY'
                var today = new Date();
                var formattedDate = format.format({
                    value: today,
                    type: format.Type.DATE
                });
                
                // If both employee name and the date are available, set the memo field
                if (employeeName && formattedDate) {
                    var memoField = employeeName + ' - ' + formattedDate;
                    rec.setValue({ fieldId: 'memo', value: memoField }); // Set the memo field with employee name - today's date
                }
            }
        } catch (e) {
            console.log('Error setting memo field: ', e);
        }
    }

    return {
        pageInit: pageInit
    };
});
