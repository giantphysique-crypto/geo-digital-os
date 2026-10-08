import { CourierCarrierOption, PincodeInfo, TrackingEvent } from '../types';

/**
 * Pre-configured Origin Hub Warehouses
 */
export const ORIGIN_WAREHOUSES: { id: string; name: string; pincode: string; city: string; state: string }[] = [
  {
    id: 'GURUGRAM_MAIN',
    name: 'Gurugram Central OEM Hub (Plot 44, Udyog Vihar Ph-IV)',
    pincode: '122001',
    city: 'Gurugram',
    state: 'Haryana',
  },
  {
    id: 'BHIWANDI_HUB',
    name: 'Bhiwandi Logistics Hub (Gala 12, Indian Corp Compound)',
    pincode: '421302',
    city: 'Bhiwandi / Thane',
    state: 'Maharashtra',
  },
  {
    id: 'DELHI_OKHLA',
    name: 'Delhi NCR Transit Depot (Okhla Industrial Area Phase-II)',
    pincode: '110020',
    city: 'New Delhi',
    state: 'Delhi',
  },
];

/**
 * Comprehensive Indian Pincode Directory for Govt / Tender destinations
 */
export const PINCODE_DIRECTORY: Record<string, PincodeInfo> = {
  // Uttar Pradesh
  '226001': {
    pincode: '226001',
    city: 'Lucknow',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    zone: 'Zone B (Intra-State / Regional)',
    hubName: 'Lucknow Transport Nagar Depot',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },
  '208001': {
    pincode: '208001',
    city: 'Kanpur',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    zone: 'Zone B (Intra-State / Regional)',
    hubName: 'Kanpur Jajmau Cargo Hub',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },
  '221001': {
    pincode: '221001',
    city: 'Varanasi',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    zone: 'Zone B (Intra-State / Regional)',
    hubName: 'Varanasi Shivpur Hub',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },
  '273001': {
    pincode: '273001',
    city: 'Gorakhpur',
    district: 'Gorakhpur',
    state: 'Uttar Pradesh',
    zone: 'Zone B (Intra-State / Regional)',
    hubName: 'Gorakhpur Industrial Development Area (GIDA)',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },
  '210001': {
    pincode: '210001',
    city: 'Banda',
    district: 'Banda (Bundelkhand)',
    state: 'Uttar Pradesh',
    zone: 'Zone B (Intra-State / Regional)',
    hubName: 'Banda Rural Feeder Hub',
    serviceableSurface: true,
    serviceableExpress: false,
    serviceableHeavyB2B: true,
    isCodAvailable: false,
  },

  // Karnataka
  '560001': {
    pincode: '560001',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    zone: 'Zone C (Metro-to-Metro)',
    hubName: 'Bengaluru Peenya Industrial Hub',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },
  '570001': {
    pincode: '570001',
    city: 'Mysuru',
    district: 'Mysuru',
    state: 'Karnataka',
    zone: 'Zone D (Rest of India)',
    hubName: 'Mysuru Hebbal Hub',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },
  '580020': {
    pincode: '580020',
    city: 'Hubballi',
    district: 'Dharwad',
    state: 'Karnataka',
    zone: 'Zone D (Rest of India)',
    hubName: 'Hubballi Tarihal Industrial Hub',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },

  // Bihar
  '800001': {
    pincode: '800001',
    city: 'Patna',
    district: 'Patna',
    state: 'Bihar',
    zone: 'Zone D (Rest of India)',
    hubName: 'Patna Phulwari Sharif Logistics Park',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },
  '823001': {
    pincode: '823001',
    city: 'Gaya',
    district: 'Gaya',
    state: 'Bihar',
    zone: 'Zone D (Rest of India)',
    hubName: 'Gaya Dobhi Highway Hub',
    serviceableSurface: true,
    serviceableExpress: false,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },
  '842001': {
    pincode: '842001',
    city: 'Muzaffarpur',
    district: 'Muzaffarpur',
    state: 'Bihar',
    zone: 'Zone D (Rest of India)',
    hubName: 'Muzaffarpur Bela Industrial Hub',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },

  // Maharashtra
  '400001': {
    pincode: '400001',
    city: 'Mumbai',
    district: 'Mumbai City',
    state: 'Maharashtra',
    zone: 'Zone C (Metro-to-Metro)',
    hubName: 'Mumbai Wadala / Kalamboli Hub',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },
  '411001': {
    pincode: '411001',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    zone: 'Zone C (Metro-to-Metro)',
    hubName: 'Pune Chakan Logistics Gateway',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },
  '440001': {
    pincode: '440001',
    city: 'Nagpur',
    district: 'Nagpur',
    state: 'Maharashtra',
    zone: 'Zone D (Rest of India)',
    hubName: 'Nagpur MIHAN Logistics Hub',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },

  // Rajasthan
  '302001': {
    pincode: '302001',
    city: 'Jaipur',
    district: 'Jaipur',
    state: 'Rajasthan',
    zone: 'Zone B (Intra-State / Regional)',
    hubName: 'Jaipur VKI Area Hub',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },
  '342001': {
    pincode: '342001',
    city: 'Jodhpur',
    district: 'Jodhpur',
    state: 'Rajasthan',
    zone: 'Zone D (Rest of India)',
    hubName: 'Jodhpur Basni Hub',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },

  // Jharkhand
  '834001': {
    pincode: '834001',
    city: 'Ranchi',
    district: 'Ranchi',
    state: 'Jharkhand',
    zone: 'Zone D (Rest of India)',
    hubName: 'Ranchi Tupudana Industrial Hub',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },

  // Madhya Pradesh
  '462001': {
    pincode: '462001',
    city: 'Bhopal',
    district: 'Bhopal',
    state: 'Madhya Pradesh',
    zone: 'Zone D (Rest of India)',
    hubName: 'Bhopal Mandideep Hub',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },
  '452001': {
    pincode: '452001',
    city: 'Indore',
    district: 'Indore',
    state: 'Madhya Pradesh',
    zone: 'Zone D (Rest of India)',
    hubName: 'Indore Pithampur Transport Hub',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },

  // Delhi NCR
  '110001': {
    pincode: '110001',
    city: 'New Delhi',
    district: 'Central Delhi',
    state: 'Delhi',
    zone: 'Zone A (Intra-City)',
    hubName: 'Delhi Central Sorting Gateway',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },

  // North-East / Hill Regions
  '781001': {
    pincode: '781001',
    city: 'Guwahati',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    zone: 'Zone E (Special / Remote / NE / J&K)',
    hubName: 'Guwahati Borjhar Airport Cargo Hub',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: false,
  },
  '190001': {
    pincode: '190001',
    city: 'Srinagar',
    district: 'Srinagar',
    state: 'Jammu & Kashmir',
    zone: 'Zone E (Special / Remote / NE / J&K)',
    hubName: 'Srinagar Bypass Transit Gateway',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: false,
    isCodAvailable: false,
  },
  // West Bengal
  '700001': {
    pincode: '700001',
    city: 'Kolkata',
    district: 'Kolkata Central',
    state: 'West Bengal',
    zone: 'Zone C (Metro-to-Metro)',
    hubName: 'Kolkata Dankuni / Taratala Cargo Complex',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },

  // Tamil Nadu
  '600001': {
    pincode: '600001',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    zone: 'Zone C (Metro-to-Metro)',
    hubName: 'Chennai Ambattur / Madhavaram Cargo Gateway',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },

  // Telangana
  '500001': {
    pincode: '500001',
    city: 'Hyderabad',
    district: 'Hyderabad Urban',
    state: 'Telangana',
    zone: 'Zone C (Metro-to-Metro)',
    hubName: 'Hyderabad Sanathnagar / Shamshabad Cargo Terminal',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },

  // Gujarat
  '380001': {
    pincode: '380001',
    city: 'Ahmedabad',
    district: 'Ahmedabad',
    state: 'Gujarat',
    zone: 'Zone C (Metro-to-Metro)',
    hubName: 'Ahmedabad Sanand / Changodar Multimodal Logistics Hub',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },

  // Punjab / Chandigarh
  '160017': {
    pincode: '160017',
    city: 'Chandigarh',
    district: 'Chandigarh Tri-City',
    state: 'Punjab / Chandigarh',
    zone: 'Zone B (Intra-State / Regional)',
    hubName: 'Chandigarh Industrial Area Phase-I Depot',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },

  // Uttarakhand
  '248001': {
    pincode: '248001',
    city: 'Dehradun',
    district: 'Dehradun',
    state: 'Uttarakhand',
    zone: 'Zone B (Intra-State / Regional)',
    hubName: 'Dehradun Transport Nagar / Selaqui Hub',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },

  // Odisha
  '751001': {
    pincode: '751001',
    city: 'Bhubaneswar',
    district: 'Khordha',
    state: 'Odisha',
    zone: 'Zone D (Rest of India)',
    hubName: 'Bhubaneswar Mancheswar Industrial Estate Depot',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },

  // Kerala
  '695001': {
    pincode: '695001',
    city: 'Thiruvananthapuram',
    district: 'Thiruvananthapuram',
    state: 'Kerala',
    zone: 'Zone D (Rest of India)',
    hubName: 'Kochuveli Multimodal Cargo Gateway',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },

  // Chhattisgarh
  '492001': {
    pincode: '492001',
    city: 'Raipur',
    district: 'Raipur',
    state: 'Chhattisgarh',
    zone: 'Zone D (Rest of India)',
    hubName: 'Raipur Urla Industrial Area Logistics Park',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },

  // Goa
  '403001': {
    pincode: '403001',
    city: 'Panaji',
    district: 'North Goa',
    state: 'Goa',
    zone: 'Zone D (Rest of India)',
    hubName: 'Goa Verna Industrial Estate Cargo Hub',
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  },
};

