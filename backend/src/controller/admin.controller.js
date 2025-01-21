import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";

import cloudinary from "../lib/cloudinary.js";

// helper function to upload file to cloudinary
const uploadToCloudinary = async (file) => {
    try{
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "auto",
        });

        return result.secure_url;
    
    } catch(error){
        console.log("Error uploading file to cloudinary", error);
        throw new Error(error);
        
    }
}



export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload all files" });
    }

    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      albumId: albumId || null,
      duration,
      audioUrl,
      imageUrl,
    });

    await song.save();

    // if song belongs to an album, update the album's songs array
    if (albumId) {
      await Album.findById(albumId, {
        $push: {
          songs: song._id,
        },
      });
    }

    res.status(201).json({ message: "Song created successfully", song });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
    next(error);
  }
};
