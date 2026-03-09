import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreatePrompt from './pages/CreatePrompt';
import ViewPrompt from './pages/ViewPrompt';
import CategoryPage from './pages/CategoryPage';
import FavoritesPage from './pages/FavoritesPage';
import RecentPage from './pages/RecentPage';
import Layout from './components/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="create" element={<CreatePrompt />} />
          <Route path="prompt/:id" element={<ViewPrompt />} />
          <Route path="category/:categorySlug" element={<CategoryPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="recent" element={<RecentPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
