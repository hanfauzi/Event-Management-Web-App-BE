import 'dotenv/config';
import App from '../src/app';

const app = new App();

// ✅ Export handler supaya Vercel bisa handle request
export default app.app;