import { HotelModel } from '../../models/hotel-model';

const validateArgs = (args: { id: string; [key: string]: unknown }) => {
  if (!args.id) {
    throw new Error('No ID provided');
  }
};

const getFieldsToUpdate = (args: { hotelName?: string; description?: string; location?: string; starRating?: string }) => {
  const updatableFields = ['hotelName', 'description', 'location', 'starRating'] as const;
  const fieldsToUpdate: Partial<typeof args> = {};
  for (const field of updatableFields) {
    if (args[field] !== undefined) {
      fieldsToUpdate[field] = args[field];
    }
  }
  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new Error('No fields to update');
  }
  return fieldsToUpdate;
};

export const updateHotel = async (
  _: unknown,
  args: {
    id: string;
    hotelName?: string;
    description?: string;
    location?: string;
    starRating?: string;
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
