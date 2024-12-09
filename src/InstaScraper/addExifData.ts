import piexif from "piexifjs";

export default async function addExifMetadataToImage(
  url: RequestInfo | URL,
  fileName: string,
  metadata: { description: string; date: string }
) {
  // Fetch the image blob
  const imageBlob = await fetch(url).then((res) => res.blob());

  // Convert Blob to Data URL
  const dataUrl = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(imageBlob);
  });

  // Add EXIF metadata using piexifjs
  const exifObj = piexif.load(dataUrl);
  exifObj["0th"][piexif.ImageIFD.ImageDescription] = metadata.description;
  exifObj["Exif"][piexif.ExifIFD.DateTimeOriginal] = metadata.date;
  const exifBytes = piexif.dump(exifObj);

  // Insert the metadata back into the image
  const newDataUrl = piexif.insert(exifBytes, dataUrl);

  // Convert the Data URL back to a Blob
  const base64Data = newDataUrl.split(",")[1];
  const newBlob = new Blob([Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))], {
    type: imageBlob.type,
  });

  return new File([newBlob], fileName, { type: newBlob.type });
}

// Example usage
// const metadata = {
//   description: "A beautiful image with metadata",
// };
// const imageUrl = "https://example.com/sample.jpg"; // Replace with your image URL
// addExifMetadataToImage(imageUrl, metadata);
