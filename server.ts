import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import app from './src/backend/app';

const PORT = 3000;

async function bootstrap() {
  // Integrate Vite for frontend assets serving
  if (process.env.NODE_ENV !== 'production') {
    console.log('Mode: Development. Mounting Vite Dev Server middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Mode: Production. Serving static build from dist folder...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath)); // Serve static files
    
    // In SPA, serve index.html for all undefined routes as fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Development: http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal server boot error:', err);
  process.exit(1);
});
