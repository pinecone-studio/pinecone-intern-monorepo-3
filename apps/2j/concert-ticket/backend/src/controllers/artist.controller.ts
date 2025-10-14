import { Types } from 'mongoose';
import { Artist } from '../models/model.artist';
import { Concert } from '../models/model.concert';
import { ArtistInput } from '../generated/types';

export class ArtistController {
  // Бүх дуучнуудыг авах
  static async getArtists() {
    try {
      const artists = await Artist.find({})
        .sort({ name: 1 });

      return artists;
    } catch (error) {
      throw new Error(`Дуучнуудыг олоход алдаа гарлаа: ${error}`);
    }
  }

  // Нэг дуучныг ID-аар олох
  static async getArtistById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Буруу дуучны ID');
      }

      const artist = await Artist.findById(id);
      if (!artist) {
        throw new Error('Дуучин олдсонгүй');
      }

      return artist;
    } catch (error) {
      throw new Error(`Дуучин олоход алдаа гарлаа: ${error}`);
    }
  }

  // Дуучны концертуудыг авах
  static async getArtistConcerts(artistId: string) {
    try {
      if (!Types.ObjectId.isValid(artistId)) {
        throw new Error('Буруу дуучны ID');
      }

      const concerts = await Concert.find({
        $or: [
          { mainArtist: artistId },
          { otherArtists: artistId }
        ],
        isActive: true
      })
        .populate('mainArtist')
        .populate('otherArtists')
        .sort({ date: 1 });

      return concerts;
    } catch (error) {
      throw new Error(`Дуучны концертуудыг олоход алдаа гарлаа: ${error}`);
    }
  }

  // Шинэ дуучин үүсгэх (админ хэрэглэгчдэд зориулсан)
  static async createArtist(input: ArtistInput) {
    try {
      // Нэр давхардах эсэхийг шалгах
      const existingArtist = await Artist.findOne({ 
        name: { $regex: new RegExp(`^${input.name}$`, 'i') } 
      });

      if (existingArtist) {
        throw new Error('Энэ нэртэй дуучин аль хэдийн байна');
      }

      const artist = new Artist({
        name: input.name,
        bio: input.bio,
        image: input.image
      });

      const savedArtist = await artist.save();
      return savedArtist;
    } catch (error) {
      throw new Error(`Дуучин үүсгэхэд алдаа гарлаа: ${error}`);
    }
  }

  // Дуучны мэдээллийг засах (админ хэрэглэгчдэд зориулсан)
  static async updateArtist(id: string, input: ArtistInput) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Буруу дуучны ID');
      }

      const artist = await Artist.findById(id);
      if (!artist) {
        throw new Error('Дуучин олдсонгүй');
      }

      // Нэр давхардах эсэхийг шалгах (өөр дуучны хувьд)
      if (input.name && input.name !== artist.name) {
        const existingArtist = await Artist.findOne({ 
          name: { $regex: new RegExp(`^${input.name}$`, 'i') },
          _id: { $ne: id }
        });

        if (existingArtist) {
          throw new Error('Энэ нэртэй дуучин аль хэдийн байна');
        }
      }

      // Дуучны мэдээллийг засах
      const updateData: any = {};
      if (input.name) updateData.name = input.name;
      if (input.bio !== undefined) updateData.bio = input.bio;
      if (input.image !== undefined) updateData.image = input.image;

      const updatedArtist = await Artist.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      return updatedArtist;
    } catch (error) {
      throw new Error(`Дуучны мэдээлэл засахдаа алдаа гарлаа: ${error}`);
    }
  }

  // Дуучныг устгах (админ хэрэглэгчдэд зориулсан)
  static async deleteArtist(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Буруу дуучны ID');
      }

      const artist = await Artist.findById(id);
      if (!artist) {
        throw new Error('Дуучин олдсонгүй');
      }

      // Дуучны концертуудыг шалгах
      const concertsWithArtist = await Concert.find({
        $or: [
          { mainArtist: id },
          { otherArtists: id }
        ],
        isActive: true
      });

      if (concertsWithArtist.length > 0) {
        throw new Error('Идэвхтэй концерттай дуучныг устгах боломжгүй');
      }

      // Дуучныг устгах
      await Artist.findByIdAndDelete(id);

      return true;
    } catch (error) {
      throw new Error(`Дуучин устгахад алдаа гарлаа: ${error}`);
    }
  }

  // Дуучнуудыг нэрээр хайх
  static async searchArtists(query: string) {
    try {
      const artists = await Artist.find({
        $text: { $search: query }
      })
        .sort({ score: { $meta: 'textScore' } })
        .limit(10);

      return artists;
    } catch (error) {
      throw new Error(`Дуучнуудыг хайхад алдаа гарлаа: ${error}`);
    }
  }
}
