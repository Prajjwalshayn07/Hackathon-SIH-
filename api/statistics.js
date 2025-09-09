// Use global scope to access shared issues data
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Initialize global issues if not exists
  if (!global.issues) {
    global.issues = [];
    global.nextId = 1;
  }
  
  // Get actual issues data from global scope
  const issues = global.issues || [];
  
  // Calculate real statistics from actual issues
  const stats = {
    total: issues.length,
    byStatus: calculateByStatus(issues),
    byCategory: calculateByCategory(issues),
    byDepartment: calculateByDepartment(issues)
  };

  res.status(200).json(stats);
}

function calculateByStatus(issues) {
  const statusCounts = {
    pending: 0,
    in_progress: 0,
    resolved: 0
  };
  
  issues.forEach(issue => {
    if (statusCounts.hasOwnProperty(issue.status)) {
      statusCounts[issue.status]++;
    }
  });
  
  return Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
}

function calculateByCategory(issues) {
  const categoryCounts = {};
  
  issues.forEach(issue => {
    if (!categoryCounts[issue.category]) {
      categoryCounts[issue.category] = 0;
    }
    categoryCounts[issue.category]++;
  });
  
  return Object.entries(categoryCounts).map(([category, count]) => ({ category, count }));
}

function calculateByDepartment(issues) {
  const departmentCounts = {};
  
  issues.forEach(issue => {
    if (issue.department) {
      if (!departmentCounts[issue.department]) {
        departmentCounts[issue.department] = 0;
      }
      departmentCounts[issue.department]++;
    }
  });
  
  return Object.entries(departmentCounts).map(([department, count]) => ({ department, count }));
}
