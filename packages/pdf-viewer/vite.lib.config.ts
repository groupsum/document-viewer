import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Defines the build configuration for external library consumption
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ReactTailwindPDFViewer',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      // Externalize peer dependencies to ensure the consumer application
      // provides these, minimizing bundle footprint drastically.
      external: ['react', 'react-dom', 'react-pdf', 'lucide-react'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-pdf': 'ReactPDF',
          'lucide-react': 'Lucide'
        }
      }
    }
  }
});
