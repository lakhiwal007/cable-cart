import { useNavigate } from 'react-router-dom';
import { LogOut, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import Marketplace from "@/components/Marketplace";
import apiClient from "@/lib/apiClient";
import Header from '@/components/Header';

const MarketplacePage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType) {
      setUserType(storedUserType);
      fetchUserProfile();
    }
    // Check for logged-in user
    apiClient.getProfile().then(setUser).catch(() => setUser(null));
  }, []);

  const fetchUserProfile = async () => {
    try {
      const profile = await apiClient.getProfile();
      setUserEmail(profile.email);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.logout();
      navigate("/login");
    } catch (error) {
      console.error('Logout error:', error);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        title="Marketplace"
        onBack={() => navigate('/')} 
        logoSrc='cableCartLogo.png'
        rightContent={
          <>
            
            {userType === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center px-4 py-2 rounded-xl text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 transition-all duration-200"
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin Panel
              </button>
            )}
            {user && (
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
            )}
          </>
        }
      />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-8 px-1 sm:px-4 lg:px-8">
        <Marketplace />
      </main>
    </div>
  );
};

export default MarketplacePage; 