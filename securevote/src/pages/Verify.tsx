import React, { useState } from 'react';

interface VerifyProps {}

interface TransactionDetails {
  hash: string;
  blockNumber: string;
  timestamp: string;
  gasUsed: string;
  status: 'success' | 'failed';
  ballotHash?: string;
  tokenHash?: string;
}

const Verify: React.FC<VerifyProps> = () => {
  const [txHash, setTxHash] = useState('');
  const [ballotHash, setBallotHash] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txDetails, setTxDetails] = useState<TransactionDetails | null>(null);
  const [auditResults, setAuditResults] = useState<{ found: boolean; message: string } | null>(null);

  const handleVerifyTransaction = async () => {
    if (!txHash.trim()) {
      alert('Please enter a transaction hash');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual blockchain query
      // Simulate fetching transaction details
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockTxDetails: TransactionDetails = {
        hash: txHash,
        blockNumber: Math.floor(Math.random() * 1000000).toString(),
        timestamp: new Date().toISOString(),
        gasUsed: '21000',
        status: 'success',
        ballotHash: '0x' + Math.random().toString(16).substr(2, 64),
        tokenHash: '0x' + Math.random().toString(16).substr(2, 64)
      };
      
      setTxDetails(mockTxDetails);
    } catch (error) {
      console.error('Error verifying transaction:', error);
      alert('Error verifying transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckAuditTrail = async () => {
    if (!ballotHash.trim()) {
      alert('Please enter a ballot hash');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual audit trail check
      // Simulate checking audit trail
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const found = Math.random() > 0.3; // 70% chance of finding the ballot
      setAuditResults({
        found,
        message: found 
          ? 'Ballot hash found in audit trail. Your vote has been recorded.' 
          : 'Ballot hash not found in audit trail. Please check the hash or contact support.'
      });
    } catch (error) {
      console.error('Error checking audit trail:', error);
      alert('Error checking audit trail');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="verify-page" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Verify Your Vote</h1>
      
      {/* Transaction Verification Section */}
      <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <h2>Verify Transaction</h2>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          Enter your transaction hash to verify that your vote was successfully recorded on the blockchain.
        </p>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            placeholder="Enter transaction hash (0x...)"
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontFamily: 'monospace'
            }}
          />
          <button
            onClick={handleVerifyTransaction}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              border: 'none',
              background: isLoading ? '#ccc' : '#28a745',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </div>

        {txDetails && (
          <div style={{ 
            background: txDetails.status === 'success' ? '#d4edda' : '#f8d7da', 
            padding: '15px', 
            borderRadius: '4px',
            marginTop: '15px'
          }}>
            <h3>Transaction Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px', fontFamily: 'monospace', fontSize: '14px' }}>
              <strong>Hash:</strong>
              <span>{txDetails.hash}</span>
              
              <strong>Block Number:</strong>
              <span>{txDetails.blockNumber}</span>
              
              <strong>Timestamp:</strong>
              <span>{formatTimestamp(txDetails.timestamp)}</span>
              
              <strong>Gas Used:</strong>
              <span>{txDetails.gasUsed}</span>
              
              <strong>Status:</strong>
              <span style={{ 
                color: txDetails.status === 'success' ? '#28a745' : '#dc3545',
                fontWeight: 'bold'
              }}>
                {txDetails.status.toUpperCase()}
              </span>
              
              {txDetails.ballotHash && (
                <>
                  <strong>Ballot Hash:</strong>
                  <span>{txDetails.ballotHash}</span>
                </>
              )}
              
              {txDetails.tokenHash && (
                <>
                  <strong>Token Hash:</strong>
                  <span>{txDetails.tokenHash}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Audit Trail Section */}
      <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <h2>Check Audit Trail</h2>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          Enter your ballot hash to verify it appears in the public audit trail.
        </p>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            value={ballotHash}
            onChange={(e) => setBallotHash(e.target.value)}
            placeholder="Enter ballot hash (0x...)"
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontFamily: 'monospace'
            }}
          />
          <button
            onClick={handleCheckAuditTrail}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              border: 'none',
              background: isLoading ? '#ccc' : '#17a2b8',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Checking...' : 'Check Audit'}
          </button>
        </div>

        {auditResults && (
          <div style={{ 
            background: auditResults.found ? '#d4edda' : '#fff3cd', 
            padding: '15px', 
            borderRadius: '4px',
            marginTop: '15px',
            border: auditResults.found ? '1px solid #c3e6cb' : '1px solid #ffeaa7'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: auditResults.found ? '#155724' : '#856404' }}>
              {auditResults.found ? '✓ Ballot Found' : '⚠ Ballot Not Found'}
            </h4>
            <p style={{ margin: 0, color: auditResults.found ? '#155724' : '#856404' }}>
              {auditResults.message}
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div style={{ marginTop: '30px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
        <h3>How to Use</h3>
        <ol style={{ paddingLeft: '20px' }}>
          <li><strong>Transaction Verification:</strong> Use the transaction hash you received after voting to confirm your vote was recorded.</li>
          <li><strong>Audit Trail Check:</strong> Use the ballot hash to verify your encrypted vote appears in the public audit trail.</li>
          <li><strong>Privacy:</strong> The ballot hash doesn't reveal your actual vote, only that it was recorded.</li>
        </ol>
      </div>
    </div>
  );
};

export default Verify;
