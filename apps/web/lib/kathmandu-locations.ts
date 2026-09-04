/**
 * Kathmandu Valley Geographic Hubs & Landmark Dictionary
 * Enables instantaneous local autocompletion with coordinates for distance routing.
 */

export type NepalRegion =
  | 'All Nepal'
  | 'Kathmandu Valley'
  | 'Pokhara'
  | 'Chitwan'
  | 'Eastern Nepal'
  | 'Lumbini & West';

export interface KathmanduLocation {
  id: string;
  name: string;
  landmark: string;
  zone: string;
  city: string;
  region?: NepalRegion;
  lat: number;
  lng: number;
}

export type NepalLocation = KathmanduLocation;

export const KATHMANDU_HUBS: KathmanduLocation[] = [
  {
    id: 'ktm-jhamsikhel',
    name: 'Jhamsikhel',
    landmark: 'Restaurant Lane, Near Fireclub, Ward 3',
    zone: 'Jhamsikhel',
    city: 'Lalitpur',
    region: 'Kathmandu Valley',
    lat: 27.6784,
    lng: 85.3168,
  },
  {
    id: 'ktm-lazimpat',
    name: 'Lazimpat',
    landmark: 'Lazimpat Heights, Near British Embassy / Radisson Hotel',
    zone: 'Lazimpat',
    city: 'Kathmandu',
    lat: 27.7198,
    lng: 85.3214,
  },
  {
    id: 'ktm-baluwatar',
    name: 'Baluwatar',
    landmark: 'Speaker Marg, Near Prime Minister Residence, Ward 4',
    zone: 'Baluwatar',
    city: 'Kathmandu',
    lat: 27.7289,
    lng: 85.3312,
  },
  {
    id: 'ktm-thamel',
    name: 'Thamel',
    landmark: 'Mandala Street / Tridevi Marg Gate, Ward 26',
    zone: 'Thamel',
    city: 'Kathmandu',
    lat: 27.7154,
    lng: 85.3123,
  },
  {
    id: 'ktm-patan-durbar',
    name: 'Patan Durbar Square',
    landmark: 'Mangalbazar, Krishna Mandir Alleyway',
    zone: 'Patan Durbar',
    city: 'Lalitpur',
    lat: 27.6738,
    lng: 85.3252,
  },
  {
    id: 'ktm-sanepa',
    name: 'Sanepa',
    landmark: 'Sanepa Chowk, Near Star Hospital & International Club',
    zone: 'Sanepa',
    city: 'Lalitpur',
    lat: 27.6834,
    lng: 85.3082,
  },
  {
    id: 'ktm-kupondole',
    name: 'Kupondole',
    landmark: 'Kupondole Height, Kandevta Marg, Near Himalayan Bank',
    zone: 'Kupondole',
    city: 'Lalitpur',
    lat: 27.6892,
    lng: 85.3184,
  },
  {
    id: 'ktm-new-baneshwor',
    name: 'New Baneshwor',
    landmark: 'Parliament Road, Near Eyeplex Mall & Everest Hotel',
    zone: 'Baneshwor',
    city: 'Kathmandu',
    lat: 27.6915,
    lng: 85.3421,
  },
  {
    id: 'ktm-old-baneshwor',
    name: 'Old Baneshwor',
    landmark: 'Bhattachan Marg, Near Apex College',
    zone: 'Baneshwor',
    city: 'Kathmandu',
    lat: 27.7012,
    lng: 85.3435,
  },
  {
    id: 'ktm-koteshwor',
    name: 'Koteshwor',
    landmark: 'Koteshwor Chowk, Near Bhatbhateni Superstore',
    zone: 'Koteshwor',
    city: 'Kathmandu',
    lat: 27.6756,
    lng: 85.3489,
  },
  {
    id: 'ktm-maharajgunj',
    name: 'Maharajgunj',
    landmark: 'Chakrapath Chowk, Near TUTH Teaching Hospital',
    zone: 'Maharajgunj',
    city: 'Kathmandu',
    lat: 27.7371,
    lng: 85.3341,
  },
  {
    id: 'ktm-durbarmarg',
    name: 'Durbarmarg',
    landmark: 'Kings Way, In Front of Narayanhiti Palace Museum',
    zone: 'Durbarmarg',
    city: 'Kathmandu',
    lat: 27.7102,
    lng: 85.3175,
  },
  {
    id: 'ktm-naxal',
    name: 'Naxal',
    landmark: 'Bhagwati Bahal, Near Kathmandu Marriott Hotel & Bhatbhateni',
    zone: 'Naxal',
    city: 'Kathmandu',
    lat: 27.7146,
    lng: 85.3289,
  },
  {
    id: 'ktm-boudha',
    name: 'Boudha',
    landmark: 'Boudha Gate, Main Stupa Circle / Hyatt Regency Road',
    zone: 'Boudha',
    city: 'Kathmandu',
    lat: 27.7215,
    lng: 85.3620,
  },
  {
    id: 'ktm-pulchowk',
    name: 'Pulchowk',
    landmark: 'Pulchowk Road, Beside Labim Mall & IOE Campus',
    zone: 'Pulchowk',
    city: 'Lalitpur',
    lat: 27.6775,
    lng: 85.3164,
  },
  {
    id: 'ktm-jawalakhel',
    name: 'Jawalakhel',
    landmark: 'Jawalakhel Roundabout, Near Central Zoo Gate',
    zone: 'Jawalakhel',
    city: 'Lalitpur',
    lat: 27.6698,
    lng: 85.3125,
  },
  {
    id: 'ktm-maitighar',
    name: 'Maitighar',
    landmark: 'Maitighar Mandala, Near St. Xavier\'s College',
    zone: 'Maitighar',
    city: 'Kathmandu',
    lat: 27.6945,
    lng: 85.3212,
  },
  {
    id: 'ktm-kalanki',
    name: 'Kalanki',
    landmark: 'Kalanki Underpass, Near Makalu Petrol Pump',
    zone: 'Kalanki',
    city: 'Kathmandu',
    lat: 27.6934,
    lng: 85.2812,
  },
  {
    id: 'ktm-bhaktapur-durbar',
    name: 'Bhaktapur Durbar Square',
    landmark: '55-Window Palace Gate, Taumadhi Square',
    zone: 'Bhaktapur Durbar',
    city: 'Bhaktapur',
    lat: 27.6722,
    lng: 85.4281,
  },
  {
    id: 'ktm-sallaghari',
    name: 'Sallaghari',
    landmark: 'Sallaghari Chowk, Arniko Highway Junction',
    zone: 'Sallaghari',
    city: 'Bhaktapur',
    lat: 27.6745,
    lng: 85.4052,
  },

  // ─── POKHARA / GANDAKI ──────────────────────────────────────────────────────
  {
    id: 'pkr-lakeside',
    name: 'Lakeside Center',
    landmark: 'Baidam, Center Point / Phewa Lake Promenade',
    zone: 'Lakeside',
    city: 'Pokhara',
    region: 'Pokhara',
    lat: 28.2096,
    lng: 83.9595,
  },
  {
    id: 'pkr-chipledhunga',
    name: 'Chipledhunga / New Road',
    landmark: 'Pokhara Trade Mall, BP Chowk',
    zone: 'New Road',
    city: 'Pokhara',
    region: 'Pokhara',
    lat: 28.2173,
    lng: 83.9861,
  },
  {
    id: 'pkr-mahendrapool',
    name: 'Mahendrapool',
    landmark: 'Bhimsen Tol, Seti River Bridge Junction',
    zone: 'Mahendrapool',
    city: 'Pokhara',
    region: 'Pokhara',
    lat: 28.2255,
    lng: 83.9870,
  },
  {
    id: 'pkr-damside',
    name: 'Damside / Birauta',
    landmark: 'Rabi Bhavan, Near Pokhara Old Airport South',
    zone: 'Damside',
    city: 'Pokhara',
    region: 'Pokhara',
    lat: 28.1965,
    lng: 83.9678,
  },
  {
    id: 'pkr-prithvi-chowk',
    name: 'Prithvi Chowk',
    landmark: 'Central Bus Terminal Road, Western Hospital Chowk',
    zone: 'Prithvi Chowk',
    city: 'Pokhara',
    region: 'Pokhara',
    lat: 28.2045,
    lng: 83.9892,
  },

  // ─── CHITWAN / NARAYANI ─────────────────────────────────────────────────────
  {
    id: 'chit-chaubiskothi',
    name: 'Bharatpur Chaubiskothi',
    landmark: 'Chaubiskothi Chowk, Cancer Hospital Road, Ward 10',
    zone: 'Chaubiskothi',
    city: 'Bharatpur',
    region: 'Chitwan',
    lat: 27.6833,
    lng: 84.4333,
  },
  {
    id: 'chit-narayangarh',
    name: 'Narayangarh Pulchowk',
    landmark: 'Lions Chowk / Narayani River Bridge Access',
    zone: 'Narayangarh',
    city: 'Bharatpur',
    region: 'Chitwan',
    lat: 27.7011,
    lng: 84.4255,
  },
  {
    id: 'chit-sauraha',
    name: 'Sauraha Tourism Hub',
    landmark: 'Elephant Chowk, Chitwan National Park Entrance',
    zone: 'Sauraha',
    city: 'Sauraha',
    region: 'Chitwan',
    lat: 27.5815,
    lng: 84.4984,
  },

  // ─── EASTERN NEPAL (KOSHI PROVINCE) ─────────────────────────────────────────
  {
    id: 'east-biratnagar',
    name: 'Biratnagar Traffic Chowk',
    landmark: 'Main Road, Golchha Marg, Near City Center Mall',
    zone: 'Traffic Chowk',
    city: 'Biratnagar',
    region: 'Eastern Nepal',
    lat: 26.4525,
    lng: 87.2718,
  },
  {
    id: 'east-dharan',
    name: 'Dharan Bhanuchowk',
    landmark: 'Bhanu Clock Tower, Main Market Square',
    zone: 'Bhanuchowk',
    city: 'Dharan',
    region: 'Eastern Nepal',
    lat: 26.8124,
    lng: 87.2835,
  },
  {
    id: 'east-dharan-bpkihs',
    name: 'Dharan BPKIHS',
    landmark: 'Medical University Gate, Ghopa Camp Sector',
    zone: 'BPKIHS',
    city: 'Dharan',
    region: 'Eastern Nepal',
    lat: 26.8285,
    lng: 87.2912,
  },
  {
    id: 'east-itahari',
    name: 'Itahari Main Chowk',
    landmark: 'East-West Highway & Dharan Highway Crossroad',
    zone: 'Main Chowk',
    city: 'Itahari',
    region: 'Eastern Nepal',
    lat: 26.6664,
    lng: 87.2798,
  },
  {
    id: 'east-birtamod',
    name: 'Birtamod Mukti Chowk',
    landmark: 'Mukti Chowk, Mechi Highway Junction, Jhapa',
    zone: 'Mukti Chowk',
    city: 'Birtamod',
    region: 'Eastern Nepal',
    lat: 26.6394,
    lng: 87.9898,
  },

  // ─── LUMBINI & WESTERN NEPAL ────────────────────────────────────────────────
  {
    id: 'west-butwal',
    name: 'Butwal Traffic Chowk',
    landmark: 'Golpark, Mahendra Highway, Near Tinau Bridge',
    zone: 'Traffic Chowk',
    city: 'Butwal',
    region: 'Lumbini & West',
    lat: 27.7006,
    lng: 83.4484,
  },
  {
    id: 'west-bhairahawa',
    name: 'Bhairahawa Buddha Chowk',
    landmark: 'Buddha Chowk, Gautam Buddha International Airport Road',
    zone: 'Buddha Chowk',
    city: 'Bhairahawa',
    region: 'Lumbini & West',
    lat: 27.5045,
    lng: 83.4502,
  },
  {
    id: 'west-nepalgunj',
    name: 'Nepalgunj Tribhuvan Chowk',
    landmark: 'Tribhuvan Chowk, Sadar Line, Near Bheri Hospital',
    zone: 'Tribhuvan Chowk',
    city: 'Nepalgunj',
    region: 'Lumbini & West',
    lat: 28.0500,
    lng: 81.6167,
  },
  {
    id: 'west-hetauda',
    name: 'Hetauda Seemachowk',
    landmark: 'Seemachowk, Kantirajpath, Makwanpur',
    zone: 'Seemachowk',
    city: 'Hetauda',
    region: 'Lumbini & West',
    lat: 27.4286,
    lng: 85.0322,
  },
  {
    id: 'west-dhangadhi',
    name: 'Dhangadhi Chauraha',
    landmark: 'Traffic Chauraha, Main Road, Sudurpashchim',
    zone: 'Chauraha',
    city: 'Dhangadhi',
    region: 'Lumbini & West',
    lat: 28.6944,
    lng: 80.5900,
  },
];

export const NEPAL_HUBS = KATHMANDU_HUBS;

export function searchKathmanduLocations(query: string, region?: NepalRegion): KathmanduLocation[] {
  const q = query.trim().toLowerCase();
  return KATHMANDU_HUBS.filter((hub) => {
    const hubRegion = hub.region || 'Kathmandu Valley';
    if (region && region !== 'All Nepal' && hubRegion !== region) {
      return false;
    }
    if (!q) return true;
    return (
      hub.name.toLowerCase().includes(q) ||
      hub.landmark.toLowerCase().includes(q) ||
      hub.zone.toLowerCase().includes(q) ||
      hub.city.toLowerCase().includes(q) ||
      hubRegion.toLowerCase().includes(q)
    );
  });
}

export const searchNepalLocations = searchKathmanduLocations;

