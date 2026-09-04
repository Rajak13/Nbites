import { connectDatabase, disconnectDatabase } from '../config/db';
import { Restaurant, Driver, User } from '../models';
import { hashPassword } from '../utils/password.util';

async function seed() {
  console.log('🌱 [Seed] Starting Kathmandu Valley database seeding...');

  await connectDatabase();

  try {
    // 1. Clear existing restaurants and drivers
    await Restaurant.deleteMany({});
    await Driver.deleteMany({});
    console.log('🧹 [Seed] Cleared existing restaurants and drivers');

    // 2. Insert 3 authentic partner kitchens
    const kitchens = [
      {
        name: 'Kathmandu Himalayan Grill',
        slug: 'himalayan-grill-jhamsikhel',
        tagline: 'Wood-fired sekuwa, Himalayan timur marinades & artisan momo crafts.',
        description:
          'Specialty smokehouse and momo guild operating in the heart of Jhamsikhel with synchronized kitchen telemetry.',
        coverImage: '/foods/1.jpg',
        address: 'Restaurant Lane, Ward 3, Jhamsikhel',
        zone: 'Jhamsikhel',
        city: 'Lalitpur',
        phone: '+977 1 5521000',
        isOpen: true,
        isBusy: false,
        rating: 4.9,
        reviewCount: 482,
        estimatedPrepTimeMins: 18,
        deliveryFeeBase: 50,
        location: {
          type: 'Point',
          coordinates: [85.3168, 27.6784], // [lng, lat] Jhamsikhel
        },
        categories: [
          {
            id: 'momos',
            name: 'ARTISAN MOMOS',
            sortOrder: 1,
            items: [
              {
                id: 'momo-1',
                name: 'Smoked Timur Buff Jhol Momo',
                description:
                  'Hand-pinched water buffalo dumplings submerged in roasted sesame, soybean, and wild timur pepper broth.',
                basePrice: 280,
                image: '/foods/main.jpg',
                isVeg: false,
                isSpicy: true,
                prepTime: '14 mins',
                isAvailable: true,
                groups: [
                  {
                    id: 'prep-style',
                    title: 'Preparation Style',
                    type: 'single',
                    required: true,
                    options: [
                      { id: 'steamed', name: 'Steamed in Bamboo', price: 0 },
                      { id: 'fried', name: 'Deep Golden Fried', price: 30 },
                      { id: 'kothey', name: 'Pan-Seared Kothey', price: 40 },
                      { id: 'c-momo', name: 'Wok Chilli (C-Momo)', price: 60 },
                    ],
                  },
                  {
                    id: 'addons',
                    title: 'Artisan Dips & Add-ons',
                    type: 'multi',
                    required: false,
                    options: [
                      { id: 'extra-jhol', name: 'Extra Spiced Jhol Achar', price: 30 },
                      { id: 'dalle-paste', name: 'Mountain Dalle Paste', price: 25 },
                      { id: 'melted-cheese', name: 'Smoked Yak Cheese Melt', price: 65 },
                    ],
                  },
                ],
              },
              {
                id: 'momo-2',
                name: 'Kothey Chicken Dumplings',
                description:
                  'Crispy pan-bottom chicken dumplings with scallions, minced ginger, and mild coriander butter.',
                basePrice: 260,
                image: '/foods/4.jpg',
                isVeg: false,
                prepTime: '12 mins',
                isAvailable: true,
                groups: [
                  {
                    id: 'prep-style',
                    title: 'Preparation Style',
                    type: 'single',
                    required: true,
                    options: [
                      { id: 'kothey', name: 'Pan-Seared Kothey', price: 0 },
                      { id: 'steamed', name: 'Steamed Classic', price: 0 },
                      { id: 'c-momo', name: 'Spicy Chilli Glaze', price: 50 },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'sekuwa',
            name: 'FIRE-ROASTED SEKUWA',
            sortOrder: 2,
            items: [
              {
                id: 'sekuwa-1',
                name: 'Smoked Timur Pork Sekuwa',
                description:
                  'Charcoal-roasted pork belly marinated for 18 hours in mustard oil, mountain timur, and crushed green chillies.',
                basePrice: 520,
                image: '/foods/2.jpg',
                isVeg: false,
                isSpicy: true,
                prepTime: '18 mins',
                isAvailable: true,
                groups: [
                  {
                    id: 'sides',
                    title: 'Select Accompaniment',
                    type: 'single',
                    required: true,
                    options: [
                      { id: 'chiura', name: 'Crispy Baji (Chiura) & Achar', price: 0 },
                      { id: 'pulao', name: 'Basmati Spiced Pulao', price: 60 },
                      { id: 'furandana', name: 'Spiced Furandana Crunch', price: 20 },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'bowls',
            name: 'FIRED NOODLE BOWLS',
            sortOrder: 3,
            items: [
              {
                id: 'bowl-1',
                name: 'Kathmandu Highland Chili Thukpa',
                description:
                  'Hand-pulled wheat noodles in slow-simmered bone broth with charred greens, garlic oil, and chili crunch.',
                basePrice: 380,
                image: '/foods/3.jpg',
                isVeg: false,
                isSpicy: true,
                prepTime: '15 mins',
                isAvailable: true,
                groups: [
                  {
                    id: 'spice-level',
                    title: 'Heat Level',
                    type: 'single',
                    required: true,
                    options: [
                      { id: 'medium', name: 'Valley Mild (Normal)', price: 0 },
                      { id: 'hot', name: 'Spicy Timur Fire', price: 0 },
                      { id: 'dalle-extreme', name: 'Mountain Dalle Extreme', price: 30 },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'Old Town Newari Kitchen',
        slug: 'old-town-newari-kitchen',
        tagline: 'Centuries-old heritage Newari recipes from the historic alleys of Patan.',
        description: 'Authentic Samay Baji, smoked Choila, and traditional stone-ground Newari delicacies.',
        coverImage: '/foods/main.jpg',
        address: 'Mangalbazar Durbar Square, Patan',
        zone: 'Patan Durbar',
        city: 'Lalitpur',
        phone: '+977 1 5532000',
        isOpen: true,
        isBusy: false,
        rating: 4.8,
        reviewCount: 340,
        estimatedPrepTimeMins: 20,
        deliveryFeeBase: 50,
        location: {
          type: 'Point',
          coordinates: [85.326, 27.6727], // [lng, lat] Patan Durbar
        },
        categories: [
          {
            id: 'newari-sets',
            name: 'HERITAGE SAMAY BAJI',
            sortOrder: 1,
            items: [
              {
                id: 'samay-1',
                name: 'Royal Buff Choila Samay Baji Set',
                description:
                  'Charcoal-smoked water buffalo meat seasoned with mustard oil and fenugreek, served with beaten rice, black soybean, ginger, and spicy potato salad.',
                basePrice: 420,
                image: '/foods/main.jpg',
                isVeg: false,
                isSpicy: true,
                prepTime: '15 mins',
                isAvailable: true,
                groups: [],
              },
            ],
          },
        ],
      },
      {
        name: 'Artisan Wood Fired Co.',
        slug: 'artisan-wood-fired-baluwatar',
        tagline: 'Slow-fermented 72-hour sourdough pizzas baked at 450°C.',
        description: 'Artisan wood-fired bakery and sourdough pizza house in Baluwatar.',
        coverImage: '/foods/3.jpg',
        address: 'Speaker Marg, Baluwatar',
        zone: 'Baluwatar',
        city: 'Kathmandu',
        phone: '+977 1 4415000',
        isOpen: true,
        isBusy: false,
        rating: 4.9,
        reviewCount: 512,
        estimatedPrepTimeMins: 22,
        deliveryFeeBase: 50,
        location: {
          type: 'Point',
          coordinates: [85.3312, 27.7258], // [lng, lat] Baluwatar
        },
        categories: [
          {
            id: 'sourdough-pizza',
            name: 'SOURDOUGH PIZZA (12")',
            sortOrder: 1,
            items: [
              {
                id: 'pizza-1',
                name: 'Artisan Pepperoni & Wild Timur Sourdough',
                description:
                  'San Marzano tomato base, smoked mozzarella, spicy beef pepperoni, drizzled with local honey and crushed timur.',
                basePrice: 750,
                image: '/foods/3.jpg',
                isVeg: false,
                isSpicy: false,
                prepTime: '18 mins',
                isAvailable: true,
                groups: [],
              },
            ],
          },
        ],
      },
      {
        name: 'Dharan Bhanuchowk Sekuwa Corner',
        slug: 'dharan-bhanuchowk-sekuwa',
        tagline: 'Legendary charcoal-smoked pork sekuwa, sukuti fry & Eastern mountain herbs.',
        description:
          'Iconic Dharan smokehouse crafting heritage timber-smoked sekuwa right by Bhanuchowk.',
        coverImage: '/foods/2.jpg',
        address: 'Bhanuchowk Commercial Sector, Ward 1',
        zone: 'Bhanuchowk',
        city: 'Dharan',
        phone: '+977 25 520111',
        isOpen: true,
        isBusy: false,
        rating: 4.9,
        reviewCount: 620,
        estimatedPrepTimeMins: 16,
        deliveryFeeBase: 40,
        location: {
          type: 'Point',
          coordinates: [87.2835, 26.8124], // [lng, lat] Dharan
        },
        categories: [
          {
            id: 'dharan-sekuwa',
            name: 'CHARCOAL SEKUWA',
            sortOrder: 1,
            items: [
              {
                id: 'dh-sek-1',
                name: 'Dharan Special Smoked Pork Sekuwa',
                description:
                  'Traditional charcoal-smoked pork marinated in mustard oil, mountain timur, garlic paste, and roasted cumin. Served with chiura and fiery dalle achar.',
                basePrice: 480,
                image: '/foods/2.jpg',
                isVeg: false,
                isSpicy: true,
                prepTime: '15 mins',
                isAvailable: true,
                groups: [],
              },
              {
                id: 'dh-suk-1',
                name: 'Crispy Buff Sukuti Sadeko',
                description:
                  'Sun-dried and wood-smoked buffalo strips tossed with raw onions, roasted mustard seeds, chopped green chilies, and fresh lemon juice.',
                basePrice: 380,
                image: '/foods/main.jpg',
                isVeg: false,
                isSpicy: true,
                prepTime: '12 mins',
                isAvailable: true,
                groups: [],
              },
            ],
          },
        ],
      },
      {
        name: 'Dharan BPKIHS Artisan Food Guild',
        slug: 'dharan-bpkihs-food-guild',
        tagline: 'Handcrafted momo crafts, slow-braised thukpa & Eastern street delicacies.',
        description:
          'Beloved campus-side culinary hub serving steamy bamboo momos and spiced noodles to Dharan food lovers.',
        coverImage: '/foods/1.jpg',
        address: 'Hospital Road, BPKIHS Gate 2',
        zone: 'BPKIHS',
        city: 'Dharan',
        phone: '+977 25 524333',
        isOpen: true,
        isBusy: false,
        rating: 4.8,
        reviewCount: 440,
        estimatedPrepTimeMins: 15,
        deliveryFeeBase: 40,
        location: {
          type: 'Point',
          coordinates: [87.2798, 26.808], // [lng, lat] BPKIHS Dharan
        },
        categories: [
          {
            id: 'momo-noodle',
            name: 'MOMOS & BOWLS',
            sortOrder: 1,
            items: [
              {
                id: 'dh-momo-1',
                name: 'Dharan Steamed Buff Jhol Momo',
                description:
                  'Thin-skinned water buffalo dumplings bathed in aromatic roasted sesame, tomato, and timur sauce.',
                basePrice: 240,
                image: '/foods/main.jpg',
                isVeg: false,
                isSpicy: true,
                prepTime: '14 mins',
                isAvailable: true,
                groups: [],
              },
              {
                id: 'dh-thukpa-1',
                name: 'Eastern Spiced Chicken Thukpa',
                description:
                  'Handmade wheat noodles in hearty slow-simmered chicken bone broth with charred greens and chili paste.',
                basePrice: 280,
                image: '/foods/3.jpg',
                isVeg: false,
                isSpicy: true,
                prepTime: '15 mins',
                isAvailable: true,
                groups: [],
              },
            ],
          },
        ],
      },
      {
        name: 'Phewa Lakeside Smokehouse',
        slug: 'phewa-lakeside-smokehouse',
        tagline: 'Fresh mountain trout grill, wild herbs & Himalayan firewood skewers.',
        description:
          'Authentic Lakeside smokehouse using seasoned Himalayan oak to grill freshwater fish and mountain kebabs.',
        coverImage: '/hero/1.jpg',
        address: 'Baidam, Center Point, Lakeside',
        zone: 'Lakeside',
        city: 'Pokhara',
        phone: '+977 61 465000',
        isOpen: true,
        isBusy: false,
        rating: 4.9,
        reviewCount: 390,
        estimatedPrepTimeMins: 20,
        deliveryFeeBase: 50,
        location: {
          type: 'Point',
          coordinates: [83.9595, 28.2096], // [lng, lat] Pokhara
        },
        categories: [
          {
            id: 'phewa-grill',
            name: 'LAKESIDE GRILL',
            sortOrder: 1,
            items: [
              {
                id: 'pkr-trout-1',
                name: 'Himalayan Oak Grilled Phewa Trout',
                description:
                  'Freshwater trout stuffed with local herbs, lemon wedges, and mountain timur, grilled over oak embers.',
                basePrice: 850,
                image: '/hero/1.jpg',
                isVeg: false,
                isSpicy: false,
                prepTime: '20 mins',
                isAvailable: true,
                groups: [],
              },
            ],
          },
        ],
      },
    ];

    const createdKitchens = await Restaurant.insertMany(kitchens);
    console.log(`✅ [Seed] Inserted ${createdKitchens.length} partner kitchens`);

    // 2.1 Seed partner kitchen merchant accounts
    const merchantPassword = hashPassword('nbites2026');
    for (const k of createdKitchens) {
      const emailPrefix = k.slug.replace(/-hub|-guild/g, '').replace(/-/g, '.');
      const merchantEmail = `${emailPrefix}@nbites.com`;
      await User.findOneAndUpdate(
        { email: merchantEmail },
        {
          email: merchantEmail,
          password: merchantPassword,
          name: `${k.name} Head Chef`,
          phone: k.phone.replace(/\s+/g, '').replace('+977', '') || '9800000000',
          role: 'MERCHANT',
          city: k.city,
          restaurantId: k._id.toString(),
          termsAccepted: true,
          termsAcceptedAt: new Date(),
        },
        { upsert: true, new: true }
      );
      console.log(`👨‍🍳 [Seed] Created Merchant Account: ${merchantEmail} (PW: nbites2026) -> ${k.name}`);
    }

    // 3. Insert 1 mock active express driver
    const driver = await Driver.create({
      driverId: 'drv-ktm-1',
      name: 'Bikash Maharjan',
      phone: '+977 9841234567',
      vehiclePlate: 'BA 89 PA 4321',
      vehicleType: 'Motorbike (Hero Splendor)',
      isOnline: true,
      rating: 4.95,
      totalTrips: 1240,
      location: {
        type: 'Point',
        coordinates: [85.3175, 27.679], // Jhamsikhel
      },
    });
    console.log(`✅ [Seed] Inserted mock active express rider: ${driver.name} (${driver.vehiclePlate})`);

    console.log('====================================================');
    console.log('🎉 [Seed] Kathmandu Valley database seeding complete!');
    console.log('====================================================');
  } catch (error) {
    console.error('❌ [Seed] Error seeding database:', error);
    throw error;
  } finally {
    await disconnectDatabase();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
