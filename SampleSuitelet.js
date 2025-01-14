/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record', 'N/log'], function(serverWidget, record, log) {

    function onRequest(context) {
        // Step 1: Render the Suitelet form
        if (context.request.method === 'GET') {

            // Create the form
            var form = serverWidget.createForm({
                title: 'Update Sales Order Memo'
            });

            // Referencing the form, use form.addField to add your custom fields to the form (these come from the N/ui/serverWidget module)
            form.addField({
                id: 'custpage_salesorder_id',
                type: serverWidget.FieldType.TEXT,
                label: 'Sales Order Internal ID'
            }).isMandatory = true;
            form.addField({
                id: 'custpage_memo',
                type: serverWidget.FieldType.TEXT,
                label: 'Memo'
            }).isMandatory = true;

            // Add submit button
            form.addSubmitButton({
                label: 'Update Memo'
            });

            // Display the form
            context.response.writePage(form);

            // Step 2: Handle the submitted Data
        } else if (context.request.method === 'POST') {

            // The fields you created earlier area available in context.request.parameters.FieldName
            var request = context.request;
            var salesOrderId = request.parameters.custpage_salesorder_id;
            var newMemo = request.parameters.custpage_memo;

            try {
                // Load the Sales Order record
                var salesOrder = record.load({
                    type: record.Type.SALES_ORDER,
                    id: salesOrderId
                });
                
                // Update the memo field
                salesOrder.setValue({
                    fieldId: 'memo',
                    value: newMemo
                });
                
                // Save the updated record
                salesOrder.save();

                // Provide confirmation message
                var form = serverWidget.createForm({
                    title: 'Update Successful'
                });

                // You can add custom HTML to have full control over what you display
                form.addField({
                    id: 'custpage_message',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: ' '
                }).defaultValue = '<p style="color:green;">Memo successfully updated for Sales Order ID: ' + salesOrderId + '</p>';

                // history.back() is a built-in javascript function that mimics the 'Back' button on the browser
                form.addButton({
                    id: 'custpage_back',
                    label: 'Back',
                    functionName: "history.back()"
                });

                context.response.writePage(form);

            } catch (e) {
                //Step 3: Handle errors
                log.error('Error updating Sales Order Memo', e);

                var form = serverWidget.createForm({
                    title: 'Update Failed'
                });
                form.addField({
                    id: 'custpage_message',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: ' '
                }).defaultValue = '<p style="color:red;">Failed to update memo for Sales Order ID: ' + salesOrderId + '. Error: ' + e.message + '</p>';

                form.addButton({
                    id: 'custpage_back',
                    label: 'Back',
                    functionName: "history.back()"
                });

                context.response.writePage(form);
            }
        }
    }

    return {
        onRequest: onRequest
    };

});
