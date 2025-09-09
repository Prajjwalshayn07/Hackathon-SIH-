export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Sample statistics (in production, this would query the database)
  const stats = {
    total: 156,
    byStatus: [
      { status: 'pending', count: 45 },
      { status: 'in_progress', count: 32 },
      { status: 'resolved', count: 79 }
    ],
    byCategory: [
      { category: 'pothole', count: 35 },
      { category: 'streetlight', count: 28 },
      { category: 'trash', count: 22 },
      { category: 'water_leak', count: 18 },
      { category: 'graffiti', count: 15 },
      { category: 'traffic', count: 20 },
      { category: 'park', count: 10 },
      { category: 'other', count: 8 }
    ],
    byDepartment: [
      { department: 'Public Works', count: 50 },
      { department: 'Electrical', count: 28 },
      { department: 'Sanitation', count: 22 },
      { department: 'Water Department', count: 18 },
      { department: 'Traffic Management', count: 20 },
      { department: 'Parks & Recreation', count: 10 },
      { department: 'General', count: 8 }
    ]
  };

  res.status(200).json(stats);
}
