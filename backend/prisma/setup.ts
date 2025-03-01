import { config } from 'dotenv';

config({ path: '.env.test.local', override: true });

module.exports = async function () {};
