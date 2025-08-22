import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import SiteLayout from './layouts/SiteLayout';
import HomePage from './pages/HomePage';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
