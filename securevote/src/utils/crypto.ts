// Crypto utilities for secure voting

// Generate cryptographically secure random bytes
export const generateSecureRandomBytes = (length: number): Uint8Array => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return array;
};

// Convert bytes to hex string
export const bytesToHex = (bytes: Uint8Array): string => {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Convert hex string to bytes
export const hexToBytes = (hex: string): Uint8Array => {
  const cleanHex = hex.replace('0x', '');
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
  }
  return bytes;
};

// Generate SHA256 hash of data
export const sha256Hash = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = new Uint8Array(hashBuffer);
  return '0x' + bytesToHex(hashArray);
};

// AES-GCM Encryption
interface EncryptionResult {
  ciphertext: string;
  iv: string;
  key: string;
}

export const encryptBallot = async (ballotData: string): Promise<EncryptionResult> => {
  try {
    // Generate a random 256-bit key
    const key = await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );

    // Generate a random IV (12 bytes for GCM)
    const iv = generateSecureRandomBytes(12);

    // Encode the ballot data
    const encoder = new TextEncoder();
    const data = encoder.encode(ballotData);

    // Encrypt the data
    const cipherBuffer = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      data
    );

    // Export the key for storage
    const exportedKey = await crypto.subtle.exportKey('raw', key);

    return {
      ciphertext: '0x' + bytesToHex(new Uint8Array(cipherBuffer)),
      iv: '0x' + bytesToHex(iv),
      key: '0x' + bytesToHex(new Uint8Array(exportedKey))
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt ballot data');
  }
};

// AES-GCM Decryption
export const decryptBallot = async (
  ciphertext: string, 
  iv: string, 
  keyHex: string
): Promise<string> => {
  try {
    // Convert hex strings back to bytes
    const cipherBytes = hexToBytes(ciphertext);
    const ivBytes = hexToBytes(iv);
    const keyBytes = hexToBytes(keyHex);

    // Import the key
    const key = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      {
        name: 'AES-GCM',
        length: 256
      },
      false,
      ['decrypt']
    );

    // Decrypt the data
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivBytes
      },
      key,
      cipherBytes
    );

    // Decode the result
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt ballot data');
  }
};

// Generate secure voting token
export const generateVotingToken = (): string => {
  const tokenBytes = generateSecureRandomBytes(32); // 256 bits
  return '0x' + bytesToHex(tokenBytes);
};

// Generate multiple voting tokens
export const generateVotingTokens = (count: number): string[] => {
  const tokens = [];
  for (let i = 0; i < count; i++) {
    tokens.push(generateVotingToken());
  }
  return tokens;
};

// Validate token format
export const isValidTokenFormat = (token: string): boolean => {
  // Check if it's a valid hex string of 64 characters (32 bytes) with 0x prefix
  const hexPattern = /^0x[a-fA-F0-9]{64}$/;
  return hexPattern.test(token);
};

// Validate hash format
export const isValidHashFormat = (hash: string): boolean => {
  // Check if it's a valid hex string of 64 characters (32 bytes) with 0x prefix
  const hexPattern = /^0x[a-fA-F0-9]{64}$/;
  return hexPattern.test(hash);
};

// Create ballot hash from encrypted ballot
export const createBallotHash = async (encryptedBallot: string): Promise<string> => {
  return await sha256Hash(encryptedBallot);
};

// Create token hash from token
export const createTokenHash = async (token: string): Promise<string> => {
  return await sha256Hash(token);
};

// Generate election tally hash
export const generateTallyHash = async (tallyData: any): Promise<string> => {
  const tallyString = JSON.stringify(tallyData, Object.keys(tallyData).sort());
  return await sha256Hash(tallyString);
};

// Entropy validation for tokens
export const validateTokenEntropy = (token: string): boolean => {
  if (!isValidTokenFormat(token)) return false;
  
  // Remove 0x prefix and convert to bytes
  const hexToken = token.substring(2);
  const bytes = hexToBytes('0x' + hexToken);
  
  // Calculate entropy - basic check for randomness
  const uniqueBytes = new Set(bytes).size;
  const entropyRatio = uniqueBytes / bytes.length;
  
  // Should have at least 70% unique bytes for good entropy
  return entropyRatio >= 0.7;
};
