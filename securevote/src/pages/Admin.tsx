import React, { useState } from 'react';

interface AdminProps {}

interface ElectionConfig {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  candidates: string[];
}

interface Token {
  id: string;
  token: string;
  qrCode: string;
  used: boolean;
}

const Admin: React.FC<AdminProps> = () => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'config' | 'tally'>('tokens');
  const [electionConfig, setElectionConfig] = useState<ElectionConfig>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    candidates: ['']
  });
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenCount, setTokenCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tallyResults, setTallyResults] = useState<any>(null);

  // Generate cryptographically secure random token
  const generateSecureToken = (): string => {
    const array = new Uint8Array(32); // 32 bytes = 256 bits
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  const generateTokens = async () => {
    setIsGenerating(true);
    try {
      const newTokens: Token[] = [];
      for (let i = 0; i < tokenCount; i++) {
        const token = generateSecureToken();
        const qrCode = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="white"/><text x="50" y="50" text-anchor="middle" dominant-baseline="middle" font-size="8">${token.substring(0, 8)}...</text></svg>`;
        
        newTokens.push({
          id: `token-${i + 1}`,
          token,
          qrCode,
          used: false
        });
        
        // Small delay to show progress
        if (i % 5 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      setTokens(newTokens);
    } catch (error) {
      console.error('Error generating tokens:', error);
      alert('Error generating tokens');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadTokensCSV = () => {
    const csvContent = 'ID,Token,Used\n' + 
      tokens.map(token => `${token.id},${token.token},${token.used}`).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voting-tokens.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleConfigChange = (field: keyof ElectionConfig, value: string | string[]) => {
    setElectionConfig(prev => ({ ...prev, [field]: value }));
  };

  const addCandidate = () => {
    setElectionConfig(prev => ({
      ...prev,
      candidates: [...prev.candidates, '']
    }));
  };

  const updateCandidate = (index: number, value: string) => {
    setElectionConfig(prev => ({
      ...prev,
      candidates: prev.candidates.map((candidate, i) => i === index ? value : candidate)
    }));
  };

  const removeCandidate = (index: number) => {
    setElectionConfig(prev => ({
      ...prev,
      candidates: prev.candidates.filter((_, i) => i !== index)
    }));
  };

  const saveElectionConfig = () => {
    const configJson = JSON.stringify(electionConfig, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'election-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const calculateTally = async () => {
    // TODO: Implement actual tally calculation from blockchain
    // This would fetch all votes, decrypt them, and calculate results
    
    // Simulate tally calculation
    const mockResults = {
      totalVotes: Math.floor(Math.random() * 1000) + 100,
      candidates: electionConfig.candidates.filter(c => c).map(candidate => ({
        name: candidate,
        votes: Math.floor(Math.random() * 300) + 50,
        percentage: Math.floor(Math.random() * 40) + 10
      })),
      tallyHash: '0x' + Math.random().toString(16).substr(2, 64),
      timestamp: new Date().toISOString()
    };
    
    setTallyResults(mockResults);
  };

  const publishTallyHash = () => {
    if (!tallyResults) return;
    
    // TODO: Publish tally hash to blockchain
    alert(`Tally hash ${tallyResults.tallyHash} published to blockchain!`);
  };

  const tabStyle = (tabName: string) => ({
    padding: '10px 20px',
    border: 'none',
    background: activeTab === tabName ? '#007bff' : '#f8f9fa',
    color: activeTab === tabName ? 'white' : '#333',
    cursor: 'pointer',
    borderRadius: activeTab === tabName ? '4px 4px 0 0' : '0'
  });

  return (
    <div className="admin-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Admin Dashboard</h1>
      
      {/* Tab Navigation */}
      <div style={{ borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
        <button style={tabStyle('tokens')} onClick={() => setActiveTab('tokens')}>
          Token Management
        </button>
        <button style={tabStyle('config')} onClick={() => setActiveTab('config')}>
          Election Config
        </button>
        <button style={tabStyle('tally')} onClick={() => setActiveTab('tally')}>
          Results & Tally
        </button>
      </div>

      {/* Token Management Tab */}
      {activeTab === 'tokens' && (
        <div>
          <h2>Generate Voting Tokens</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Number of Tokens:</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="number"
                value={tokenCount}
                onChange={(e) => setTokenCount(parseInt(e.target.value) || 0)}
                min="1"
                max="10000"
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100px' }}
              />
              <button
                onClick={generateTokens}
                disabled={isGenerating}
                style={{
                  padding: '10px 20px',
                  borderRadius: '4px',
                  border: 'none',
                  background: isGenerating ? '#ccc' : '#28a745',
                  color: 'white',
                  cursor: isGenerating ? 'not-allowed' : 'pointer'
                }}
              >
                {isGenerating ? 'Generating...' : 'Generate Tokens'}
              </button>
              {tokens.length > 0 && (
                <button
                  onClick={downloadTokensCSV}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '4px',
                    border: '1px solid #007bff',
                    background: 'white',
                    color: '#007bff',
                    cursor: 'pointer'
                  }}
                >
                  Download CSV
                </button>
              )}
            </div>
          </div>

          {tokens.length > 0 && (
            <div>
              <h3>Generated Tokens ({tokens.length})</h3>
              <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Token (First 16 chars)</th>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.map((token) => (
                      <tr key={token.id}>
                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{token.id}</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #eee', fontFamily: 'monospace' }}>
                          {token.token.substring(0, 16)}...
                        </td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                          <span style={{ 
                            color: token.used ? '#dc3545' : '#28a745',
                            fontWeight: 'bold'
                          }}>
                            {token.used ? 'Used' : 'Available'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Election Config Tab */}
      {activeTab === 'config' && (
        <div>
          <h2>Election Configuration</h2>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Election Title:</label>
              <input
                type="text"
                value={electionConfig.title}
                onChange={(e) => handleConfigChange('title', e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                placeholder="Enter election title"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
              <textarea
                value={electionConfig.description}
                onChange={(e) => handleConfigChange('description', e.target.value)}
                rows={4}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                placeholder="Enter election description"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Start Date:</label>
                <input
                  type="datetime-local"
                  value={electionConfig.startDate}
                  onChange={(e) => handleConfigChange('startDate', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>End Date:</label>
                <input
                  type="datetime-local"
                  value={electionConfig.endDate}
                  onChange={(e) => handleConfigChange('endDate', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Candidates:</label>
              {electionConfig.candidates.map((candidate, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    value={candidate}
                    onChange={(e) => updateCandidate(index, e.target.value)}
                    placeholder={`Candidate ${index + 1} name`}
                    style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                  {electionConfig.candidates.length > 1 && (
                    <button
                      onClick={() => removeCandidate(index)}
                      style={{
                        padding: '10px',
                        borderRadius: '4px',
                        border: '1px solid #dc3545',
                        background: 'white',
                        color: '#dc3545',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addCandidate}
                style={{
                  padding: '10px 20px',
                  borderRadius: '4px',
                  border: '1px solid #28a745',
                  background: 'white',
                  color: '#28a745',
                  cursor: 'pointer'
                }}
              >
                Add Candidate
              </button>
            </div>

            <button
              onClick={saveElectionConfig}
              style={{
                padding: '15px 30px',
                borderRadius: '4px',
                border: 'none',
                background: '#007bff',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* Results & Tally Tab */}
      {activeTab === 'tally' && (
        <div>
          <h2>Election Results & Tally</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={calculateTally}
              style={{
                padding: '15px 30px',
                borderRadius: '4px',
                border: 'none',
                background: '#17a2b8',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                marginRight: '10px'
              }}
            >
              Calculate Tally
            </button>
            
            {tallyResults && (
              <button
                onClick={publishTallyHash}
                style={{
                  padding: '15px 30px',
                  borderRadius: '4px',
                  border: 'none',
                  background: '#28a745',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Publish Tally Hash
              </button>
            )}
          </div>

          {tallyResults && (
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
              <h3>Election Results</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <p><strong>Total Votes:</strong> {tallyResults.totalVotes}</p>
                <p><strong>Tally Hash:</strong> <code>{tallyResults.tallyHash}</code></p>
                <p><strong>Calculated At:</strong> {new Date(tallyResults.timestamp).toLocaleString()}</p>
              </div>

              <h4>Candidate Results:</h4>
              <div style={{ display: 'grid', gap: '10px' }}>
                {tallyResults.candidates.map((candidate: any, index: number) => (
                  <div key={index} style={{ 
                    padding: '15px', 
                    border: '1px solid #eee', 
                    borderRadius: '4px',
                    background: '#f8f9fa'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{candidate.name}</strong>
                      <div>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{candidate.votes} votes</span>
                        <span style={{ marginLeft: '10px', color: '#666' }}>({candidate.percentage}%)</span>
                      </div>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '8px', 
                      background: '#e9ecef', 
                      borderRadius: '4px',
                      marginTop: '8px'
                    }}>
                      <div style={{ 
                        width: `${candidate.percentage}%`, 
                        height: '100%', 
                        background: '#007bff', 
                        borderRadius: '4px'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
