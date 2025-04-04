
import React from 'react';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 
import { useNavigate } from 'react-router-dom'; 
import PageWrapper from '../components/PageWrapper'; 

const Welcome = () => {
  const navigate = useNavigate(); 

  
  const handleJoinNow = () => {
    navigate('/login'); 
  };

  return (
    <PageWrapper> {}
      <div className="min-h-screen bg-background text-text flex flex-col justify-between">
        <Navbar /> {}

        <main className="flex-grow flex items-center justify-center"> {}
          <div className="bg-panel rounded-xl p-10 max-w-3xl text-center shadow-lg">
            {}
            <p className="text-lg mb-6">
              Welcome to the LocalVibe HUB website. The website made by people for people.
              Smth like that. In the final version, the text will be different. It will be some welcoming
              text to ask people to register and start looking for or creating events.
            </p>

            {}
            <button
              onClick={handleJoinNow} 
              className="mt-4 bg-accent text-text-on-light px-6 py-3 rounded-xl font-semibold hover:bg-opacity-80"
            >
              Join Now
            </button>
          </div>
        </main>

        <Footer /> {}
      </div>
    </PageWrapper>
  );
};

export default Welcome;
