function cancelComplaint() {
    document.getElementById("complaintText").value = "";
    document.getElementById("complaintImage").value = "";
}



function updateYearDropdown() {
    var selectedHostel = document.getElementById("hostelDropdown").value;

    // Get the second dropdown
    var yearDropdown = document.getElementById("yearDropdown");
    yearDropdown.innerHTML = '';

    // Add options based on the selected category
    if (selectedHostel === "SVBH") {
      addOption(yearDropdown, "1st Year", "1st Year");
    } else if (selectedHostel === "DJGH") {
      addOption(yearDropdown, "1st Year", "1st Year");
      addOption(yearDropdown, "2nd Year", "2nd Year");
    }else if (selectedHostel === "Tilak Hostel") {
      addOption(yearDropdown, "2nd Year", "2nd Year");
      addOption(yearDropdown, "3rd Year", "3rd Year");
    }else if (selectedHostel === "Patel Hostel") {
        addOption(yearDropdown, "2nd Year", "2nd Year");
        addOption(yearDropdown, "3rd Year", "3rd Year");
    }else if (selectedHostel === "KNGH") {
        addOption(yearDropdown, "3rd Year", "3rd Year");
        addOption(yearDropdown, "Final Year", "Final Year");
    }

  }

  function addOption(selectElement, text, value) {
    var option = document.createElement("option");
    option.text = text;
    option.value = value;
    selectElement.add(option);
  }

// function submitComplaint() {
//     // Should add logic for submitting the complaint here       ----->      (NOT YET DONE)
//     // var complaintText = document.getElementById("complaintText").value;
//     // var complaintImage = document.getElementById("complaintImage").value;

//     // Add submission logic or send data to the server here     ----->      (NOT YET DONE)

//     // For demonstration 
//     // console.log("Complaint Text:", complaintText);
//     // console.log("Complaint Image:", complaintImage);
// }
