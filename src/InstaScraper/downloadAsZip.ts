import JSZip from "jszip";

export default async function downloadFilesAsZip(files: File[], zipFileName: string) {
  const zip = new JSZip();

  // Add each file to the zip
  files.forEach((file) => {
    // If file is a Blob or File object, use it directly
    if (typeof file === "object" && file instanceof File) {
      zip.file(`${file.name}`, file);
    }
  });

  // Generate the zip file as a Blob and trigger download
  await zip.generateAsync({ type: "blob" }).then(function (content) {
    // Create a download link and trigger the download

    const link = URL.createObjectURL(content);

    chrome.downloads.download(
      {
        url: link,
        filename: `${zipFileName}.zip`,
        saveAs: false, // Set true to prompt user for file location
      },
      (downloadId) => {
        if (chrome.runtime.lastError) {
          console.error("Download failed:", chrome.runtime.lastError.message);
        } else {
          console.log("Download started:", downloadId);
        }
      }
    );

    // const link = document.createElement("a");
    // link.href = URL.createObjectURL(content);
    // link.download = `${zipFileName}.zip`; // Name of the zip file
    // link.click();
  });
}

// Example usage:
// Assume `file1` and `file2` are File objects from input or Blob objects
// const files = [
//   new File(["Hello, world!"], "file1.txt", { type: "text/plain" }),
//   new Blob(["This is a test PDF content"], { type: "application/pdf" }),
// ];

// downloadFilesAsZip(files);
