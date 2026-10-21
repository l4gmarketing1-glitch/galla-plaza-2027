import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ base:process.env.DEPLOY_BASE||'/', plugins:[react()], build:{target:'es2022'}, server:{host:'127.0.0.1'} });
