import { useState } from 'react';
import { SnackbarProvider } from 'notistack';
import { Navbar } from './components/Navbar/Navbar';
import { SellNFT } from './components/SellNFT/SellNFT';
import { BuyNFT } from './components/BuyNFT/BuyNFT';

const App: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string | number>(1);

  return (
    <SnackbarProvider>
      <div className="bg-cyan-100 h-[100vh] w-[100vw]">
        <Navbar
          tabSelectorProps={{ selectedTab, onSelectTab: setSelectedTab }}
        />

        {selectedTab === 0 ? <BuyNFT /> : <SellNFT />}
      </div>
    </SnackbarProvider>
  );
};

export default App;
