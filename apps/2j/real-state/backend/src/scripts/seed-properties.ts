import { connectToDb } from '../utils/connect-to-db';
import { Property } from '../models';
import { seedPropertiesData } from '../data/seed-properties-data';

const clearExistingProperties = async (): Promise<void> => {
  await Property.deleteMany({});
  console.log('🗑️  Cleared existing properties');
};

const seedProperties = async (): Promise<void> => {
  await Property.insertMany(seedPropertiesData);
  console.log(`✅ Seeded ${seedPropertiesData.length} properties`);
};

const runSeed = async (): Promise<void> => {
  try {
    await connectToDb();
    await clearExistingProperties();
    await seedProperties();
    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function if this file is executed directly
if (require.main === module) {
  runSeed();
}

export { runSeed };