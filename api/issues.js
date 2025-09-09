// Simplified API for Vercel Deployment
// This stores data temporarily in memory (resets on each deployment)

let issues = [];
let nextId = 1;

// Export function to get issues for statistics
export function getIssues() {
  return issues;
}

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET all issues or single issue
  if (req.method === 'GET') {
    const { id } = req.query;
    
    if (id) {
      const issue = issues.find(i => i.id === parseInt(id));
      if (issue) {
        res.status(200).json({ issue, comments: [] });
      } else {
        res.status(404).json({ error: 'Issue not found' });
      }
    } else {
      res.status(200).json({ issues });
    }
    return;
  }

  // POST new issue
  if (req.method === 'POST') {
    // Parse the request body (Vercel should parse JSON automatically)
    let data = req.body;
    
    // If body is a string, try to parse it
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        // If not JSON, assume it's form data and parse it
        const params = new URLSearchParams(data);
        data = Object.fromEntries(params);
      }
    }
    
    const newIssue = {
      id: nextId++,
      title: data.title || 'New Issue',
      description: data.description || '',
      category: data.category || 'other',
      status: 'pending',
      priority: data.priority || 'normal',
      latitude: parseFloat(data.latitude) || 23.3441,
      longitude: parseFloat(data.longitude) || 85.3096,
      address: data.address || 'Location not specified',
      reporter_name: data.reporter_name || 'Anonymous',
      reporter_contact: data.reporter_contact || '',
      created_at: new Date().toISOString(),
      department: getDepartment(data.category)
    };

    issues.unshift(newIssue);
    res.status(201).json({ 
      id: newIssue.id, 
      message: 'Issue reported successfully',
      issue: newIssue 
    });
    return;
  }

  // PUT update issue
  if (req.method === 'PUT') {
    const { id } = req.query;
    const issueIndex = issues.findIndex(i => i.id === parseInt(id));
    
    if (issueIndex !== -1) {
      issues[issueIndex] = {
        ...issues[issueIndex],
        ...req.body,
        updated_at: new Date().toISOString()
      };
      res.status(200).json({ message: 'Issue updated successfully' });
    } else {
      res.status(404).json({ error: 'Issue not found' });
    }
    return;
  }

  // DELETE issue
  if (req.method === 'DELETE') {
    const { id } = req.query;
    const initialLength = issues.length;
    issues = issues.filter(i => i.id !== parseInt(id));
    
    if (issues.length < initialLength) {
      res.status(200).json({ message: 'Issue deleted successfully' });
    } else {
      res.status(404).json({ error: 'Issue not found' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}

function getDepartment(category) {
  const categoryDeptMap = {
    'pothole': 'Public Works',
    'streetlight': 'Electrical',
    'trash': 'Sanitation',
    'graffiti': 'Public Works',
    'water_leak': 'Water Department',
    'traffic': 'Traffic Management',
    'park': 'Parks & Recreation',
    'other': 'General'
  };
  
  return categoryDeptMap[category] || 'General';
}