/**
 * Resolve or infer information for any Indian pin code
 */
export function resolvePincode(pincode: string): PincodeInfo {
  const cleanPin = pincode.trim();
  if (PINCODE_DIRECTORY[cleanPin]) {
    return PINCODE_DIRECTORY[cleanPin];
  }

  // Heuristic based on 1st digit (Postal Zone of India)
  const firstDigit = cleanPin[0] || '1';
  let state = 'Northern Region';
  let zone: PincodeInfo['zone'] = 'Zone D (Rest of India)';

  switch (firstDigit) {
    case '1':
      state = cleanPin.startsWith('11') ? 'Delhi' : cleanPin.startsWith('12') || cleanPin.startsWith('13') ? 'Haryana' : cleanPin.startsWith('14') || cleanPin.startsWith('15') ? 'Punjab' : cleanPin.startsWith('16') ? 'Chandigarh' : cleanPin.startsWith('17') ? 'Himachal Pradesh' : 'Jammu & Kashmir';
      zone = cleanPin.startsWith('11') ? 'Zone A (Intra-City)' : cleanPin.startsWith('12') ? 'Zone B (Intra-State / Regional)' : cleanPin.startsWith('17') || cleanPin.startsWith('18') || cleanPin.startsWith('19') ? 'Zone E (Special / Remote / NE / J&K)' : 'Zone B (Intra-State / Regional)';
      break;
    case '2':
      state = cleanPin.startsWith('24') || cleanPin.startsWith('26') ? 'Uttarakhand' : 'Uttar Pradesh';
      zone = 'Zone B (Intra-State / Regional)';
      break;
    case '3':
      state = cleanPin.startsWith('30') || cleanPin.startsWith('31') || cleanPin.startsWith('32') || cleanPin.startsWith('33') || cleanPin.startsWith('34') ? 'Rajasthan' : 'Gujarat';
      zone = 'Zone B (Intra-State / Regional)';
      break;
    case '4':
      state = cleanPin.startsWith('40') || cleanPin.startsWith('41') || cleanPin.startsWith('42') || cleanPin.startsWith('43') || cleanPin.startsWith('44') ? 'Maharashtra' : cleanPin.startsWith('45') || cleanPin.startsWith('46') || cleanPin.startsWith('47') || cleanPin.startsWith('48') ? 'Madhya Pradesh' : 'Goa / Chhattisgarh';
      zone = 'Zone C (Metro-to-Metro)';
      break;
    case '5':
      state = cleanPin.startsWith('50') || cleanPin.startsWith('51') || cleanPin.startsWith('52') || cleanPin.startsWith('53') ? 'Andhra Pradesh / Telangana' : 'Karnataka';
      zone = 'Zone D (Rest of India)';
      break;
    case '6':
      state = cleanPin.startsWith('60') || cleanPin.startsWith('61') || cleanPin.startsWith('62') || cleanPin.startsWith('63') || cleanPin.startsWith('64') ? 'Tamil Nadu' : 'Kerala';
      zone = 'Zone D (Rest of India)';
      break;
    case '7':
      state = cleanPin.startsWith('70') || cleanPin.startsWith('71') || cleanPin.startsWith('72') || cleanPin.startsWith('73') || cleanPin.startsWith('74') ? 'West Bengal' : cleanPin.startsWith('75') || cleanPin.startsWith('76') || cleanPin.startsWith('77') ? 'Odisha' : 'Assam & North East';
      zone = cleanPin.startsWith('78') || cleanPin.startsWith('79') ? 'Zone E (Special / Remote / NE / J&K)' : 'Zone D (Rest of India)';
      break;
    case '8':
      state = cleanPin.startsWith('80') || cleanPin.startsWith('81') || cleanPin.startsWith('82') || cleanPin.startsWith('84') || cleanPin.startsWith('85') ? 'Bihar' : 'Jharkhand';
      zone = 'Zone D (Rest of India)';
      break;
  }

  return {
    pincode: cleanPin || '226001',
    city: `District Hub (${cleanPin})`,
    district: `${state} District`,
    state,
    zone,
    hubName: `${state} Regional Logistics Depot`,
    serviceableSurface: true,
    serviceableExpress: true,
    serviceableHeavyB2B: true,
    isCodAvailable: true,
  };
}

