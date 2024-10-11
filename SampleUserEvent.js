/**
* @NApiVersion 2.1
* @NScriptType UserEventScript
*/
define(['N/record', 'N/search', 'N/email', 'N/runtime'], function (record, search, email, runtime) {
    
    function afterSubmit(context) {
        // Ensure the event type is 'create'
        if (context.type !== context.UserEventType.CREATE) {
            return;
        }

        let recObj = context.newRecord;
        const customerId = recObj.getValue({fieldId: "entity"});

        // Initialize an array to collect all email recipients
        let emailRecipients = [];

        // Get the customer email and contact emails
        const customerEmail = getCustomerEmail(customerId);
        const contactEmails = getContactEmails(customerId);

        // Add them to the recipients list if they exist
        if (customerEmail) {
            emailRecipients.push(customerEmail);
        }

        if (contactEmails && contactEmails.length > 0) {
            emailRecipients = emailRecipients.concat(contactEmails);
        }

        // Send email if there are any recipients
        if (emailRecipients.length > 0) {
            sendEmail(emailRecipients);
        }
    }

    function getCustomerEmail(customerId) {
        // Load the customer record
        let customerRec = record.load({
            type: record.Type.CUSTOMER,
            id: customerId
        });

        // Get the email from the customer record
        return customerRec.getValue({fieldId: 'email'});
    }

    function getContactEmails(customerId) {
        // Search for contacts linked to the customer
        let contactEmails = [];
        let contactSearch = search.create({
            type: "contact",
            filters: [
                ["company", "anyof", customerId], 
                ["email", "isnotempty", ""]
            ],
            columns: [
                "email"
            ]
        });

        // Execute the search and collect all the contact emails
        contactSearch.run().each(function(result){
            contactEmails.push(result.getValue({name: 'email'}));
            return true; // Continue iterating over the results
        });

        return contactEmails;
    }

    function sendEmail(emailRecipients) {
        const authorId = runtime.getCurrentUser().id;
        const subject = 'New Record Created';
        const body = 'A new record has been created. Please review the details.';

        // Send email to all recipients
        email.send({
            author: authorId,
            recipients: emailRecipients,
            subject: subject,
            body: body
        });
    }

    return {
        afterSubmit: afterSubmit
    };
});
