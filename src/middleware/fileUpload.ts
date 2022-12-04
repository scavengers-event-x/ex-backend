import multer from 'multer'
import { Error } from 'mongoose'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'

import { fileResponse } from '../utils/constants'
import { ECloudFolderName, Nullable } from '../utils'

const imageFilter = (req, file, cb) => {
  const isImage = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)

  req.fileTypeError = !isImage
  cb(null, isImage)
}

const multerSingleImage = (type = 'image') => {
  return multer({
    fileFilter: imageFilter,
    storage: multer.diskStorage({}),
    limit: { fileSize: 1024 }
  }).single(type)
}

const uploadImage = async (filePath: string, folderName?: ECloudFolderName): Promise<Nullable<UploadApiResponse>> => {
  try {
    const uploadRes = await cloudinary.uploader.upload(filePath, {
      unique_filename: true,
      discard_original_filename: true,
      folder: folderName || ''
    })
    if (!uploadRes) {
      throw new Error(fileResponse.error.UPLOAD)
    }
    return uploadRes
  } catch (err) {
    console.log(err)
    return null
  }
}

const destroyImage = async (publicId: string): Promise<boolean> => {
  try {
    const destroyRes = await cloudinary.uploader.destroy(publicId)
    return destroyRes.result === 'ok'
  } catch (err) {
    console.log(err)
    return false
  }
}

export { uploadImage, destroyImage, multerSingleImage }
