// Mock database and seed records for Jamal's Appliance Care
// Simulates persistent backend storage with localStorage fallback

export const MOCK_ADMIN = {
  email: 'admin@jamal.com',
  password: 'admin123',
  name: "Jamal Uddin",
  role: "Lead Service Engineer & Shop Owner",
  shopName: "Jamal's Appliance Care",
  tagline: "Expert Appliance Diagnostics, Transparent Pricing & Quality Repairs"
};

export const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-101',
    fullName: 'Tanvir Ahmed',
    phone: '01711223344',
    email: 'tanvir.ahmed@gmail.com',
    address: 'House 24, Road 7, Sector 4, Uttara, Dhaka',
    registeredDate: '2026-11-15 09:30 AM',
    complaintCount: 1
  },
  {
    id: 'CUST-102',
    fullName: 'Nusrat Jahan',
    phone: '01822334455',
    email: 'nusrat.j@yahoo.com',
    address: 'Flat 4B, Green Heritage, Dhanmondi 27, Dhaka',
    registeredDate: '2026-11-17 11:15 AM',
    complaintCount: 1
  },
  {
    id: 'CUST-103',
    fullName: 'Mohammad Rahim',
    phone: '01933445566',
    email: 'rahim.contractor@outlook.com',
    address: 'Block D, Road 3, Mirpur 12, Dhaka',
    registeredDate: '2026-11-19 02:20 PM',
    complaintCount: 1
  },
  {
    id: 'CUST-104',
    fullName: 'Farhana Islam',
    phone: '01644556677',
    email: 'farhana.islam@gmail.com',
    address: 'Plot 12, Avenue 5, Banani, Dhaka',
    registeredDate: '2026-11-20 04:00 PM',
    complaintCount: 1
  },
  {
    id: 'CUST-105',
    fullName: 'Kamrul Hasan',
    phone: '01555667788',
    email: 'kamrul.hasan@diu.edu.bd',
    address: 'Ka-65/2, Shahjadpur, Gulshan-2, Dhaka',
    registeredDate: '2026-11-22 10:45 AM',
    complaintCount: 1
  }
];

export const INITIAL_COMPLAINTS = [
  {
    id: 'JAC-2026-001',
    customerId: 'CUST-101',
    customerName: 'Tanvir Ahmed',
    customerPhone: '01711223344',
    customerEmail: 'tanvir.ahmed@gmail.com',
    customerAddress: 'House 24, Road 7, Sector 4, Uttara, Dhaka',
    applianceType: 'Refrigerator',
    brand: 'Walton',
    modelNumber: 'WFD-1B6 (Direct Cool)',
    serialNumber: 'WAL-RF-8921',
    issueCategory: 'Not Cooling',
    description: 'Freezer compartment works slightly but the lower refrigerator chamber remains completely warm. Compressor runs continuously with a clicking noise.',
    priority: 'High',
    serviceType: 'Home Visit',
    status: 'Under Inspection',
    registeredDate: '2026-11-15 09:30 AM',
    estimatedInspectionFee: 500,
    technicianNotes: 'Possible refrigerant gas leakage or capillary tube blockage. Compressor relay checked.'
  },
  {
    id: 'JAC-2026-002',
    customerId: 'CUST-102',
    customerName: 'Nusrat Jahan',
    customerPhone: '01822334455',
    customerEmail: 'nusrat.j@yahoo.com',
    customerAddress: 'Flat 4B, Green Heritage, Dhanmondi 27, Dhaka',
    applianceType: 'Washing Machine',
    brand: 'Samsung',
    modelNumber: 'EcoBubble 7kg Front-Load',
    serialNumber: 'SAM-WM-4410',
    issueCategory: 'Water Leakage',
    description: 'Water overflows during rinse cycle from the bottom tray. Error code 4E appears intermittently during initial drain.',
    priority: 'Medium',
    serviceType: 'Home Visit',
    status: 'Repaired',
    registeredDate: '2026-11-17 11:15 AM',
    estimatedInspectionFee: 500,
    technicianNotes: 'Drain pump filter cleared and intake hose gasket replaced. Tested on full rinse cycle successfully.'
  },
  {
    id: 'JAC-2026-003',
    customerId: 'CUST-103',
    customerName: 'Mohammad Rahim',
    customerPhone: '01933445566',
    customerEmail: 'rahim.contractor@outlook.com',
    customerAddress: 'Block D, Road 3, Mirpur 12, Dhaka',
    applianceType: 'Microwave Oven',
    brand: 'Singer',
    modelNumber: 'SMW20VM Solo 20L',
    serialNumber: 'SNG-MW-1092',
    issueCategory: 'Sparking & Odor',
    description: 'Sparks flying inside cooking cavity near the waveguide cover plate with a burning plastic smell when timer starts.',
    priority: 'High',
    serviceType: 'Shop Drop-off',
    status: 'Pending',
    registeredDate: '2026-11-19 02:20 PM',
    estimatedInspectionFee: 300,
    technicianNotes: 'Waveguide mica sheet burnt. Magnetron terminal inspection required.'
  },
  {
    id: 'JAC-2026-004',
    customerId: 'CUST-104',
    customerName: 'Farhana Islam',
    customerPhone: '01644556677',
    customerEmail: 'farhana.islam@gmail.com',
    customerAddress: 'Plot 12, Avenue 5, Banani, Dhaka',
    applianceType: 'Refrigerator',
    brand: 'LG',
    modelNumber: 'Smart Inverter 260L No-Frost',
    serialNumber: 'LG-GL-B272',
    issueCategory: 'Power Failure / Dead',
    description: 'No display, interior LED doesn\'t turn on, unit completely unresponsive after power surge during rainstorm.',
    priority: 'Urgent',
    serviceType: 'Home Visit',
    status: 'Under Inspection',
    registeredDate: '2026-11-20 04:00 PM',
    estimatedInspectionFee: 500,
    technicianNotes: 'Main inverter PCB fuse blown. Varistor and diode bridge to be tested.'
  },
  {
    id: 'JAC-2026-005',
    customerId: 'CUST-105',
    customerName: 'Kamrul Hasan',
    customerPhone: '01555667788',
    customerEmail: 'kamrul.hasan@diu.edu.bd',
    customerAddress: 'Ka-65/2, Shahjadpur, Gulshan-2, Dhaka',
    applianceType: 'Microwave Oven',
    brand: 'Haier',
    modelNumber: 'HMW-20M1 Grill 20L',
    serialNumber: 'HAI-MW-5501',
    issueCategory: 'Turntable Not Rotating',
    description: 'Heats food properly but the glass roller tray does not spin, heating food unevenly.',
    priority: 'Low',
    serviceType: 'Shop Drop-off',
    status: 'Delivered',
    registeredDate: '2026-11-22 10:45 AM',
    estimatedInspectionFee: 300,
    technicianNotes: 'Turntable synchronous drive motor replaced (21V AC). Tested with water cup load.'
  }
];

