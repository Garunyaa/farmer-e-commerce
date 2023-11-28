import { successResponse, errorResponse } from "../configs/response";

export const uploadImage = (req, res) => {
  try {
    let sampleFile;
    let uploadPath;
    if (!req.files || Object.keys(req.files).length === 0) {
      return errorResponse(res, 400, 'No files were uploaded', {});
    }

    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + /uploads/ + sampleFile.name;

    sampleFile.mv(uploadPath, (error) => {
      if (error) {
        return errorResponse(res, 500, { error: error.message }, {});
      }

      return successResponse(res, 200, 'File uploaded', {
        filename: sampleFile.name,
      });
    });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, 'Internal Server Error', { error: error.message });
  }
};
