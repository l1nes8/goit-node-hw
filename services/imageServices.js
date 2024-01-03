const multer = require("multer");
const path = require("path");
const uuid = require("uuid").v4;
const fse = require("fs-extra");
const HttpError = require("../utils/HttpErrors");
const Jimp = require("jimp");
const User = require("../models/userSchem");

class ImageService {
  static initUploadImageMiddleware(name) {
    const multerStorage = multer.memoryStorage();

    const multerFilter = (req, file, cbk) => {
      if (file.mimetype.startsWith("image/")) {
        cbk(null, true);
      } else {
        cbk(new HttpError(400, "Please, upload images only!!"), false);
      }
    };

    return multer({
      storage: multerStorage,
      fileFilter: multerFilter,
    }).single("avatar");
  }

  static async saveImage(file, options, userId) {
    if (
      file.size >
      (options?.maxFileSize
        ? options.maxFileSize * 1024 * 1024
        : 1 * 1024 * 1024)
    ) {
      throw new HttpError(400, "File is too large!");
    }

    const fileName = `${userId}_${uuid()}.jpeg`;
    const tmpPath = path.join(process.cwd(), "tmp");
    const destPath = path.join(process.cwd(), "public", "avatars");

    await fse.ensureDir(tmpPath);
    await fse.ensureDir(destPath);
    Jimp.read(file.buffer)
      .then((image) => {
        return image
          .writeAsync(path.join(tmpPath, fileName))
          .then(() =>
            image.resize(250, 250).writeAsync(path.join(destPath, fileName))
          );
      })
      .catch((err) => {
        console.log(err);
      });

    const avatarPath = path.join("avatars", fileName);

    await User.findByIdAndUpdate(userId, { avatarURL: avatarPath });

    return avatarPath;
  }
}

module.exports = ImageService;