export const APPLIANCE_TYPES = [
  {
    id: 'Refrigerator',
    title: 'Refrigerator',
    subtitle: 'Frost & No-Frost Coolers',
    description: 'Cooling failures, thermostat issues, gas leaks, compressor clicking, seal damages.',
    iconName: 'Refrigerator',
    popularBrands: ['Walton', 'Samsung', 'LG', 'Singer', 'Whirlpool', 'Haier', 'Minister'],
    commonFaults: [
      'Not cooling in lower fridge compartment',
      'Continuous running compressor / overheating',
      'Refrigerant gas leak / hiss noise',
      'Excessive frost build-up / defrost failure',
      'Water leakage inside or under tray',
      'Complete power failure / Dead PCB'
    ]
  },
  {
    id: 'Washing Machine',
    title: 'Washing Machine',
    subtitle: 'Front-Load & Top-Load Systems',
    description: 'Spin failure, water drainage blocks, abnormal drum vibration, valve leakages.',
    iconName: 'WashingMachine',
    popularBrands: ['Samsung', 'LG', 'Whirlpool', 'Walton', 'Haier', 'Singer', 'Sharp'],
    commonFaults: [
      'Drum not spinning / slow spin',
      'Water drainage error / pump jammed',
      'Severe vibration and loud rattling noise',
      'Door lock jammed / won\'t open',
      'Water continuously filling without stopping',
      'Control board error codes (e.g., 4E, dE, UE)'
    ]
  },
  {
    id: 'Microwave Oven',
    title: 'Microwave Oven',
    subtitle: 'Solo, Grill & Convection',
    description: 'Sparking cavity, magnetron heating failure, turntable stall, keypad unresponsiveness.',
    iconName: 'Microwave',
    popularBrands: ['Singer', 'Haier', 'Panasonic', 'LG', 'Samsung', 'Walton', 'Sharp'],
    commonFaults: [
      'Running but not heating food (Magnetron/Diode)',
      'Sparking inside cooking chamber',
      'Glass turntable plate not rotating',
      'Touch keypad or dial timer unresponsive',
      'Burning smell or abnormal humming noise',
      'Tripping circuit breaker when started'
    ]
  }
];
