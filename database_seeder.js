const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models (assuming they're in the same file structure)
const User = require('./models/User');
const AudioContent = require('./models/AudioContent');
const ReadingContent = require('./models/ReadingContent');
const YogaContent = require('./models/YogaContent');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/calmnest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await AudioContent.deleteMany({});
    await ReadingContent.deleteMany({});
    await YogaContent.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = new User({
      username: 'admin',
      email: 'admin@calmnest.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      age: 30,
      role: 'admin',
      isVerified: true
    });
    await adminUser.save();

    // Create sample users
    const users = [];
    for (let i = 1; i <= 5; i++) {
      const hashedPassword = await bcrypt.hash(`user${i}123`, 12);
      const user = new User({
        username: `user${i}`,
        email: `user${i}@example.com`,
        password: hashedPassword,
        firstName: `User${i}`,
        lastName: 'Test',
        age: 20 + i,
        preferences: {
          favoriteTherapies: ['audio', 'reading'],
          musicGenres: ['classical', 'nature'],
          bookCategories: ['motivational', 'self-help']
        }
      });
      users.push(user);
      await user.save();
    }

    console.log('👥 Created admin and sample users');

    // Seed Audio Content
    const audioContents = [
      {
        title: 'Ocean Waves Meditation',
        description: 'Calming ocean sounds to help you relax and find inner peace',
        category: 'nature-sounds',
        audioUrl: '/sample-audio/ocean-waves.mp3',
        duration: 1800, // 30 minutes
        artist: 'Nature Sounds',
        tags: ['relaxation', 'meditation', 'ocean', 'calm'],
        uploadedBy: adminUser._id
      },
      {
        title: 'Daily Affirmations for Success',
        description: 'Positive affirmations to start your day with confidence',
        category: 'affirmations',
        audioUrl: '/sample-audio/daily-affirmations.mp3',
        duration: 900, // 15 minutes
        artist: 'CalmNest Team',
        tags: ['motivation', 'success', 'confidence', 'morning'],
        uploadedBy: adminUser._id
      },
      {
        title: 'Stress Relief Classical Music',
        description: 'Beautiful classical compositions for stress relief',
        category: 'music',
        audioUrl: '/sample-audio/classical-stress-relief.mp3',
        duration: 2700, // 45 minutes
        artist: 'Various Artists',
        tags: ['classical', 'stress-relief', 'peaceful'],
        uploadedBy: adminUser._id
      },
      {
        title: 'Mindfulness Meditation Podcast',
        description: 'Learn the basics of mindfulness meditation',
        category: 'podcast',
        audioUrl: '/sample-audio/mindfulness-podcast.mp3',
        duration: 1200, // 20 minutes
        artist: 'Dr. Sarah Johnson',
        tags: ['mindfulness', 'meditation', 'education'],
        uploadedBy: adminUser._id
      },
      {
        title: 'Rain Forest Sounds',
        description: 'Natural rainforest ambiance for deep relaxation',
        category: 'nature-sounds',
        audioUrl: '/sample-audio/rainforest.mp3',
        duration: 3600, // 60 minutes
        artist: 'Nature Sounds',
        tags: ['nature', 'rain', 'forest', 'ambient'],
        uploadedBy: adminUser._id
      }
    ];

    for (const audioData of audioContents) {
      const audio = new AudioContent(audioData);
      await audio.save();
    }

    console.log('🎵 Seeded audio content');

    // Seed Reading Content
    const readingContents = [
      {
        title: 'Daily Motivation Quote',
        content: 'The only way to do great work is to love what you do. - Steve Jobs',
        category: 'quotes',
        author: 'Steve Jobs',
        tags: ['motivation', 'work', 'success'],
        uploadedBy: adminUser._id
      },
      {
        title: '5 Ways to Reduce Stress',
        content: `Stress is a common part of life, but it doesn't have to control you. Here are five effective ways to manage and reduce stress:

1. **Practice Deep Breathing**: Take slow, deep breaths to activate your body's relaxation response. Try the 4-7-8 technique: inhale for 4 counts, hold for 7, exhale for 8.

2. **Exercise Regularly**: Physical activity releases endorphins, which are natural mood elevators. Even a 10-minute walk can make a difference.

3. **Practice Mindfulness**: Stay present in the moment. Meditation, even for just 5 minutes a day, can significantly reduce stress levels.

4. **Get Quality Sleep**: Aim for 7-9 hours of sleep per night. Good sleep helps your body and mind recover from daily stressors.

5. **Connect with Others**: Talk to friends, family, or a counselor. Social support is crucial for mental well-being.

Remember, managing stress is a skill that improves with practice. Be patient with yourself as you develop these habits.`,
        category: 'articles',
        author: 'CalmNest Team',
        tags: ['stress-management', 'wellness', 'mental-health'],
        uploadedBy: adminUser._id
      },
      {
        title: 'The Power of Positive Thinking',
        content: 'Keep your face always toward the sunshine—and shadows will fall behind you. - Walt Whitman',
        category: 'quotes',
        author: 'Walt Whitman',
        tags: ['positivity', 'optimism', 'inspiration'],
        uploadedBy: adminUser._id
      },
      {
        title: 'Self-Love Affirmations',
        content: `Repeat these affirmations daily to cultivate self-love and acceptance:

• I am worthy of love and respect
• I accept myself completely as I am
• I am enough, just as I am
• I treat myself with kindness and compassion
• I forgive myself for past mistakes
• I am grateful for my unique qualities
• I choose to focus on my strengths
• I deserve happiness and peace
• I am on a journey of growth and learning
• I love and appreciate myself unconditionally`,
        category: 'affirmations',
        author: 'CalmNest Team',
        tags: ['self-love', 'affirmations', 'confidence'],
        uploadedBy: adminUser._id
      },
      {
        title: 'The Peaceful Garden',
        content: `In a quiet corner of the world, there lived an old gardener named Maya. Every morning, she would tend to her garden with gentle hands and a peaceful heart.

Maya believed that gardens, like minds, needed constant care and attention. She would remove the weeds of worry, water the seeds of hope, and let the sunshine of gratitude warm every corner.

Visitors from the village would often come to Maya's garden, feeling stressed and overwhelmed. But as they walked through the peaceful paths, listening to the gentle rustle of leaves and the soft chirping of birds, they would feel their troubles melt away.

"How do you keep your garden so peaceful?" they would ask.

Maya would smile and reply, "The secret is not in fighting the storms, but in learning to dance in the rain. Every challenge is just another opportunity for growth."

And so, people learned that like Maya's garden, their minds too could become sanctuaries of peace, no matter what storms might come.`,
        category: 'stories',
        author: 'CalmNest Team',
        tags: ['peace', 'mindfulness', 'inspiration', 'story'],
        uploadedBy: adminUser._id
      }
    ];

    for (const readingData of readingContents) {
      const reading = new ReadingContent(readingData);
      await reading.save();
    }

    console.log('📚 Seeded reading content');

    // Seed Yoga Content
    const yogaContents = [
      {
        title: 'Morning Sun Salutation',
        description: 'Start your day with this energizing sequence of yoga poses',
        videoUrl: '/sample-videos/sun-salutation.mp4',
        imageUrl: '/sample-images/sun-salutation.jpg',
        instructions: [
          'Start in Mountain Pose (Tadasana)',
          'Inhale and sweep arms overhead',
          'Exhale and fold forward into Uttanasana',
          'Inhale and lift halfway up',
          'Exhale and step back into Plank',
          'Lower down to Chaturanga',
          'Inhale into Upward Facing Dog',
          'Exhale into Downward Facing Dog',
          'Hold for 5 breaths',
          'Step forward and repeat'
        ],
        duration: 15,
        difficulty: 'beginner',
        category: 'full-routine',
        benefits: [
          'Increases energy and focus',
          'Improves flexibility',
          'Strengthens core muscles',
          'Enhances circulation',
          'Reduces stress and anxiety'
        ],
        uploadedBy: adminUser._id
      },
      {
        title: 'Deep Breathing Exercise',
        description: 'Simple breathing technique to calm your mind and reduce stress',
        imageUrl: '/sample-images/breathing-exercise.jpg',
        instructions: [
          'Sit comfortably with your back straight',
          'Place one hand on your chest, one on your belly',
          'Breathe in slowly through your nose for 4 counts',
          'Hold your breath for 4 counts',
          'Exhale slowly through your mouth for 6 counts',
          'Repeat for 10-15 cycles',
          'Focus on the hand on your belly rising and falling'
        ],
        duration: 10,
        difficulty: 'beginner',
        category: 'breathing',
        benefits: [
          'Reduces stress and anxiety',
          'Lowers blood pressure',
          'Improves focus and concentration',
          'Promotes better sleep',
          'Activates the relaxation response'
        ],
        uploadedBy: adminUser._id
      },
      {
        title: 'Gentle Neck and Shoulder Stretches',
        description: 'Release tension from your neck and shoulders with these gentle stretches',
        imageUrl: '/sample-images/neck-stretches.jpg',
        instructions: [
          'Sit tall with shoulders relaxed',
          'Slowly tilt your head to the right, hold for 15 seconds',
          'Return to center and tilt to the left',
          'Bring your chin to your chest, hold',
          'Gently look up toward the ceiling',
          'Roll your shoulders backward 5 times',
          'Roll your shoulders forward 5 times',
          'Breathe deeply throughout'
        ],
        duration: 8,
        difficulty: 'beginner',
        category: 'stretching',
        benefits: [
          'Relieves neck and shoulder tension',
          'Improves posture',
          'Reduces headaches',
          'Increases range of motion',
          'Perfect for desk workers'
        ],
        uploadedBy: adminUser._id
      },
      {
        title: 'Evening Relaxation Sequence',
        description: 'Wind down with this calming yoga sequence perfect for bedtime',
        videoUrl: '/sample-videos/evening-yoga.mp4',
        imageUrl: '/sample-images/evening-yoga.jpg',
        instructions: [
          'Begin in Child\'s Pose, breathe deeply',
          'Move into gentle Cat-Cow stretches',
          'Transition to Seated Forward Fold',
          'Lie down for Happy Baby Pose',
          'Bring knees to chest and rock gently',
          'Extend legs up the wall or in the air',
          'End in Savasana for 5-10 minutes',
          'Focus on releasing the day\'s tension'
        ],
        duration: 20,
        difficulty: 'beginner',
        category: 'full-routine',
        benefits: [
          'Promotes better sleep',
          'Reduces anxiety and stress',
          'Releases physical tension',
          'Calms the nervous system',
          'Prepares body for rest'
        ],
        uploadedBy: adminUser._id
      },
      {
        title: 'Mindful Meditation Sitting',
        description: 'Learn proper posture and technique for mindfulness meditation',
        imageUrl: '/sample-images/meditation-pose.jpg',
        instructions: [
          'Choose a quiet, comfortable space',
          'Sit cross-legged or in a chair with feet flat',
          'Keep your spine straight but not rigid',
          'Rest your hands on your knees or lap',
          'Close your eyes or soften your gaze',
          'Begin to notice your natural breath',
          'When thoughts arise, gently return to breath',
          'Start with 5 minutes, gradually increase'
        ],
        duration: 25,
        difficulty: 'intermediate',
        category: 'meditation',
        benefits: [
          'Reduces stress and anxiety',
          'Improves focus and concentration',
          'Enhances emotional regulation',
          'Increases self-awareness',
          'Promotes inner peace'
        ],
        uploadedBy: adminUser._id
      }
    ];

    for (const yogaData of yogaContents) {
      const yoga = new YogaContent(yogaData);
      await yoga.save();
    }

    console.log('🧘 Seeded yoga content');

    console.log('✅ Database seeding completed successfully!');
    console.log(`
📊 Summary:
- Admin user created (admin@calmnest.com / admin123)
- ${users.length} sample users created
- ${audioContents.length} audio content items added
- ${readingContents.length} reading content items added
- ${yogaContents.length} yoga content items added
    `);

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();