import React, { useState } from 'react';
// import { WagmiProvider } from 'wagmi';
// import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { config } from './config/web3';
import Vote from './pages/Vote';
import Verify from './pages/Verify';
import Admin from './pages/Admin';
// import '@rainbow-me/rainbowkit/styles.css';
import './App.css';

// const queryClient = new QueryClient();

type Page = 'vote' | 'verify' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('vote');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'vote':
        return <Vote />;
      case 'verify':
        return <Verify />;
      case 'admin':
        return <Admin />;
      default:
        return <Vote />;
    }
  };

  return (
    <div className="App">
      <header style={{ 
        padding: '1rem 2rem',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#333' }}>SecureVote</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
            Blockchain-based Secure Voting System (Demo)
          </p>
        </div>
        <div style={{ padding: '10px 20px', background: '#28a745', color: 'white', borderRadius: '20px', fontSize: '14px' }}>
          Wallet Connected (Demo)
        </div>
      </header>
      
      <nav style={{
        padding: '1rem 2rem',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setCurrentPage('vote')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: currentPage === 'vote' ? '#007bff' : '#e9ecef',
              color: currentPage === 'vote' ? 'white' : '#333'
            }}
          >
            Cast Vote
          </button>
          <button
            onClick={() => setCurrentPage('verify')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: currentPage === 'verify' ? '#007bff' : '#e9ecef',
              color: currentPage === 'verify' ? 'white' : '#333'
            }}
          >
            Verify Vote
          </button>
          <button
            onClick={() => setCurrentPage('admin')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: currentPage === 'admin' ? '#007bff' : '#e9ecef',
              color: currentPage === 'admin' ? 'white' : '#333'
            }}
          >
            Admin
          </button>
        </div>
      </nav>

      <main>
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App;
