// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/// @title VeriChain - wallet-based DigiLocker: per-user documents, on-chain proofs, verification, revocation
contract VeriChain {
    struct Document {
        string hash;        // e.g., SHA-256 hex (or IPFS CID hash preferred)
        string name;        // filename or title
        uint256 timestamp;  // block time when stored
        string cid;         // optional: IPFS CID for off-chain content
    }

    struct Meta {
        address owner;
        uint256 timestamp;
        string name;
        string cid;
        bool exists;
    }

    // Per-owner storage
    mapping(address => Document[]) private _docsOf;

    // Index by hash for quick verification
    mapping(string => Meta) private _metaByHash;

    // Revocation flags by hash
    mapping(string => bool) private _revoked;

    event DocumentStored(address indexed owner, string hash, string name, string cid, uint256 timestamp);
    event DocumentRevoked(address indexed owner, string hash, uint256 timestamp);

    /// Store a new document for msg.sender (hash must be unique)
    function storeDocument(string calldata fileHash, string calldata name, string calldata cid) external {
        require(bytes(fileHash).length > 0, "hash required");
        require(!_metaByHash[fileHash].exists, "hash already exists");

        Document memory d = Document({
            hash: fileHash,
            name: name,
            timestamp: block.timestamp,
            cid: cid
        });

        _docsOf[msg.sender].push(d);
        _metaByHash[fileHash] = Meta({
            owner: msg.sender,
            timestamp: d.timestamp,
            name: name,
            cid: cid,
            exists: true
        });

        emit DocumentStored(msg.sender, fileHash, name, cid, d.timestamp);
    }

    /// Get all documents of the caller
    function getMyDocuments() external view returns (Document[] memory) {
        return _docsOf[msg.sender];
    }

    /// Get all documents of a specific wallet (for verifiers/admin tools)
    function getDocumentsByOwner(address owner) external view returns (Document[] memory) {
        return _docsOf[owner];
    }

    /// Verify by hash
    function verifyByHash(string calldata fileHash)
        external
        view
        returns (bool exists, address owner, uint256 timestamp, string memory name, string memory cid, bool revoked)
    {
        Meta memory m = _metaByHash[fileHash];
        if (!m.exists) return (false, address(0), 0, "", "", false);
        return (true, m.owner, m.timestamp, m.name, m.cid, _revoked[fileHash]);
    }

    /// Revoke a document (only the owner who stored it)
    function revokeDocument(string calldata fileHash) external {
        Meta memory m = _metaByHash[fileHash];
        require(m.exists, "not found");
        require(m.owner == msg.sender, "not owner");
        require(!_revoked[fileHash], "already revoked");
        _revoked[fileHash] = true;
        emit DocumentRevoked(msg.sender, fileHash, block.timestamp);
    }

    /// Check if revoked
    function isRevoked(string calldata fileHash) external view returns (bool) {
        return _revoked[fileHash];
    }
}
