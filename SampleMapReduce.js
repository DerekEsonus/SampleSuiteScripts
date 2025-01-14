/**
 * @NApiVersion 2.1
 * @NScriptType mapreducescript
 */

define(['N/search', 'N/log'], function(search, log) {

    // Get the data you are working with.This example is a saved search that gets all sales transactions. Can Add filters for date, location, etc..
    function getInputData() {
        return search.create({
            type: search.Type.TRANSACTION,
            filters: [['type', 'anyof', ['SalesOrd']], 'AND', ['mainline', 'is', 'T']],
            columns: ['entity', 'amount']
        });
    }

    // Map the data - Group transactions by customer. For other map/reduce scripts you can perform your logic here (for example updating fields on all the records returned by getInputData)
    function map(context) {
        var transactionData = JSON.parse(context.value);
        var customerId = transactionData.values.entity.value; // Customer ID
        var amount = parseFloat(transactionData.values.amount); // Transaction Amount

        // Group transactions by customer ID
        context.write({
            key: customerId,
            value: amount
        });
    }

    // Reduce - calculate the total sales for each customer (since the key in this example is the customer)
    function reduce(context) {
        var customerId = context.key; // Customer ID
        var totalSales = 0;

        // Sum all amounts for this customer
        context.values.forEach(function(amount) {
            totalSales += parseFloat(amount);
        });

        log.audit('Customer Total Sales', 'Customer ID: ' + customerId + ', Total Sales: ' + totalSales);
    }


    // Summarize - Log the total number of customers processed and any errors.
    function summarize(summary) {
        let totalCustomers = 0;
    
        // Iterate over the keys to count total customers and log errors simultaneously
        summary.reduceSummary.keys.iterator().each(function(key, error) {
            totalCustomers++; // Increment the counter for each key
            if (error) {
                log.error('Error Processing Customer', 'ID: ' + key + ', Error: ' + error);
            }
            return true; // Continue iterating
        });
    
        log.audit('Summary', 'Total Customers Processed: ' + totalCustomers);
    }
    
    

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
});
