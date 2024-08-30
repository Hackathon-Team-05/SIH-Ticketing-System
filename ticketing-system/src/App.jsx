import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import PreLoader from './components/Home_Page_Components/PreLoader';

const App = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Navigate to other routes after preloader completes

  // Function to be called when preloader animation completes
  const handleAnimationComplete = () => {
    setLoading(false); // Set loading to false after preloader animation is done
    navigate('/home'); // Navigate to home after animation completes
  };

  return (
      <div className="app-container">
        {loading ? (
            <PreLoader onAnimationComplete={handleAnimationComplete} />
        ) : (
            <Outlet />  // Render the actual content only when loading is false
        )}
      </div>
  );
};

export default App;
