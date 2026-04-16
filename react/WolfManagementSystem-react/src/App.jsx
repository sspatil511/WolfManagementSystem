import { Home } from './pages/Home/Home';
import { Navbar } from './components/ui/navbar';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/Auth/LoginPage';
import { SignupPage } from './pages/Auth/SignupPage';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, userLoading } = useAuth();

  if (userLoading) {

    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-sm text-muted-foreground'>Loading...</p>
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;

};


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App
