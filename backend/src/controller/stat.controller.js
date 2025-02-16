import { Song } from '../models/song.model.js';
import { Album } from '../models/album.model.js';
import { User } from '../models/user.model.js';

export const getStats = async (req, res) => {
    try {
        // const totalSong = await Song.countDocuments();
        // const totalUser = await User.countDocuments();
        // const totalAlbum = await Album.countDocuments();
    
        const [totalSong, totalUser, totalAlbum, uniqueArtists] = await Promise.all(
          [
            Song.countDocuments(),
            User.countDocuments(),
            Album.countDocuments(),
    
            Song.aggregate([
              {
                $unionWith: {
                  coll: "albums",
                  pipeline: [],
                },
              },
              {
                $group: {
                  _id: "$artist",
                },
              },
              {
                $count: "count",
              },
            ]),
          ]
        );
    
        res.status(200).json({
          totalSong,
          totalUser,
          totalAlbum,
          uniqueArtists: uniqueArtists[0]?.count || 0,
        });
    
      } catch (error) {
        next(error);
      }
};