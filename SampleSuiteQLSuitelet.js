/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/query', 'N/log'], function (query, log) {

    function onRequest(context) {
        try {
            // Define SuiteQL Query to fetch active customers and total transaction amounts
            let sql = `
                SELECT
                    so.id AS SalesOrderID,
                    so.tranid AS SalesOrderNumber,
                    so.trandate AS OrderDate,
                    cust.id AS CustomerID,
                    cust.entityid AS CustomerName,
                    item.id AS ItemID,
                    item.itemid AS ItemName,
                    soi.quantity AS QuantityOrdered,
                    soi.rate AS ItemRate,
                    soi.netamount AS LineNetAmount -- Corrected field
                FROM
                    transaction AS so
                JOIN 
                    transactionline AS soi ON so.id = soi.transaction
                JOIN 
                    entity AS cust ON so.entity = cust.id
                JOIN 
                    item AS item ON soi.item = item.id
                WHERE 
                    so.type = 'SalesOrd'
                    AND so.trandate BETWEEN TO_DATE('2024-01-01', 'YYYY-MM-DD') AND TO_DATE('2024-01-31', 'YYYY-MM-DD') -- Date filter
                ORDER BY 
                    so.trandate DESC;
            `;

            // Execute the query
            let resultSet = query.runSuiteQL({ query: sql });

            // Convert results to an array of mapped objects
            let results = resultSet.asMappedResults();

            // Log and return results
            log.debug({ title: 'Customer Transaction Report', details: results });

            context.response.write(JSON.stringify(results));

        } catch (error) {
            log.error({ title: 'Error Running SuiteQL', details: error });
            context.response.write(JSON.stringify({ error: error.message }));
        }
    }

    return { onRequest };
});
