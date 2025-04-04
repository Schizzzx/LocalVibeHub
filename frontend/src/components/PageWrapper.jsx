import { motion } from 'framer-motion';


const pageVariants = {
  initial: { opacity: 0, y: 20 },    
  animate: { opacity: 1, y: 0 },     
  exit: { opacity: 0, y: -20 },      
};


const pageTransition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
  duration: 0.4, 
};


export default function PageWrapper({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen flex flex-col"
    >
      {children}
    </motion.div>
  );
}
