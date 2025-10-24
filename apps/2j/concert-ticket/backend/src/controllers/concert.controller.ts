import { Types } from 'mongoose';
import { Concert } from '../models/model.concert';
import { Artist } from '../models/model.artist';
import { TicketCategory } from '../models/model.ticket-category';
import { CreateConcertInput, UpdateConcertInput, ConcertFilterInput, PaginationInput } from '../generated/types';

export class ConcertController {
  // Бүх концертуудыг хайх
  static async getConcerts(filter?: ConcertFilterInput, pagination?: PaginationInput) {
    try {
      const limit = pagination?.limit || 10;
      const offset = pagination?.offset || 0;

      // Хайлтын query үүсгэх
      const query: Record<string, unknown> = { isActive: true };

      if (filter?.name) {
        // Юникод дэмжсэн case-insensitive regex хайлт
        const nameRegex = new RegExp(filter.name, 'i');

        // Артистын нэрээр хайхаар artist id-уудыг олж $or-д нэмнэ
        const artistIds = await Artist.find({ name: nameRegex }).distinct('_id');

        query.$or = [
          { name: nameRegex },
          { venue: nameRegex },
          ...(artistIds.length > 0 ? [{ mainArtist: { $in: artistIds } }] : []),
        ];
      }
      if (filter?.artistId) {
        query.$or = [
          { mainArtist: new Types.ObjectId(filter.artistId) },
          { otherArtists: new Types.ObjectId(filter.artistId) }
        ];
      }
      if (filter?.date) {
        const filterDate = new Date(filter.date);
        query.date = {
          $gte: new Date(filterDate.setHours(0, 0, 0, 0)),
          $lt: new Date(filterDate.setHours(23, 59, 59, 999))
        };
      }

      // Концертуудыг олох
      const concerts = await Concert.find(query)
        .populate('mainArtist')
        .populate('otherArtists')
        .sort({ date: 1 })
        .limit(limit)
        .skip(offset);

      // Нийт тоог тоолох
      const totalCount = await Concert.countDocuments(query);

      return {
        concerts,
        totalCount,
        hasMore: offset + limit < totalCount
      };
    } catch (error) {
      throw new Error(`Концертуудыг олоход алдаа гарлаа: ${error}`);
    }
  }

  // Нэг концертыг ID-аар олох
  static async getConcertById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Буруу концертын ID');
      }

      const concert = await Concert.findById(id)
        .populate('mainArtist')
        .populate('otherArtists')

      if (!concert) {
        throw new Error('Концерт олдсонгүй');
      }

      return concert;
    } catch (error) {
      throw new Error(`Концерт олоход алдаа гарлаа: ${error}`);
    }
  }

  // Шинэ концерт үүсгэх (админ хэрэглэгчдэд зориулсан)
  static async createConcert(input: CreateConcertInput) {
    try {
      // Main artist-г шалгах
      const mainArtist = await Artist.findById(input.mainArtistId);
      if (!mainArtist) {
        throw new Error('Үндсэн дуучин олдсонгүй');
      }

      // Other artists-г шалгах
      if (input.otherArtistIds && input.otherArtistIds.length > 0) {
        const otherArtists = await Artist.find({ _id: { $in: input.otherArtistIds } });
        if (otherArtists.length !== input.otherArtistIds.length) {
          throw new Error('Зарим дуучин олдсонгүй');
        }
      }

      // Концерт үүсгэх
      const concert = new Concert({
        name: input.name,
        description: input.description,
        venue: input.venue,
        date: new Date(input.date),
        time: input.time,
        mainArtist: input.mainArtistId,
        otherArtists: input.otherArtistIds || [],
        image: input.image,
        isActive: input.isActive !== undefined ? input.isActive : true
      });

      const savedConcert = await concert.save();

      // Ticket categories үүсгэх
      if (input.ticketCategories && input.ticketCategories.length > 0) {
        const ticketCategories = input.ticketCategories.map(category => ({
          ...category,
          concert: savedConcert._id,
          availableQuantity: category.totalQuantity
        }));

        await TicketCategory.insertMany(ticketCategories);
      }

      // Populate-тайгаар буцаах
      return await Concert.findById(savedConcert._id)
        .populate('mainArtist')
        .populate('otherArtists')
    } catch (error) {
      throw new Error(`Концерт үүсгэхэд алдаа гарлаа: ${error}`);
    }
  }

  // Концерт засах (админ хэрэглэгчдэд зориулсан)
  static async updateConcert(id: string, input: UpdateConcertInput) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Буруу концертын ID');
      }

      const concert = await Concert.findById(id);
      if (!concert) {
        throw new Error('Концерт олдсонгүй');
      }

      // Main artist шалгах
      if (input.mainArtistId) {
        const mainArtist = await Artist.findById(input.mainArtistId);
        if (!mainArtist) {
          throw new Error('Үндсэн дуучин олдсонгүй');
        }
      }

      // Other artists шалгах
      if (input.otherArtistIds) {
        const otherArtists = await Artist.find({ _id: { $in: input.otherArtistIds } });
        if (otherArtists.length !== input.otherArtistIds.length) {
          throw new Error('Зарим дуучин олдсонгүй');
        }
      }

      // Концерт засах
      const updateData: Record<string, unknown> = {};
      if (input.name) updateData.name = input.name;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.venue) updateData.venue = input.venue;
      if (input.date) updateData.date = new Date(input.date);
      if (input.time) updateData.time = input.time;
      if (input.isActive !== undefined) updateData.isActive = input.isActive;
      if (input.mainArtistId) updateData.mainArtist = input.mainArtistId;
      if (input.otherArtistIds) updateData.otherArtists = input.otherArtistIds;
      if (input.image !== undefined) updateData.image = input.image;

      const updatedConcert = await Concert.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      )
        .populate('mainArtist')
        .populate('otherArtists')

      return updatedConcert;
    } catch (error) {
      throw new Error(`Концерт засахдаа алдаа гарлаа: ${error}`);
    }
  }

  // Концерт устгах (админ хэрэглэгчдэд зориулсан)
  static async deleteConcert(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Буруу концертын ID');
      }

      const concert = await Concert.findById(id);
      if (!concert) {
        throw new Error('Концерт олдсонгүй');
      }

      // Холбоотой ticket categories-г устгах
      await TicketCategory.deleteMany({ concert: id });

      // Концертыг устгах
      await Concert.findByIdAndDelete(id);

      return true;
    } catch (error) {
      throw new Error(`Концерт устгахад алдаа гарлаа: ${error}`);
    }
  }

  // Хайлтын санал олох
  static async getSearchSuggestions(query: string) {
    try {
      const concerts = await Concert.find(
        { 
          $text: { $search: query },
          isActive: true 
        },
        { name: 1, venue: 1 }
      )
        .limit(5)
        .sort({ score: { $meta: 'textScore' } });

      const suggestions = new Set<string>();
      
      concerts.forEach(concert => {
        suggestions.add(concert.name);
        suggestions.add(concert.venue);
      });

      return Array.from(suggestions);
    } catch (error) {
      throw new Error(`Хайлтын санал олоход алдаа гарлаа: ${error}`);
    }
  }
}
