// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract SmartTorrent {
    enum TorrentCategory { NEUTRAL, MALWARE, COPYRIGHTVIOLATION }

    mapping(address => Voter) public voters;

    // TODO: Mehrere Hashes zulassen, damit Abstimmungen parallel laufen können
    Proposal public proposal;

    TorrentCategory result;

    struct Voter {
        bool voted;
    }

    struct Proposal {
        bytes32 torrentHash;

        // TODO: Hash Map oder so...
        uint neutralCount;
        uint malwareCount;
        uint copyrightCount;
    }

    // Hash example: 0xa582e8c28249fe7d7990bfa0afebd2da9185a9f831d4215b4efec74f355b301a
    constructor(bytes32 _torrentHash) {
        proposal.torrentHash = _torrentHash;
    }

    function vote(bytes32 _torrentHash, TorrentCategory category) external {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "already voted");
        require(proposal.torrentHash == _torrentHash, "wrong hash");

        sender.voted = true;
        
        if (category == TorrentCategory.MALWARE) {
            proposal.malwareCount++;
        } else if (category == TorrentCategory.COPYRIGHTVIOLATION){
            proposal.copyrightCount++;
        } else {
            proposal.neutralCount++;
        } 
    }

    function evaluateVoting() public uniqueResult() returns (TorrentCategory) {
        TorrentCategory temporaryResult = TorrentCategory.NEUTRAL;
        uint maxCount = proposal.neutralCount;

        if (proposal.malwareCount > maxCount) {
            temporaryResult = TorrentCategory.MALWARE;
        }
        
        if (proposal.copyrightCount > maxCount) {
            temporaryResult = TorrentCategory.COPYRIGHTVIOLATION;
        }

        result = temporaryResult;
        return result;
    }

    // TODO: Überprüfen ob ein eindeutiges Resultat vorhanden ist
    modifier uniqueResult() {
        require(true == true, "No unique result possible. More votes are required.");
        _;
    }
}