const db = require('../config/connection');
const { User } = require('../models');
const cleanDB = require('./cleanDB');
const userSeeds = require('./userSeeds.json');

db.once('open', async () => {
  try {
    await cleanDB('User', 'users')
    await User.create(userSeeds);

    console.log('all done!');
    process.exit(0);
  } catch (err) {
    throw err;
  }
});