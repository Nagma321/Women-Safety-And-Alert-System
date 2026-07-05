const getPublicIdFromUrl = (url) => {
    try {
      // Split by '/' and get everything after 'upload'
      const urlParts = url.split('upload/');
      if (urlParts.length < 2) throw new Error('Invalid Cloudinary URL');
      
      // Get the second part (after upload/)
      const afterUpload = urlParts[1];
      
      // Remove the version number (v1234567890/)
      const withoutVersion = afterUpload.split('/').slice(1).join('/');
      
      // Remove the file extension
      const publicId = withoutVersion.replace(/\.[^/.]+$/, '');
      
      return publicId;
    } catch (error) {
      console.error("Error extracting public_id from URL:", error);
      throw error;
    }
  };
  
  
  

  export default getPublicIdFromUrl