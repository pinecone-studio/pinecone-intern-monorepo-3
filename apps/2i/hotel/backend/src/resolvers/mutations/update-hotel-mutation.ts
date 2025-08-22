import { HotelModel } from '../../models/hotel-model';

type UpdatedHotelType = {
  hotelName?: string;
  description?: string;
  location?: string;
  starRating?: string;
  image?: string[];
};

const getFieldsToUpdate = (args: UpdatedHotelType): Partial<UpdatedHotelType> => {
  const updatableFields: (keyof UpdatedHotelType)[] = ['hotelName', 'description', 'location', 'starRating', 'image'];

  const fieldsToUpdate: Partial<UpdatedHotelType> = {};

  for (const field of updatableFields) {
    const value = args[field];
    if (value !== undefined) {
      (fieldsToUpdate as any)[field] = args[field];
    }
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new Error('No fields to update');
  }

  return fieldsToUpdate;
};

const validateArgs = (args: { id?: string }) => {
  if (!args.id) {
    throw new Error('No ID provided');
  }
};

export const updateHotel = async (
  _: unknown,
  args: {
    id: string;
    hotelName?: string;
    description?: string;
    location?: string;
    starRating?: string;
    image?: string[];
  }
) => {
  validateArgs(args);

  const fieldsToUpdate = getFieldsToUpdate(args);

  const updatedHotel = await HotelModel.findOneAndUpdate({ _id: args.id }, fieldsToUpdate, { new: true });

  if (!updatedHotel) {
    throw new Error('Hotel not found');
  }

  return updatedHotel;
};

// import { HotelModel } from '../../models/hotel-model';

// export const updateHotel = async (
//   _: unknown,
//   args: {
//     id: string;
//     hotelName?: string;
//     description?: string;
//     location?: string;
//     starRating?: string;
//     image?: string[];
//   }
// ) => {
//   if (!args.id) {
//     throw new Error('No ID provided');
//   }

//   const fieldsToUpdate: Record<string, unknown> = {};

//   if (args.hotelName !== undefined) fieldsToUpdate.hotelName = args.hotelName;
//   if (args.description !== undefined) fieldsToUpdate.description = args.description;
//   if (args.location !== undefined) fieldsToUpdate.location = args.location;
//   if (args.starRating !== undefined) fieldsToUpdate.starRating = args.starRating;
//   if (args.image !== undefined) fieldsToUpdate.image = args.image;

//   if (Object.keys(fieldsToUpdate).length === 0) {
//     throw new Error('No fields to update');
//   }

//   const updatedHotel = await HotelModel.findOneAndUpdate({ _id: args.id }, fieldsToUpdate, { new: true });

//   if (!updatedHotel) {
//     throw new Error('Hotel not found');
//   }

//   return updatedHotel;
// };
