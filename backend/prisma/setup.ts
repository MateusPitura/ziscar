import { config } from 'dotenv';

// This is necessary to configure correctly the unit tests
const path = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
config({ path, override: true });

module.exports = async function () {};
