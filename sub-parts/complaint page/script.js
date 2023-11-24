function cancelComplaint() {
    document.getElementById("complaintText").value = "";
    document.getElementById("complaintImage").value = "";
}

function submitComplaint() {
    // Should add logic for submitting the complaint here       ----->      (NOT YET DONE)
    var complaintText = document.getElementById("complaintText").value;
    var complaintImage = document.getElementById("complaintImage").value;

    // Add submission logic or send data to the server here     ----->      (NOT YET DONE)

    // For demonstration 
    console.log("Complaint Text:", complaintText);
    console.log("Complaint Image:", complaintImage);
}
