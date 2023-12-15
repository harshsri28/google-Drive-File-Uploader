const { google } = require("googleapis");

const stream = require("stream");
const logger = require("./logger"); // create your winston logger , as you can google it for winston logger

const KEY_FILE_PATH = "credentials.json"; // you can make your credential.json with the help google developer API
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEY_FILE_PATH,
  scopes: SCOPES,
});

const getFileIdByName = async (name) => {
  const drive = google.drive({ version: "v3", auth });
  const query = `name='${name}' and '${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents`;
  const response = await drive.files.list({
    q: query,
    fields: "files(id)",
  });

  if (response.data.files.length > 0) {
    return response.data.files[0].id;
  }

  return null;
};

const deleteFileById = async (fileId) => {
  const drive = google.drive({ version: "v3", auth });

  await drive.files.delete({
    fileId,
  });

  logger.info(`Deleted file in Google Drive with ID: ${fileId}`);
};

const setViewOnlyPermission = async (fileId) => {
  const drive = google.drive({ version: "v3", auth });

  const permission = {
    type: "anyone",
    role: "reader",
  };

  await drive.permissions.create({
    fileId,
    requestBody: permission,
    fields: "id",
  });

  logger.info(`Set view-only permission for file with ID: ${fileId}`);
};

const uploadFile = async (fileObject) => {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);

  const existingFileId = await getFileIdByName(fileObject.originalname);
  if (existingFileId) {
    await deleteFileById(existingFileId);
  }

  const { data } = await google.drive({ version: "v3", auth }).files.create({
    media: {
      mimeType: fileObject.mimetype,
      body: bufferStream,
    },
    requestBody: {
      name: fileObject.originalname,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    },
    fields: "id,name,webViewLink",
  });

  await setViewOnlyPermission(data.id);

  if (existingFileId) {
    logger.info(`Updated file ${data.name} (${data.id})`);
  } else {
    logger.info(`Uploaded file ${data.name} (${data.id})`);
  }
  return data.webViewLink;
};

module.exports = { uploadFile };
