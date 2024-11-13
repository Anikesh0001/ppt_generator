function previewImage(event) {
  const preview = document.getElementById("preview");
  const file = event.target.files[0];
  const message = document.getElementById("image-message");

  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      preview.src = reader.result;
      preview.style.display = "block"; // Show the preview
      message.textContent = ""; // Clear previous message
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
    preview.style.display = "none"; // Hide if no file is selected
    message.textContent = "No image selected."; // Show message
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  form.onsubmit = function (event) {
    event.preventDefault(); // Prevent default form submission
    const topic = document.getElementById("topic").value.trim();

    if (topic === "") {
      alert("Please enter a presentation topic.");
      return;
    }

    document.getElementById("loading").style.display = "block"; // Show loading
    document.getElementById("modal-message").textContent = ""; // Clear previous messages

    // Submit the form using AJAX
    const formData = new FormData(form);
    fetch(form.action, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${topic.replace(" ", "_")}_presentation.pptx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        document.getElementById("loading").style.display = "none"; // Hide loading
        document.getElementById("modal-message").textContent =
          "Presentation generated successfully! Your download will start shortly.";
        $("#messageModal").modal("show"); // Show success modal
      })
      .catch((error) => {
        document.getElementById("loading").style.display = "none"; // Hide loading
        document.getElementById("modal-message").textContent =
          "An error occurred while generating the presentation. Please try again.";
        $("#messageModal").modal("show"); // Show error modal
        console.error("There was a problem with the fetch operation:", error);
      });
  };
});
