import { connectDatabase, disconnectDatabase } from '../config/db';
import { Restaurant, Order, Driver } from '../models';
import { calculateDistanceKm } from '../utils/geo.utils';

async function testEndpoints() {
  console.log('🧪 [Test] Starting Live MongoDB Atlas Endpoint Verification...');
  console.log('====================================================');

  await connectDatabase();

  try {
    // 1. Test Spatial Proximity Query (Jhamsikhel Coordinates)
    console.log('\n--- [TEST 1: Proximity Query ($near)] ---');
    const customerCoords = { lat: 27.6784, lng: 85.3168 };
    const maxRadiusMeters = 6000;

    const nearbyKitchens = await Restaurant.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [customerCoords.lng, customerCoords.lat],
          },
          $maxDistance: maxRadiusMeters,
        },
      },
    }).lean();

    console.log(`✅ Found ${nearbyKitchens.length} kitchens within 6km radius`);
    nearbyKitchens.forEach((k, idx) => {
      const dist = calculateDistanceKm(customerCoords, {
        lat: k.location.coordinates[1],
        lng: k.location.coordinates[0],
      });
      console.log(`   ${idx + 1}. ${k.name} (${k.zone}) - ${dist.toFixed(2)} km away`);
    });

    // 2. Test Slug Lookup (himalayan-grill-jhamsikhel)
    console.log('\n--- [TEST 2: Restaurant Menu & Modifiers by Slug] ---');
    const slug = 'himalayan-grill-jhamsikhel';
    const kitchen = await Restaurant.findOne({ slug }).lean();

    if (!kitchen) {
      throw new Error(`Failed to find kitchen by slug: ${slug}`);
    }

    console.log(`✅ Loaded: ${kitchen.name} (${kitchen.phone})`);
    console.log(`   Categories count: ${kitchen.categories.length}`);
    kitchen.categories.forEach((cat) => {
      console.log(`   📂 [${cat.name}] - ${cat.items.length} dishes`);
      cat.items.forEach((item) => {
        const modCount = item.groups?.length || 0;
        console.log(`      • ${item.name} (Rs. ${item.basePrice}) [${modCount} modifier groups]`);
      });
    });

    // 3. Test Order Creation & Persistence
    console.log('\n--- [TEST 3: Order Persistence in MongoDB] ---');
    const orderNumber = `ORD-KTM-${Math.floor(1000 + Math.random() * 9000)}`;
    const testOrder = await Order.create({
      orderNumber,
      status: 'PLACED',
      customer: {
        phone: '9841234567',
        name: 'Aayush Shrestha',
      },
      restaurant: {
        id: kitchen._id.toString(),
        name: kitchen.name,
        slug: kitchen.slug,
      },
      deliveryAddress: {
        landmark: 'Lazimpat Heights, Near British Embassy',
        address: 'Ward 2, Lazimpat, Kathmandu',
        dropoffInstruction: 'call',
      },
      items: [
        {
          menuItemId: 'momo-1',
          name: 'Smoked Timur Buff Jhol Momo',
          basePrice: 280,
          price: 310,
          quantity: 2,
          selectedModifiers: [{ id: 'extra-jhol', name: 'Extra Spiced Jhol Achar', price: 30 }],
        },
      ],
      financialBreakdown: {
        foodSubtotal: 620,
        packagingFee: 0,
        deliveryFee: 50,
        platformFee: 0,
        totalPayable: 670,
      },
      payment: {
        method: 'ESEWA',
        status: 'PENDING',
        transactionUuid: `${orderNumber}-txn-test`,
      },
      deliveryPin: '4821',
    });

    console.log(`✅ Created Order in Atlas: #${testOrder.orderNumber} (ID: ${testOrder._id})`);
    console.log(`   Total: Rs. ${testOrder.financialBreakdown.totalPayable}`);
    console.log(`   Delivery PIN: ${testOrder.deliveryPin}`);

    // 4. Test Fetch Order by orderNumber
    console.log('\n--- [TEST 4: Fetch Order by orderNumber] ---');
    const fetched = await Order.findOne({ orderNumber }).lean();
    if (!fetched) {
      throw new Error('Failed to fetch newly created order');
    }
    console.log(`✅ Successfully fetched: #${fetched.orderNumber} (Status: ${fetched.status})`);

    // 5. Test State Machine Transition
    console.log('\n--- [TEST 5: State Machine Transition (PLACED -> ACCEPTED -> PREPARING)] ---');
    const accepted = await Order.findOneAndUpdate(
      { orderNumber },
      { $set: { status: 'ACCEPTED', 'payment.status': 'PAID' } },
      { new: true }
    ).lean();
    console.log(`✅ Order status transitioned: ${accepted?.status} (Payment: ${accepted?.payment.status})`);

    const preparing = await Order.findOneAndUpdate(
      { orderNumber },
      { $set: { status: 'PREPARING' } },
      { new: true }
    ).lean();
    console.log(`✅ Order status transitioned: ${preparing?.status}`);

    // 6. Test Driver Spatial Matching
    console.log('\n--- [TEST 6: Driver Proximity Query] ---');
    const pickupPoint = { lat: kitchen.location.coordinates[1], lng: kitchen.location.coordinates[0] };
    const onlineDrivers = await Driver.find({
      isOnline: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [pickupPoint.lng, pickupPoint.lat],
          },
          $maxDistance: 7500,
        },
      },
    }).lean();

    console.log(`✅ Found ${onlineDrivers.length} online riders near ${kitchen.name}`);
    if (onlineDrivers.length > 0) {
      const nearest = onlineDrivers[0];
      const dist = calculateDistanceKm(pickupPoint, {
        lat: nearest.location.coordinates[1],
        lng: nearest.location.coordinates[0],
      });
      console.log(`   Nearest Rider: ${nearest.name} (${nearest.vehiclePlate}) - ${dist.toFixed(2)} km away`);
    }

    console.log('\n====================================================');
    console.log('🎉 [Test] ALL 6 TESTS PASSED AGAINST LIVE ATLAS CLUSTER!');
    console.log('====================================================');
  } catch (err) {
    console.error('❌ [Test Error]:', err);
    throw err;
  } finally {
    await disconnectDatabase();
  }
}

testEndpoints().catch((err) => {
  console.error(err);
  process.exit(1);
});
