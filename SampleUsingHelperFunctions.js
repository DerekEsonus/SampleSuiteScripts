/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/log', '/SuiteScripts/HelperFunctions'], function(record, log, HelperFunctions) {

    function afterSubmit(context) {
        let newRecord = context.newRecord;
        let customerId = newRecord.getValue('entity');
        let transactionAmount = newRecord.getValue('total');

        // Use the Helper Library
        let customerEmail = HelperFunctions.getCustomerEmail(customerId);
        let formattedAmount = HelperFunctions.formatCurrency(transactionAmount);

        log.debug({
            title: 'Order Confirmation',
            details: `Customer Email: ${customerEmail}, Order Total: ${formattedAmount}`
        });

        // Log transaction details
        HelperFunctions.logTransactionDetails(newRecord.id);
    }

    return { afterSubmit: afterSubmit };
});
