export const mockStudents = [
  {
    id: 'STU001',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91-9876543210',
    dateOfBirth: '2003-05-15',
    gender: 'male',
    address: '123, Main Street',
    city: 'Delhi',
    state: 'Delhi',
    zipCode: '110001',
    qualification: '12th Pass (Commerce)',
    cgpa: 8.5,
    admissionDate: '2024-01-15',
    status: 'approved',
    documents: [
      {
        id: 'DOC001',
        name: '10th Mark Sheet',
        type: 'PDF',
        uploadDate: '2024-01-10',
        studentId: 'STU001',
      },
      {
        id: 'DOC002',
        name: '12th Mark Sheet',
        type: 'PDF',
        uploadDate: '2024-01-10',
        studentId: 'STU001',
      },
    ],
    remarks: 'Strong academic record',
  },
  {
    id: 'STU002',
    firstName: 'Priya',
    lastName: 'Singh',
    email: 'priya.singh@email.com',
    phone: '+91-9876543211',
    dateOfBirth: '2002-08-22',
    gender: 'female',
    address: '456, Park Avenue',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    qualification: '12th Pass (Science)',
    cgpa: 9.2,
    admissionDate: '2024-01-10',
    status: 'approved',
    documents: [
      {
        id: 'DOC003',
        name: '10th Mark Sheet',
        type: 'PDF',
        uploadDate: '2024-01-05',
        studentId: 'STU002',
      },
      {
        id: 'DOC004',
        name: '12th Mark Sheet',
        type: 'PDF',
        uploadDate: '2024-01-05',
        studentId: 'STU002',
      },
      {
        id: 'DOC005',
        name: 'JEE Score',
        type: 'PDF',
        uploadDate: '2024-01-05',
        studentId: 'STU002',
      },
    ],
  },
  {
    id: 'STU003',
    firstName: 'Arjun',
    lastName: 'Patel',
    email: 'arjun.patel@email.com',
    phone: '+91-9876543212',
    dateOfBirth: '2004-03-10',
    gender: 'male',
    address: '789, Circle Road',
    city: 'Bangalore',
    state: 'Karnataka',
    zipCode: '560001',
    qualification: '12th Pass (Commerce)',
    cgpa: 7.8,
    admissionDate: '2024-01-20',
    status: 'pending',
    documents: [
      {
        id: 'DOC006',
        name: '10th Mark Sheet',
        type: 'PDF',
        uploadDate: '2024-01-18',
        studentId: 'STU003',
      },
    ],
    remarks: 'Documents pending review',
  },
  {
    id: 'STU004',
    firstName: 'Anjali',
    lastName: 'Sharma',
    email: 'anjali.sharma@email.com',
    phone: '+91-9876543213',
    dateOfBirth: '2003-11-05',
    gender: 'female',
    address: '321, Lake Road',
    city: 'Chennai',
    state: 'Tamil Nadu',
    zipCode: '600001',
    qualification: '12th Pass (Science)',
    cgpa: 8.9,
    admissionDate: '2024-01-12',
    status: 'processing',
    documents: [
      {
        id: 'DOC007',
        name: '10th Mark Sheet',
        type: 'PDF',
        uploadDate: '2024-01-10',
        studentId: 'STU004',
      },
      {
        id: 'DOC008',
        name: '12th Mark Sheet',
        type: 'PDF',
        uploadDate: '2024-01-10',
        studentId: 'STU004',
      },
    ],
  },
  {
    id: 'STU005',
    firstName: 'Vikram',
    lastName: 'Verma',
    email: 'vikram.verma@email.com',
    phone: '+91-9876543214',
    dateOfBirth: '2003-07-20',
    gender: 'male',
    address: '654, Forest Lane',
    city: 'Pune',
    state: 'Maharashtra',
    zipCode: '411001',
    qualification: '12th Pass (Commerce)',
    cgpa: 6.5,
    admissionDate: '2024-01-22',
    status: 'rejected',
    documents: [],
    remarks: 'CGPA below minimum requirement',
  },
  {
    id: 'STU006',
    firstName: 'Neha',
    lastName: 'Gupta',
    email: 'neha.gupta@email.com',
    phone: '+91-9876543215',
    dateOfBirth: '2002-12-15',
    gender: 'female',
    address: '987, Garden Street',
    city: 'Hyderabad',
    state: 'Telangana',
    zipCode: '500001',
    qualification: '12th Pass (Science)',
    cgpa: 9.0,
    admissionDate: '2024-01-14',
    status: 'approved',
    documents: [
      {
        id: 'DOC009',
        name: '10th Mark Sheet',
        type: 'PDF',
        uploadDate: '2024-01-12',
        studentId: 'STU006',
      },
      {
        id: 'DOC010',
        name: '12th Mark Sheet',
        type: 'PDF',
        uploadDate: '2024-01-12',
        studentId: 'STU006',
      },
    ],
  },
]

// Restoration of missing exports
export const getAdmissionStats = (students) => {
  return {
    totalApplications: students.length,
    approved: students.filter((s) => s.status === 'approved').length,
    pending: students.filter((s) => s.status === 'pending').length,
    rejected: students.filter((s) => s.status === 'rejected').length,
    processing: students.filter((s) => s.status === 'processing').length,
  }
}

