import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import SiteLayout from './layouts/SiteLayout';
import HomePage from './pages/home/HomePage';
import RootFindingPage from "./pages/root-finding/RootFindingPage";
import { LangProvider } from './app/i18n/LangProvider';


createRoot(document.getElementById('root')!).render(
  <LangProvider>
  <BrowserRouter>
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/root-finding" element={<RootFindingPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
  </LangProvider>
);
