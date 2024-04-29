document.getElementById("filepicker").addEventListener(
    "change",
    (event) => {
      let output = document.getElementById("listing");
      for (const file of event.target.files) {
        let item = document.createElement("li");
        // Construct the full path by concatenating the relative path with the directory path
        let fullPath = event.target.files[0].webkitRelativePath
          ? event.target.files[0].webkitRelativePath.replace(file.name, '')
          : '';
        item.textContent = fullPath + file.name; // Display the full path
        output.appendChild(item);
      }
    },
    false
);
