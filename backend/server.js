const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(path.join(__dirname, '../public')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'issue-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Initialize SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'civic_issues.db'));

// Create issues table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS issues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      priority TEXT DEFAULT 'normal',
      latitude REAL,
      longitude REAL,
      address TEXT,
      image_url TEXT,
      reporter_name TEXT,
      reporter_contact TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      resolved_at DATETIME,
      assigned_to TEXT,
      department TEXT,
      notes TEXT
    )
  `);

  // Create comments table for issue updates
  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      issue_id INTEGER,
      comment TEXT,
      author TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (issue_id) REFERENCES issues (id)
    )
  `);
});

// API Routes

// Get all issues
app.get('/api/issues', (req, res) => {
  const { status, category, priority, department } = req.query;
  let query = 'SELECT * FROM issues WHERE 1=1';
  const params = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (priority) {
    query += ' AND priority = ?';
    params.push(priority);
  }
  if (department) {
    query += ' AND department = ?';
    params.push(department);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ issues: rows });
  });
});

// Get single issue by ID
app.get('/api/issues/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM issues WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Issue not found' });
      return;
    }

    // Get comments for this issue
    db.all('SELECT * FROM comments WHERE issue_id = ? ORDER BY created_at DESC', [id], (err, comments) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      res.json({ issue: row, comments: comments });
    });
  });
});

// Create new issue
app.post('/api/issues', upload.single('image'), (req, res) => {
  const {
    title,
    description,
    category,
    priority,
    latitude,
    longitude,
    address,
    reporter_name,
    reporter_contact
  } = req.body;

  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  // Determine department based on category
  let department = 'General';
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
  
  if (categoryDeptMap[category]) {
    department = categoryDeptMap[category];
  }

  const query = `
    INSERT INTO issues (
      title, description, category, priority, latitude, longitude, 
      address, image_url, reporter_name, reporter_contact, department
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    title,
    description,
    category,
    priority || 'normal',
    latitude,
    longitude,
    address,
    image_url,
    reporter_name,
    reporter_contact,
    department
  ];

  db.run(query, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({
      id: this.lastID,
      message: 'Issue reported successfully',
      image_url: image_url
    });
  });
});

// Update issue status (for admin)
app.put('/api/issues/:id', (req, res) => {
  const { id } = req.params;
  const { status, priority, assigned_to, department, notes } = req.body;

  let updateFields = [];
  let params = [];

  if (status !== undefined) {
    updateFields.push('status = ?');
    params.push(status);
    
    if (status === 'resolved') {
      updateFields.push('resolved_at = CURRENT_TIMESTAMP');
    }
  }
  
  if (priority !== undefined) {
    updateFields.push('priority = ?');
    params.push(priority);
  }
  
  if (assigned_to !== undefined) {
    updateFields.push('assigned_to = ?');
    params.push(assigned_to);
  }
  
  if (department !== undefined) {
    updateFields.push('department = ?');
    params.push(department);
  }
  
  if (notes !== undefined) {
    updateFields.push('notes = ?');
    params.push(notes);
  }

  updateFields.push('updated_at = CURRENT_TIMESTAMP');
  params.push(id);

  const query = `UPDATE issues SET ${updateFields.join(', ')} WHERE id = ?`;

  db.run(query, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ error: 'Issue not found' });
      return;
    }

    res.json({ message: 'Issue updated successfully' });
  });
});

// Add comment to issue
app.post('/api/issues/:id/comments', (req, res) => {
  const { id } = req.params;
  const { comment, author } = req.body;

  const query = 'INSERT INTO comments (issue_id, comment, author) VALUES (?, ?, ?)';
  
  db.run(query, [id, comment, author || 'System'], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({
      id: this.lastID,
      message: 'Comment added successfully'
    });
  });
});

// Get statistics
app.get('/api/statistics', (req, res) => {
  const stats = {};

  db.get('SELECT COUNT(*) as total FROM issues', (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    stats.total = row.total;

    db.all(`
      SELECT status, COUNT(*) as count 
      FROM issues 
      GROUP BY status
    `, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      stats.byStatus = rows;

      db.all(`
        SELECT category, COUNT(*) as count 
        FROM issues 
        GROUP BY category
      `, (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        stats.byCategory = rows;

        db.all(`
          SELECT department, COUNT(*) as count 
          FROM issues 
          GROUP BY department
        `, (err, rows) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          stats.byDepartment = rows;

          res.json(stats);
        });
      });
    });
  });
});

// Delete issue (for testing)
app.delete('/api/issues/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM issues WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ error: 'Issue not found' });
      return;
    }

    res.json({ message: 'Issue deleted successfully' });
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n========================================');
  console.log('🚀 Civic Issue Reporter Server Started!');
  console.log('========================================');
  console.log(`\n📍 Local Access:`);
  console.log(`   Citizens Portal: http://localhost:${PORT}`);
  console.log(`   Admin Dashboard: http://localhost:${PORT}/admin.html`);
  console.log(`   API Endpoints:   http://localhost:${PORT}/api/issues`);
  console.log(`\n🌐 Network Access:`);
  console.log(`   Server is listening on all network interfaces`);
  console.log(`   Others on your network can access using your IP address`);
  console.log('\n========================================\n');
});