/**
 * Predefined machinery sizes and specifications for instant rate estimation
 */
export const MACHINERY_PRESETS = [
  {
    id: 'TLR_DLX',
    name: 'USHA Tailor Deluxe Machine (Carton)',
    model: 'Tailor Deluxe IS Marked',
    deadWeightKg: 14.0,
    lengthCm: 45,
    widthCm: 25,
    heightCm: 35,
    description: 'Standard master carton with machine head & standard accessories',
  },
  {
    id: 'ALLURE_DLX',
    name: 'USHA Allure DLX Automatic (Carton)',
    model: 'Janome Allure DLX Free Arm',
    deadWeightKg: 8.5,
    lengthCm: 42,
    widthCm: 22,
    heightCm: 34,
    description: 'Compact computerized zigzag machine in thermocol casing',
  },
  {
    id: 'STAND_BOARD',
    name: 'Cast Iron Stand & Laminated Wooden Board',
    model: 'Heavy Duty Tailor Foot Stand',
    deadWeightKg: 22.0,
    lengthCm: 85,
    widthCm: 55,
    heightCm: 20,
    description: 'Cast iron leg frame, flywheel, foot pedal and polished wooden table top',
  },
  {
    id: 'UMB_95T',
    name: 'USHA Industrial Umbrella 95T Machine + Motor',
    model: 'Umbrella 95T High Speed with Clutch Motor',
    deadWeightKg: 34.0,
    lengthCm: 60,
    widthCm: 45,
    heightCm: 40,
    description: 'Industrial high-speed head + 1/4 HP copper wound clutch motor',
  },
  {
    id: 'OVERLOCK_747D',
    name: 'USHA Industrial Overlock 747D (Direct Drive)',
    model: '4-Thread Heavy Duty Overlock Machine',
    deadWeightKg: 38.0,
    lengthCm: 52,
    widthCm: 42,
    heightCm: 42,
    description: 'Heavy duty high speed overlock assembly with direct-drive motor',
  },
  {
    id: 'GEO_TOOLKIT',
    name: 'Geo Master Vocational Tailoring Toolkit',
    model: '32-Piece Artisan Toolkit Box',
    deadWeightKg: 4.5,
    lengthCm: 35,
    widthCm: 25,
    heightCm: 15,
    description: 'Heavy shears, metal ruler, measuring tape, tailor chalk, button accessories',
  },
  {
    id: 'BULK_PALLET',
    name: 'Bulk Pallet Shipment (10 Tailor Deluxe Machines)',
    model: '10-Unit Wrapped Wooden Pallet',
    deadWeightKg: 140.0,
    lengthCm: 120,
    widthCm: 80,
    heightCm: 100,
    description: '10 units banded and shrink-wrapped onto standard wooden pallet for B2B truck dispatch',
  },
];

