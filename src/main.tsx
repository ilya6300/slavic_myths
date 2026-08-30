import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { bootstrapGame } from './bootstrap/gameBootstrap';
import { App } from './ui/App';
import './ui/index.css';

async function main(): Promise<void> {
  await bootstrapGame();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void main();
