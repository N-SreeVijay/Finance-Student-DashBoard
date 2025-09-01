const express = require('express');
const router = express.Router();
const mockTransactions = require('../data/mockData'); 

const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  res.json(mockTransactions); 
});

module.exports = router;
