
import React from 'react';
import NavPanelLoggedIn from '../components/NavPanelLoggedIn';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      {}
      <NavPanelLoggedIn username="User" />

      <main className="flex-grow p-8 flex items-center justify-center">
        {}
        <motion.div
          className="text-center max-w-xl"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
        >
          <h1 className="text-3xl font-bold mb-4">FAQ</h1>
          {}
          <motion.p
            className="text-lg"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.3 }} 
          >
            Frequently Asked Questions will appear here soon. I added this page for perfectionism 
          </motion.p>
        </motion.div>
      </main>

      <Footer /> {}
    </div>
  );
};

export default FAQPage;
