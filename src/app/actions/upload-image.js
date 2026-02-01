"use server";

/**
 * Upload image to Imgbb
 * @param {string} base64Image - Base64 encoded image string
 * @returns {Promise<{success: boolean, url?: string, message?: string}>}
 */
export async function uploadToImgbb(base64Image) {
  try {
    const apiKey = process.env.IMGBB_API;

    if (!apiKey) {
      return {
        success: false,
        message: "Imgbb API key is not configured.",
      };
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("image", base64Image.split(",")[1] || base64Image); // Remove data:image/png;base64, prefix

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        url: data.data.url,
      };
    } else {
      console.error("Imgbb upload error data:", data);
      return {
        success: false,
        message: data.error?.message || "Failed to upload image to Imgbb.",
      };
    }
  } catch (error) {
    console.error("Imgbb upload error:", error);
    return {
      success: false,
      message: "An error occurred during the image upload.",
    };
  }
}
