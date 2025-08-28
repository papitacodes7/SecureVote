import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
// import { useAnchorBallot, useIsTokenUsed } from '../hooks/useSecureVote';
import { encryptBallot, createBallotHash, createTokenHash, isValidTokenFormat } from '../utils/crypto';
// import { useAccount } from 'wagmi';

interface VoteProps {}

const Vote: React.FC<VoteProps> = () => {
  const [token, setToken] = useState('');
  const [ballot, setBallot] = useState('');
  const [electionId, setElectionId] = useState(1); // Default to election 1
  const [showQrReader, setShowQrReader] = useState(false);
  const [encryptedData, setEncryptedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Mock Web3 connection for demo
  const isConnected = true;
  const tokenIsUsed = false;
  const isPending = false;
  const isConfirming = false;
  const isSuccess = !!txHash;

  const handleQrScan = (result: string | null) => {
    if (result) {
      setToken(result);
      setShowQrReader(false);
    }
  };

  const handleSubmitVote = async () => {
    if (!token || !ballot) {
      alert('Please provide both token and ballot');
      return;
    }

    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!isValidTokenFormat(token)) {
      alert('Invalid token format. Token must be a valid hex string.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Encrypt ballot
      const encrypted = await encryptBallot(ballot);
      setEncryptedData(encrypted);
      
      // Calculate hashes
      const ballotHash = await createBallotHash(encrypted.ciphertext);
      const tokenHash = await createTokenHash(token);
      
      console.log('Encrypted Ballot:', encrypted.ciphertext);
      console.log('Ballot Hash:', ballotHash);
      console.log('Token Hash:', tokenHash);
      
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTxHash('0x' + Math.random().toString(16).substr(2, 40));
      
    } catch (error) {
      console.error('Error submitting vote:', error);
      setError('Error submitting vote: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="vote-page" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Cast Your Vote</h1>
      
      {!isConnected && (
        <div style={{ marginBottom: '20px', padding: '15px', background: '#fff3cd', borderRadius: '4px', border: '1px solid #ffeaa7' }}>
          <p style={{ margin: 0, color: '#856404' }}>
            Please connect your wallet to cast a vote.
          </p>
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="electionId">Election ID:</label>
        <input
          id="electionId"
          type="number"
          value={electionId}
          onChange={(e) => setElectionId(parseInt(e.target.value) || 1)}
          min="1"
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', marginTop: '5px' }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="token">One-time Token:</label>
        <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
          <input
            id="token"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your voting token (0x...)"
            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'monospace' }}
          />
          <button
            onClick={() => setShowQrReader(!showQrReader)}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', background: '#f0f0f0' }}
          >
            {showQrReader ? 'Close QR' : 'Scan QR'}
          </button>
        </div>
        {token && tokenIsUsed && (
          <p style={{ color: '#dc3545', fontSize: '14px', margin: '5px 0 0 0' }}>
            ⚠️ This token has already been used!
          </p>
        )}
      </div>

      {showQrReader && (
        <div style={{ marginBottom: '20px' }}>
          <QrReader
            onResult={(result) => handleQrScan(result?.getText() || null)}
            constraints={{ width: 300, height: 300 }}
          />
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="ballot">Your Vote:</label>
        <textarea
          id="ballot"
          value={ballot}
          onChange={(e) => setBallot(e.target.value)}
          placeholder="Enter your vote (e.g., Candidate A, Option 1, etc.)"
          rows={4}
          style={{ 
            width: '100%', 
            padding: '10px', 
            borderRadius: '4px', 
            border: '1px solid #ccc',
            marginTop: '5px',
            resize: 'vertical'
          }}
        />
      </div>

      <button
        onClick={handleSubmitVote}
        disabled={isLoading || !token || !ballot || !isConnected || tokenIsUsed}
        style={{
          padding: '15px 30px',
          borderRadius: '4px',
          border: 'none',
          background: (isLoading || !isConnected || tokenIsUsed) ? '#ccc' : '#007bff',
          color: 'white',
          cursor: (isLoading || !isConnected || tokenIsUsed) ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          width: '100%'
        }}
      >
        {isLoading ? 'Submitting Vote...' : 'Submit Vote'}
      </button>

      {error && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f8d7da', borderRadius: '4px', border: '1px solid #f5c6cb' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#721c24' }}>Error</h4>
          <p style={{ margin: 0, color: '#721c24', fontSize: '14px' }}>
            {error}
          </p>
        </div>
      )}

      {isSuccess && txHash && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#d4edda', borderRadius: '4px', border: '1px solid #c3e6cb' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#155724' }}>Vote Submitted Successfully!</h3>
          <div style={{ marginBottom: '10px' }}>
            <strong>Transaction Hash:</strong>
            <p style={{ fontFamily: 'monospace', fontSize: '14px', wordBreak: 'break-all', margin: '5px 0', color: '#155724' }}>
              {txHash}
            </p>
          </div>
          {encryptedData && (
            <div style={{ marginTop: '15px' }}>
              <strong>Encryption Details:</strong>
              <div style={{ fontSize: '12px', color: '#155724', marginTop: '5px' }}>
                <p>Your vote has been encrypted before being hashed and stored on blockchain.</p>
                <p><strong>Keep your encryption key safe:</strong></p>
                <p style={{ fontFamily: 'monospace', fontSize: '11px', wordBreak: 'break-all', background: '#c3e6cb', padding: '5px', borderRadius: '3px' }}>
                  Key: {encryptedData.key}
                </p>
                <p style={{ fontFamily: 'monospace', fontSize: '11px', wordBreak: 'break-all', background: '#c3e6cb', padding: '5px', borderRadius: '3px' }}>
                  IV: {encryptedData.iv}
                </p>
              </div>
            </div>
          )}
          <p style={{ fontSize: '12px', color: '#155724', margin: '10px 0 0 0' }}>
            Your vote has been anchored on the blockchain. Save this transaction hash for verification.
          </p>
        </div>
      )}
    </div>
  );
};

export default Vote;
