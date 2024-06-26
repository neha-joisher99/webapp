const basicAuth = require('basic-auth');
const db = require('./models');
const bcrypt = require('bcrypt');
const logger=require('./logger/index.js')

async function validateUser(req, res, next) {
  const credentials = basicAuth(req);

  if (!credentials || !credentials.name || !credentials.pass) {
    logger.error(`Unauthorized User: Missing credentials`)
    return res.status(401).json({ message: 'Unauthorized: Missing credentials' });
  }

  const username = credentials.name;
  const password = credentials.pass;

  try {
    const user = await db.account.findOne({ where: { email: username } });

    if (!user) {
      logger.error(`Authentication failed for ${username}: User not found`)
      return res.status(401).json({ message: 'Authentication failed: User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      logger.error(`Authentication failed for ${username}: Incorrect password`)
      return res.status(401).json({ message: 'Authentication failed: Incorrect password' });
    }
    
    /*if (user.password !== hashedPassword) {
      return res.status(401).json({ message: 'Authentication failed: Incorrect password' });
    }*/

    req.user = user;
    next();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error authenticating user' });
  }
}

module.exports = validateUser;  