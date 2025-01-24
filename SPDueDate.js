document.addEventListener("DOMContentLoaded", function () {
    // Select the required fields
    var decisionDateField = document.querySelector("input[title='Decision Date']");
    var coverageProductField = document.querySelector("select[title='Coverage Product']");
    var priorityField = document.querySelector("select[title='Priority']");
    var typeField = document.querySelector("select[title='Type']");
    var dueDateField = document.querySelector("input[title='Due Date']");

    function isValidTimestamp(dateTime) {
        // Check if the input is a valid date with time
        var dateObj = new Date(dateTime);
        return dateObj instanceof Date && !isNaN(dateObj);
    }

    function calculateDueDate() {
        var decisionDateValue = decisionDateField.value;
        var coverageProduct = coverageProductField.value;
        var priority = priorityField.value;
        var type = typeField.value;

        // Validate the decision date
        if (!isValidTimestamp(decisionDateValue)) {
            console.error("Invalid Decision Date");
            dueDateField.value = ""; // Clear the due date
            return;
        }

        var decisionDate = new Date(decisionDateValue); // Parse the decision date
        var dueDate = null;

        if (coverageProduct === "Direct Claim") {
            // Direct Claim: 60 days from the decision date
            dueDate = new Date(decisionDate);
            dueDate.setDate(dueDate.getDate() + 60);
        } else if (type === "Drug" || (type === "Device" && priority === "Expedited")) {
            // Drug or Device + Expedited: 24 hours from the decision date
            dueDate = new Date(decisionDate);
            dueDate.setHours(dueDate.getHours() + 24);
        } else if (type === "Device" && priority === "Standard") {
            // Device + Standard: 30 days from the decision date
            dueDate = new Date(decisionDate);
            dueDate.setDate(dueDate.getDate() + 30);
        }

        if (dueDate) {
            // Format the due date as required by SharePoint (YYYY-MM-DDTHH:mm:ss)
            dueDateField.value = dueDate.toISOString().slice(0, 19); // Format without milliseconds
        } else {
            console.error("Unable to calculate Due Date");
            dueDateField.value = ""; // Clear the due date
        }
    }

    // Attach event listeners to trigger due date calculation
    if (decisionDateField) {
        decisionDateField.addEventListener("blur", calculateDueDate);
    }
    if (coverageProductField && priorityField && typeField) {
        [coverageProductField, priorityField, typeField].forEach(function (field) {
            field.addEventListener("change", calculateDueDate);
        });
    }
});