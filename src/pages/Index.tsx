import { useState } from 'react';
import Terminal from '@/components/Terminal';
import WelcomeDialog from '@/components/WelcomeDialog';

const Index = () => {
  const [showDialog, setShowDialog] = useState(false);

  const handleBootComplete = () => {
    setShowDialog(true);
  };

  return (
    <>
      <WelcomeDialog isOpen={showDialog} setIsOpen={setShowDialog} />
      <Terminal onBootComplete={handleBootComplete} />
    </>
  );
};

export default Index;
