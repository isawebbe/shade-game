import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import ShadeGame from './shadegame.jsx'; // Import your game component

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShadeGame /> {/* Render your game instead of App */}
  </StrictMode>,
);