/**
 * Shiprocket Volumetric Weight Formula:
 * Volumetric Weight (kg) = (Length cm × Width cm × Height cm) / 5000
 */
export function calculateVolumetricWeight(lengthCm: number, widthCm: number, heightCm: number): number {
  if (!lengthCm || !widthCm || !heightCm) return 0;
  const vol = (lengthCm * widthCm * heightCm) / 5000;
  return Math.round(vol * 100) / 100;
}

/**
 * Chargeable Weight is maximum of Dead Weight and Volumetric Weight, multiplied by box count
 */
export function calculateChargeableWeight(deadWeightKg: number, volumetricWeightKg: number, boxCount: number = 1): number {
  const maxWeight = Math.max(deadWeightKg, volumetricWeightKg);
  return Math.round(maxWeight * boxCount * 100) / 100;
}

/**
 * Dynamic Multi-Carrier Rate Calculator (Shiprocket style)
 */
export function calculateCarrierRates(
  originPin: string,
  destPin: string,
  chargeableWeightKg: number,
  boxCount: number = 1
): CourierCarrierOption[] {
  const origin = resolvePincode(originPin);
  const dest = resolvePincode(destPin);

  // Zone multiplier
  let zoneMultiplier = 1.0;
  let baseTransitDays = 3;

  if (dest.zone === 'Zone A (Intra-City)') {
    zoneMultiplier = 0.75;
    baseTransitDays = 1;
  } else if (dest.zone === 'Zone B (Intra-State / Regional)') {
    zoneMultiplier = 0.9;
    baseTransitDays = 2;
  } else if (dest.zone === 'Zone C (Metro-to-Metro)') {
    zoneMultiplier = 1.1;
    baseTransitDays = 3;
  } else if (dest.zone === 'Zone D (Rest of India)') {
    zoneMultiplier = 1.35;
    baseTransitDays = 4;
  } else if (dest.zone === 'Zone E (Special / Remote / NE / J&K)') {
    zoneMultiplier = 1.8;
    baseTransitDays = 6;
  }

  const weight = Math.max(1, chargeableWeightKg);

  // Helper to format estimated date
  const getEtaDate = (days: number): string => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const rawCarriers: Array<{
    id: string;
    carrierName: string;
    carrierCode: CourierCarrierOption['carrierCode'];
    serviceType: CourierCarrierOption['serviceType'];
    mode: CourierCarrierOption['mode'];
    dayOffset: number;
    rating: number;
    onTimeRate: number;
    baseRatePerKg: number;
    docketFee: number;
    fuelSurchargePct: number;
    features: string[];
    pickupCutoff: string;
    minWeightSlab?: number;
  }> = [
    {
      id: 'DELHIVERY_SURFACE',
      carrierName: 'Delhivery Surface B2B',
      carrierCode: 'delhivery',
      serviceType: 'Surface B2B Cargo',
      mode: 'Surface',
      dayOffset: 0,
      rating: 4.8,
      onTimeRate: 98.4,
      baseRatePerKg: 34,
      docketFee: 80,
      fuelSurchargePct: 0.12,
      features: ['Real-time Webhook Tracking', 'Instant E-Way Bill Verification', 'Electronic Signed POD (ePOD)'],
      pickupCutoff: '4:00 PM',
    },
    {
      id: 'BLUEDART_APEX',
      carrierName: 'Blue Dart Apex Express',
      carrierCode: 'bluedart',
      serviceType: 'Express Air Priority',
      mode: 'Air',
      dayOffset: -2,
      rating: 4.9,
      onTimeRate: 99.2,
      baseRatePerKg: 78,
      docketFee: 120,
      fuelSurchargePct: 0.15,
      features: ['Priority Airfreight Transit', 'High-Value Transit Insurance', 'Dedicated Tender Sample Delivery'],
      pickupCutoff: '6:30 PM',
    },
    {
      id: 'VRL_LOGISTICS',
      carrierName: 'VRL Logistics Heavy Surface',
      carrierCode: 'vrl',
      serviceType: 'Heavy Freight Truckload',
      mode: 'Surface',
      dayOffset: 1,
      rating: 4.7,
      onTimeRate: 96.8,
      baseRatePerKg: 22,
      docketFee: 150,
      fuelSurchargePct: 0.10,
      features: ['Pallet & Machinery Specialist', 'Hydraulic Tailgate Unloading', 'Consignment B2B LR Receipt'],
      pickupCutoff: '2:30 PM',
      minWeightSlab: 25,
    },
    {
      id: 'TCI_EXPRESS',
      carrierName: 'TCI Express Government Cargo',
      carrierCode: 'tci',
      serviceType: 'Surface B2B Cargo',
      mode: 'Surface',
      dayOffset: 0,
      rating: 4.8,
      onTimeRate: 97.9,
      baseRatePerKg: 26,
      docketFee: 100,
      fuelSurchargePct: 0.11,
      features: ['Institutional / GeM Portal Compliance', 'District Collectorate Direct Gate Pass', 'Physical Official Stamp POD'],
      pickupCutoff: '3:30 PM',
    },
    {
      id: 'SAFEXPRESS_CARGO',
      carrierName: 'Safexpress Weatherproof Container',
      carrierCode: 'safexpress',
      serviceType: 'Heavy Freight Truckload',
      mode: 'Surface',
      dayOffset: 0,
      rating: 4.7,
      onTimeRate: 97.2,
      baseRatePerKg: 29,
      docketFee: 110,
      fuelSurchargePct: 0.12,
      features: ['100% Sealed Container Fleets', 'Zero Moisture / Rain Protection', 'GPS Truck Linehaul Telemetry'],
      pickupCutoff: '3:00 PM',
    },
    {
      id: 'DTDC_PRO',
      carrierName: 'DTDC Surface Pro',
      carrierCode: 'dtdc',
      serviceType: 'Regional Express',
      mode: 'Surface',
      dayOffset: 1,
      rating: 4.6,
      onTimeRate: 95.8,
      baseRatePerKg: 38,
      docketFee: 75,
      fuelSurchargePct: 0.12,
      features: ['Deep Pin-code Reach (19,000+ Codes)', 'Block & Tehsil Branch Delivery', 'Reverse Pickup Available'],
      pickupCutoff: '5:00 PM',
    },
    {
      id: 'XPRESSBEES_B2B',
      carrierName: 'Xpressbees B2B Heavy',
      carrierCode: 'xpressbees',
      serviceType: 'Surface B2B Cargo',
      mode: 'Surface',
      dayOffset: 1,
      rating: 4.5,
      onTimeRate: 94.6,
      baseRatePerKg: 24,
      docketFee: 70,
      fuelSurchargePct: 0.10,
      features: ['Budget Surface Cargo', 'Volume Discount Slabs', 'Bulk API Consignment Creation'],
      pickupCutoff: '4:00 PM',
    },
  ];

  const calculated: CourierCarrierOption[] = rawCarriers.map((carrier) => {
    const etdDays = Math.max(1, baseTransitDays + carrier.dayOffset);
    const adjustedRatePerKg = Math.round(carrier.baseRatePerKg * zoneMultiplier * 10) / 10;
    const freightCharge = Math.round(adjustedRatePerKg * weight);
    const fuelSurcharge = Math.round(freightCharge * carrier.fuelSurchargePct);
    const subtotal = freightCharge + fuelSurcharge + carrier.docketFee;
    const gstAmount = Math.round(subtotal * 0.18);
    const totalCost = subtotal + gstAmount;

    return {
      id: carrier.id,
      carrierName: carrier.carrierName,
      carrierCode: carrier.carrierCode,
      serviceType: carrier.serviceType,
      mode: carrier.mode,
      etdDays,
      estimatedDeliveryDate: getEtaDate(etdDays),
      rating: carrier.rating,
      onTimeRate: carrier.onTimeRate,
      baseRatePerKg: adjustedRatePerKg,
      freightCharge,
      fuelSurcharge,
      docketFee: carrier.docketFee,
      gstAmount,
      totalCost,
      serviceable: true,
      carrierFeatures: carrier.features,
      pickupCutoffTime: carrier.pickupCutoff,
    };
  });

  // Sort and highlight badges
  const sortedByCost = [...calculated].sort((a, b) => a.totalCost - b.totalCost);
  const cheapestId = sortedByCost[0]?.id;

  const sortedByTime = [...calculated].sort((a, b) => a.etdDays - b.etdDays);
  const fastestId = sortedByTime[0]?.id;

  return calculated.map((c) => ({
    ...c,
    isCheapest: c.id === cheapestId,
    isFastest: c.id === fastestId,
    isRecommended: c.carrierCode === 'delhivery' || c.carrierCode === 'tci',
    isBestB2B: c.carrierCode === 'vrl' || c.carrierCode === 'tci',
  }));
}

