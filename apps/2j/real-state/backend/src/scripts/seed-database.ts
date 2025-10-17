/* eslint-disable complexity */
import { connectToDb } from '../utils/connect-to-db';
import { User, Post, PropertyFeature } from '../models';
import { SAMPLE_PROPERTIES } from '../data/properties';

const seedDatabase = async () => {
  try {
    await connectToDb();
    console.log('🗄️ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await PropertyFeature.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create a sample user
    const sampleUser = new User({
      email: 'admin@realestate.mn',
      password: 'password123',
      isAdmin: true,
      phone: 99112233,
    });
    await sampleUser.save();
    console.log('👤 Created sample user');

    // Create property features and posts from sample data
    for (let i = 0; i < SAMPLE_PROPERTIES.length; i++) {
      const property = SAMPLE_PROPERTIES[i];
      
      // Create PropertyFeature
      const propertyFeature = new PropertyFeature({
        userId: sampleUser._id,
        images: [property.image],
        type: property.type === 'Орон сууц' ? 'apartment' : 
              property.type === 'Байшин' ? 'house' : 'office',
        size: property.area,
        totalRooms: property.bedrooms,
        garage: property.amenities?.includes('Гараж') || false,
        restrooms: property.bathrooms,
        location: {
          address: property.location,
          city: 1, // Ulaanbaatar
          district: property.location.split(',')[0] || 'Сүхбаатар'
        },
        details: {
          completionDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12)),
          windowsCount: property.bedrooms + 1,
          windowType: 'Plastic',
          floorMaterial: 'Parquet',
          floorNumber: Math.floor(Math.random() * 10) + 1,
          balcony: property.amenities?.includes('Балкон') || false,
          totalFloors: Math.floor(Math.random() * 20) + 5,
          lift: property.amenities?.includes('Лифт') || false
        }
      });
      await propertyFeature.save();

      // Create Post
      const post = new Post({
        propertyOwnerId: sampleUser._id,
        title: property.title,
        description: property.description || property.title,
        price: property.price,
        propertyDetail: propertyFeature._id,
        status: 'approved' // Auto-approve for demo
      });
      await post.save();

      console.log(`✅ Created property ${i + 1}: ${property.title}`);
    }

    console.log('🎉 Database seeded successfully!');
    console.log(`📊 Created ${SAMPLE_PROPERTIES.length} properties`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
};

// Run the seeding
seedDatabase();
