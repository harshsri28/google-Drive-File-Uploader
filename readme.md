# Google Drive File Uploader

## Overview

This Node.js application allows users to upload files to Google Drive, ensuring secure access and configurability for permissions.

## Prerequisites

Before using this application, make sure you have the following:

- Node.js installed on your machine.
- Google Drive API credentials. You can create a `credentials.json` file through the Google Developer API. Follow the steps in [Google Drive API Quickstart](https://developers.google.com/drive/api/v3/quickstart) to set up your credentials.

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/your-repo.git
   ```

2. Install the required npm packages:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and add the following:

   ```env
   GOOGLE_DRIVE_FOLDER_ID=your-folder-id
   ```

   Replace `your-folder-id` with the ID of the Google Drive folder where you want to upload files.

## Usage

### Uploading Files

To upload a file, use the following code:

```javascript
const { uploadFile } = require("./path/to/your/uploadFile");

const fileObject = {
  buffer: "file-buffer", // The file content as a buffer
  originalname: "file.txt", // The original name of the file
  mimetype: "text/plain", // The MIME type of the file
};

uploadFile(fileObject)
  .then((webViewLink) => {
    console.log(`File uploaded successfully. WebViewLink: ${webViewLink}`);
  })
  .catch((error) => {
    console.error("Error uploading file:", error.message);
  });
```

### Permissions

By default, only read permissions are granted to anyone. You can configure permissions in `setViewOnlyPermission` function in `uploadFile.js`.

## Configurations

- `KEY_FILE_PATH`: Path to your `credentials.json` file.
- `SCOPES`: Google Drive API scopes.
- `GOOGLE_DRIVE_FOLDER_ID`: ID of the Google Drive folder.

## Security

This application ensures that only read permissions are granted to anyone. You can modify the permission settings in the `setViewOnlyPermission` function.

## License

This project is licensed under the [MIT License](LICENSE).

---