/**
 * Generate a realistic timeline of tracking events for any dispatch
 */
export function generateTrackingHistory(
  originCity: string,
  destinationCity: string,
  deliveryStatus: string,
  dispatchDate: string,
  carrierName: string,
  vehicleNumber: string
): TrackingEvent[] {
  const d = new Date(dispatchDate || Date.now());
  const fmt = (offsetHours: number) => {
    const dt = new Date(d.getTime() + offsetHours * 3600 * 1000);
    return dt.toISOString().slice(0, 16).replace('T', ' ');
  };

  const isDelivered = deliveryStatus === 'Delivered';
  const isInTransit = deliveryStatus === 'In Transit' || isDelivered;
  const isPacked = deliveryStatus === 'Packed' || isInTransit;

  return [
    {
      timestamp: fmt(0),
      status: 'Consignment Booked & Manifested',
      location: `${originCity} Central Hub`,
      description: `E-Way bill generated and consignment note docketed with ${carrierName}. Packing and pallet verification complete.`,
      completed: true,
    },
    {
      timestamp: fmt(6),
      status: 'Consignment Picked Up',
      location: `${originCity} Logistics Depot`,
      description: `Dispatched from Geo Digital warehouse dock onto vehicle ${vehicleNumber}. Weight inspection verified.`,
      completed: isPacked || isInTransit,
    },
    {
      timestamp: fmt(18),
      status: 'Arrived at State Transit Gateway',
      location: 'National Highway Transshipment Hub',
      description: 'Vehicle scanned through GPS highway toll gateway. Linehaul transit en route to destination depot.',
      completed: isInTransit,
    },
    {
      timestamp: fmt(42),
      status: 'Arrived at Destination District Depot',
      location: `${destinationCity} Delivery Hub`,
      description: `Consignment de-palletized and sorted for local delivery to institutional consignee.`,
      completed: isInTransit && (isDelivered || deliveryStatus === 'In Transit'),
    },
    {
      timestamp: fmt(58),
      status: 'Out for Delivery',
      location: `${destinationCity} Divisional Center`,
      description: `Assigned to dedicated delivery crew. Consignee nodal officer notified via SMS/WhatsApp.`,
      completed: isDelivered,
    },
    {
      timestamp: fmt(64),
      status: 'Delivered & Signed POD Acknowledged',
      location: `${destinationCity} Consignee Office`,
      description: `Machine delivery verified and accepted by storekeeper with official rubber stamp and signed Proof of Delivery (POD).`,
      completed: isDelivered,
    },
  ];
}
