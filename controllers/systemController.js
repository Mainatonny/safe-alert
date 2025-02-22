const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET /api/logs
const getLogs = async (req, res) => {
  try {
    // For demonstration, assume logs are stored in a file named logs.txt at the project root
    const logsPath = path.join(__dirname, '..', 'logs.txt');
    if (!fs.existsSync(logsPath)) {
      return res.status(200).json([]); // Return empty array if no logs exist
    }
    const logsContent = fs.readFileSync(logsPath, 'utf8');
    // Assume logs are stored line by line
    const logs = logsContent.split('\n').filter(line => line.trim() !== '');
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: 'Failed to fetch logs', details: error.message });
  }
};

// PUT /api/security/changePassword
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // Provided by authentication middleware

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ message: 'Failed to update password', details: error.message });
  }
};

// GET /api/server/status
const getServerStatus = async (req, res) => {
  try {
    const status = {
      uptime: process.uptime(), // in seconds
      memoryUsage: process.memoryUsage(),
      timestamp: new Date(),
    };
    res.status(200).json(status);
  } catch (error) {
    console.error("Error fetching server status:", error);
    res.status(500).json({ message: 'Failed to fetch server status', details: error.message });
  }
};

// POST /api/backup
const runBackup = async (req, res) => {
  try {
    // For demonstration, backup data is simulated and written to a backup.json file
    const backupData = {
      backupTime: new Date(),
      message: "Backup completed successfully",
    };
    const backupPath = path.join(__dirname, '..', 'backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
    res.status(200).json({ message: 'Backup completed successfully' });
  } catch (error) {
    console.error("Backup error:", error);
    res.status(500).json({ message: 'Backup failed', details: error.message });
  }
};

// POST /api/restore
const runRestore = async (req, res) => {
  try {
    const backupPath = path.join(__dirname, '..', 'backup.json');
    if (!fs.existsSync(backupPath)) {
      return res.status(400).json({ message: 'No backup file found' });
    }
    const backupData = fs.readFileSync(backupPath, 'utf8');
    const data = JSON.parse(backupData);
    res.status(200).json({ message: 'Restore completed successfully', data });
  } catch (error) {
    console.error("Restore error:", error);
    res.status(500).json({ message: 'Restore failed', details: error.message });
  }
};

module.exports = {
  getLogs,
  changePassword,
  getServerStatus,
  runBackup,
  runRestore,
};
