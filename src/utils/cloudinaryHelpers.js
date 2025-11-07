/**
 * Upload image to Cloudinary
 * @param {File} file - The image file to upload
 * @param {string} folder - Cloudinary folder path
 * @param {string} publicId - Custom public ID for the image
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export const uploadToCloudinary = async (
  file,
  folder = "flowtify",
  publicId
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("folder", folder);

    if (publicId) {
      // Add timestamp to create unique public_id and prevent caching
      const timestamp = Date.now();
      formData.append("public_id", `${publicId}_${timestamp}`);
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to upload image");
    }

    const data = await response.json();

    // Add cache-busting parameter to ensure fresh image loads
    const urlWithTimestamp = `${data.secure_url}?v=${Date.now()}`;
    return urlWithTimestamp;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};
