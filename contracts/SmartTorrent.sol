// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "TorrentBlackList.sol";

contract SmartTorrent {
    enum TorrentCategory { MALWARE, COPYRIGHTED }
    TorrentBlackList blackList;

    uint constant voteCountThreshold = 3; // 3 votes for testnet/demo. On mainnet, change to 15 votes
    uint256 constant voteTimeThreshold = 60; // 60s for testnet/demo. On mainnet, change to 86400s

    mapping(bytes32 => Proposal) internal proposals;

    struct Proposal {
        uint256 lastVoteTimestamp;
        address[] voters;
        mapping(address => bool) voted;
        mapping(TorrentCategory => uint) votes;
    }

    constructor (address _blacklist) {
        blackList = TorrentBlackList(_blacklist);
    }

    function vote(bytes32 _torrentHash, TorrentCategory _category) public {
        require(!proposals[_torrentHash].voted[msg.sender], "already voted");

        proposals[_torrentHash].voted[msg.sender] = true;
        proposals[_torrentHash].voters.push(msg.sender);
        proposals[_torrentHash].votes[_category]++;
        if (proposals[_torrentHash].lastVoteTimestamp == 0) {
            proposals[_torrentHash].lastVoteTimestamp = block.timestamp;
        }

        evaluateVoting(_torrentHash, _category);
    }

    function evaluateVoting(bytes32 _torrentHash, TorrentCategory currentCategory) internal {
        require(proposals[_torrentHash].lastVoteTimestamp != 0, "last vote timestamp not set");
        require(blackList.getEntry(_torrentHash) == TorrentBlackList.EntryCategory.NOTLISTED, "hash already on blacklist");

        uint malwareCounter = proposals[_torrentHash].votes[TorrentCategory.MALWARE];
        uint copyrightedCounter = proposals[_torrentHash].votes[TorrentCategory.COPYRIGHTED];
        uint timeSinceLastVoting = block.timestamp - proposals[_torrentHash].lastVoteTimestamp;

        if (malwareCounter + copyrightedCounter >= voteCountThreshold && timeSinceLastVoting <= voteTimeThreshold) {
            addHashToBlacklist(_torrentHash, malwareCounter, copyrightedCounter);
        } else if (timeSinceLastVoting > voteTimeThreshold) { // restart voting
            restartVoting(_torrentHash, currentCategory);
        }

        proposals[_torrentHash].lastVoteTimestamp = block.timestamp;
    }

    function addHashToBlacklist(bytes32 _torrentHash, uint malwareCounter, uint copyrightedCounter) internal {
        TorrentBlackList.EntryCategory entryCategory;

        if (malwareCounter == copyrightedCounter) {
            entryCategory = TorrentBlackList.EntryCategory.MALEWAREANDCOPYRIGHT;
        } else if (malwareCounter > copyrightedCounter) {
            entryCategory = TorrentBlackList.EntryCategory.MALWARE;
        } else {
            entryCategory = TorrentBlackList.EntryCategory.COPYRIGHTED;
        }

        blackList.addCategoryToEntry(_torrentHash, entryCategory);
    }

    function restartVoting(bytes32 _torrentHash, TorrentCategory currentCategory) internal {
        for (uint i = 0; i < proposals[_torrentHash].voters.length; i++) {
            proposals[_torrentHash].voted[proposals[_torrentHash].voters[i]] = false;
        }

        if (currentCategory == TorrentCategory.MALWARE) {
            proposals[_torrentHash].votes[TorrentCategory.MALWARE] = 1;
            proposals[_torrentHash].votes[TorrentCategory.COPYRIGHTED] = 0;
        } else {
            proposals[_torrentHash].votes[TorrentCategory.MALWARE] = 0;
            proposals[_torrentHash].votes[TorrentCategory.COPYRIGHTED] = 1;
        }
    }

    function getVotesAmount(bytes32 _torrentHash) external view returns (uint[] memory) {
        uint[] memory votingArray = new uint[](2);
        votingArray[0] = proposals[_torrentHash].votes[TorrentCategory.MALWARE];
        votingArray[1] = proposals[_torrentHash].votes[TorrentCategory.COPYRIGHTED];

        return votingArray;
    }
}
