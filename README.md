# Sample SuiteScripts

## Modules used by `SampleUserEvent.js`:

- <a href="https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4267255811.html" target="_blank">N/record</a>
- <a href="https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4345764122.html" target="_blank">N/search</a>
- <a href="https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4358552361.html" target="_blank">N/email</a>
- <a href="https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4296359529.html" target="_blank">N/runtime</a>

## Modules used by `SampleClientScript.js`:

- <a href="https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4625600928.html" target="_blank">N/currentRecord</a>
- <a href="https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4296359529.html" target="_blank">N/runtime</a>
- <a href="https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4388721627.html" target="_blank">N/format</a>


## Modules used by `SampleScheduledScript.js`:

- <a href="https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4267255811.html" target="_blank">N/record</a>
- <a href="https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4205693274.html" target="_blank">N/file</a>
- <a href="https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4345764122.html" target="_blank">N/search</a>
- <a href="https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4574548135.html" target="_blank">N/log</a>

## 📂 Adding a New File to the File Cabinet

To configure the script and run it successfully, follow these steps:

1. **Upload the File**:
   - Add the `ssDemoCsv` file to a new folder in the NetSuite **File Cabinet**.

2. **Update the Folder ID**:
   - Locate the `SampleScheduledScript.js` file.
   - Replace the folder ID with the correct **internal ID** of the newly created folder in the `folderId` variable.

   Example:
   ```javascript
   const folderId = 1234; // Replace with your new folder ID

## Modules used by `SampleSuitelet.js`:

- <a href="https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4267255811.html" target="_blank">N/record</a>
- <a href="https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4574548135.html" target="_blank">N/log</a>
- <a href="https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4321345532.html" target="_blank">N/ui/serverWidget</a>