export const getMonthlyAdmissions = () => {
  return [
    { month: 'January', admissions: 15, approvals: 12 },
    { month: 'February', admissions: 22, approvals: 18 },
    { month: 'March', admissions: 28, approvals: 24 },
    { month: 'April', admissions: 18, approvals: 16 },
    { month: 'May', admissions: 32, approvals: 28 },
    { month: 'June', admissions: 26, approvals: 22 },
  ]
}

export const getStatusBreakdown = (students) => {
  return [
    {
      name: 'Approved',
      value: students.filter((s) => s.status === 'approved').length,
      fill: '#52c41a',
    },
    {
      name: 'Pending',
      value: students.filter((s) => s.status === 'pending').length,
      fill: '#faad14',
    },
    {
      name: 'Processing',
      value: students.filter((s) => s.status === 'processing').length,
      fill: '#1890ff',
    },
    {
      name: 'Rejected',
      value: students.filter((s) => s.status === 'rejected').length,
      fill: '#ff4d4f',
    },
  ]
}

// ... existing exports ...

export const mockEnquiries = [
  {
    enquiryId: 'ENQ2024001',
    name: 'Rahul Verma',
    mobile: '9876543210',
    email: 'rahul.v@example.com',
    city: 'Mumbai',
    course: 'B.Tech CS',
    source: 'Website',
    status: 'New',
    assignedCounsellor: 'Sarah Jones',
    date: '2024-03-01',
    followUpLog: [],
    nextFollowUp: '2024-03-02',
  },
  {
    enquiryId: 'ENQ2024002',
    name: 'Sneha Gupta',
    mobile: '9898989898',
    email: 'sneha.g@example.com',
    city: 'Pune',
    course: 'MBA',
    source: 'Walk-in',
    status: 'Contacted',
    assignedCounsellor: 'Mike Ross',
    date: '2024-02-28',
    followUpLog: [
      { date: '2024-02-28', action: 'Call', notes: 'Interested in scholarship options.' },
    ],
    nextFollowUp: '2024-03-05',
  },
  {
    enquiryId: 'ENQ2024003',
    name: 'Amit Patel',
    mobile: '9123456789',
    email: 'amit.p@example.com',
    city: 'Ahmedabad',
    course: 'BBA',
    source: 'Facebook Lead',
    status: 'Interested',
    assignedCounsellor: 'Sarah Jones',
    date: '2024-02-25',
    followUpLog: [
      { date: '2024-02-25', action: 'WhatsApp', notes: 'Sent brochure.' },
      { date: '2024-02-27', action: 'Call', notes: 'Parents converting, wants campus visit.' },
    ],
    nextFollowUp: '2024-03-01',
  },
  {
    enquiryId: 'ENQ2024004',
    name: 'Priya Sharma',
    mobile: '9988776655',
    email: 'priya.s@example.com',
    city: 'Delhi',
    course: 'M.Tech',
    source: 'Referral',
    status: 'Visit Scheduled',
    assignedCounsellor: 'Mike Ross',
    date: '2024-02-20',
    followUpLog: [
       { date: '2024-02-20', action: 'Call', notes: 'Initial enquiry.' },
       { date: '2024-02-22', action: 'Visit Scheduled', notes: 'Scheduled for 5th March.' },
    ],
    nextFollowUp: '2024-03-05',
  },
  {
    enquiryId: 'ENQ2024005',
    name: 'Karan Mehra',
    mobile: '8877665544',
    email: 'karan.m@example.com',
    city: 'Bangalore',
    course: 'B.Tech ME',
    source: 'Website',
    status: 'Lost',
    assignedCounsellor: 'Sarah Jones',
    date: '2024-01-15',
    followUpLog: [
      { date: '2024-01-16', action: 'Call', notes: 'Fees too high.' },
    ],
    nextFollowUp: null,
  }
];


export const getEnquiryStats = (enquiries) => {
  return {
    total: enquiries.length,
    new: enquiries.filter(e => e.status === 'New').length,
    contacted: enquiries.filter(e => e.status === 'Contacted').length,
    interested: enquiries.filter(e => e.status === 'Interested').length,
    visitScheduled: enquiries.filter(e => e.status === 'Visit Scheduled').length,
    converted: enquiries.filter(e => e.status === 'Admitted' || e.status === 'Application Submitted').length,
    lost: enquiries.filter(e => e.status === 'Lost').length,
  };
};

export const mockPayments = [
  {
    id: 'PAY001',
    studentId: 'STU001',
    studentName: 'Rajesh Kumar',
    amount: 50000,
    date: '2024-01-16',
    type: 'Tuition Fee',
    method: 'Bank Transfer',
    status: 'Completed',
    transactionId: 'TXN123456789'
  },
  {
    id: 'PAY002',
    studentId: 'STU002',
    studentName: 'Priya Singh',
    amount: 50000,
    date: '2024-01-11',
    type: 'Tuition Fee',
    method: 'UPI',
    status: 'Completed',
    transactionId: 'TXN987654321'
  },
  {
    id: 'PAY003',
    studentId: 'STU006',
    studentName: 'Neha Gupta',
    amount: 25000,
    date: '2024-01-15',
    type: 'Admission Fee',
    method: 'Cash',
    status: 'Completed',
    transactionId: 'RCPT001'
  }
];

export const getPaymentStats = (payments) => {
    const totalCollected = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);
    const recentTransactions = payments.slice(0, 5);
    return { totalCollected, recentTransactions };
};
