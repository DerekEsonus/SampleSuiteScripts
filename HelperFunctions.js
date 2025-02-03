/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define(['N/record', 'N/search', 'N/log'], function(record, search, log) {
    
    function getCustomerEmail(customerId) {
        if (!customerId) return null;

        let customerRecord = record.load({
            type: record.Type.CUSTOMER,
            id: customerId
        });

        return customerRecord.getValue('email');
    }

    function formatCurrency(amount) {
        return `$${parseFloat(amount).toFixed(2)}`;
    }

    function logTransactionDetails(transactionId) {
        let transactionSearch = search.lookupFields({
            type: search.Type.TRANSACTION,
            id: transactionId,
            columns: ['tranid', 'amount', 'entity']
        });

        log.debug({
            title: 'Transaction Details',
            details: JSON.stringify(transactionSearch)
        });
    }

    return {
        getCustomerEmail: getCustomerEmail,
        formatCurrency: formatCurrency,
        logTransactionDetails: logTransactionDetails
    };
});
