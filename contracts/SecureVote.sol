// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SecureVote
 * @dev A smart contract for secure, verifiable voting with double-vote prevention
 * @notice This contract anchors vote hashes to the blockchain while maintaining voter privacy
 */
contract SecureVote {
    // Events
    event BallotAnchored(
        bytes32 indexed tokenHash,
        bytes32 indexed ballotHash,
        uint256 timestamp,
        address voter
    );
    
    event ElectionCreated(
        uint256 indexed electionId,
        string title,
        uint256 startTime,
        uint256 endTime
    );
    
    event TallyPublished(
        uint256 indexed electionId,
        bytes32 tallyHash,
        uint256 timestamp
    );

    // Structs
    struct Election {
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        address admin;
        bool tallyPublished;
        bytes32 tallyHash;
    }

    struct Vote {
        bytes32 ballotHash;
        uint256 timestamp;
        uint256 electionId;
        address voter;
    }

    // State variables
    mapping(bytes32 => bool) public usedTokens;
    mapping(bytes32 => Vote) public votes;
    mapping(uint256 => Election) public elections;
    mapping(uint256 => bytes32[]) public electionBallots;
    
    uint256 public currentElectionId;
    address public owner;
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    modifier onlyElectionAdmin(uint256 electionId) {
        require(elections[electionId].admin == msg.sender, "Only election admin can perform this action");
        _;
    }
    
    modifier electionExists(uint256 electionId) {
        require(elections[electionId].admin != address(0), "Election does not exist");
        _;
    }
    
    modifier electionActive(uint256 electionId) {
        Election memory election = elections[electionId];
        require(block.timestamp >= election.startTime, "Election has not started yet");
        require(block.timestamp <= election.endTime, "Election has ended");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Create a new election
     * @param title The title of the election
     * @param description The description of the election
     * @param startTime The start time of the election (Unix timestamp)
     * @param endTime The end time of the election (Unix timestamp)
     */
    function createElection(
        string memory title,
        string memory description,
        uint256 startTime,
        uint256 endTime
    ) external returns (uint256) {
        require(startTime < endTime, "Invalid time range");
        require(startTime > block.timestamp, "Start time must be in the future");
        
        currentElectionId++;
        
        elections[currentElectionId] = Election({
            title: title,
            description: description,
            startTime: startTime,
            endTime: endTime,
            admin: msg.sender,
            tallyPublished: false,
            tallyHash: bytes32(0)
        });
        
        emit ElectionCreated(currentElectionId, title, startTime, endTime);
        
        return currentElectionId;
    }

    /**
     * @dev Anchor a ballot hash to the blockchain using a one-time token
     * @param tokenHash The hash of the one-time voting token
     * @param ballotHash The hash of the encrypted ballot
     * @param electionId The ID of the election this vote belongs to
     */
    function anchorBallot(
        bytes32 tokenHash, 
        bytes32 ballotHash, 
        uint256 electionId
    ) 
        external 
        electionExists(electionId)
        electionActive(electionId)
    {
        // Check if token has already been used
        require(!usedTokens[tokenHash], "Token has already been used");
        
        // Check if ballot hash is not empty
        require(ballotHash != bytes32(0), "Invalid ballot hash");
        
        // Mark token as used
        usedTokens[tokenHash] = true;
        
        // Store the vote
        votes[tokenHash] = Vote({
            ballotHash: ballotHash,
            timestamp: block.timestamp,
            electionId: electionId,
            voter: msg.sender
        });
        
        // Add ballot hash to election's ballot list
        electionBallots[electionId].push(ballotHash);
        
        // Emit event
        emit BallotAnchored(tokenHash, ballotHash, block.timestamp, msg.sender);
    }

    /**
     * @dev Check if a token has been used
     * @param tokenHash The hash of the token to check
     * @return bool True if token has been used, false otherwise
     */
    function isTokenUsed(bytes32 tokenHash) external view returns (bool) {
        return usedTokens[tokenHash];
    }

    /**
     * @dev Get vote details by token hash
     * @param tokenHash The hash of the token
     * @return ballotHash The hash of the ballot
     * @return timestamp The timestamp when vote was cast
     * @return electionId The election ID
     * @return voter The address that cast the vote
     */
    function getVote(bytes32 tokenHash) 
        external 
        view 
        returns (bytes32 ballotHash, uint256 timestamp, uint256 electionId, address voter) 
    {
        Vote memory vote = votes[tokenHash];
        return (vote.ballotHash, vote.timestamp, vote.electionId, vote.voter);
    }

    /**
     * @dev Get all ballot hashes for an election
     * @param electionId The ID of the election
     * @return bytes32[] Array of all ballot hashes for the election
     */
    function getElectionBallots(uint256 electionId) 
        external 
        view 
        electionExists(electionId)
        returns (bytes32[] memory) 
    {
        return electionBallots[electionId];
    }

    /**
     * @dev Get election details
     * @param electionId The ID of the election
     * @return Election struct with all election details
     */
    function getElection(uint256 electionId) 
        external 
        view 
        electionExists(electionId)
        returns (Election memory) 
    {
        return elections[electionId];
    }

    /**
     * @dev Publish tally hash after election ends
     * @param electionId The ID of the election
     * @param tallyHash The hash of the final tally results
     */
    function publishTally(uint256 electionId, bytes32 tallyHash) 
        external 
        electionExists(electionId)
        onlyElectionAdmin(electionId)
    {
        Election storage election = elections[electionId];
        require(block.timestamp > election.endTime, "Election is still active");
        require(!election.tallyPublished, "Tally already published");
        require(tallyHash != bytes32(0), "Invalid tally hash");
        
        election.tallyHash = tallyHash;
        election.tallyPublished = true;
        
        emit TallyPublished(electionId, tallyHash, block.timestamp);
    }

    /**
     * @dev Get the number of votes cast in an election
     * @param electionId The ID of the election
     * @return uint256 Number of votes cast
     */
    function getVoteCount(uint256 electionId) 
        external 
        view 
        electionExists(electionId)
        returns (uint256) 
    {
        return electionBallots[electionId].length;
    }

    /**
     * @dev Check if a ballot hash exists in an election's audit trail
     * @param electionId The ID of the election
     * @param ballotHash The ballot hash to check
     * @return bool True if ballot hash exists in the audit trail
     */
    function ballotExists(uint256 electionId, bytes32 ballotHash) 
        external 
        view 
        electionExists(electionId)
        returns (bool) 
    {
        bytes32[] memory ballots = electionBallots[electionId];
        for (uint256 i = 0; i < ballots.length; i++) {
            if (ballots[i] == ballotHash) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Emergency function to pause voting (only owner)
     * @param electionId The ID of the election to modify
     * @param newEndTime New end time (set to current time to end immediately)
     */
    function emergencyEndElection(uint256 electionId, uint256 newEndTime) 
        external 
        onlyOwner 
        electionExists(electionId)
    {
        require(newEndTime >= block.timestamp, "End time must be current or future");
        elections[electionId].endTime = newEndTime;
    }

    /**
     * @dev Transfer ownership of the contract
     * @param newOwner Address of the new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }
}
