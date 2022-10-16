// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "TorrentBlackList.sol";

contract SmartTorrent {
    enum TorrentCategory { MALWARE, COPYRIGHTED }
    TorrentBlackList blackList;

    mapping(bytes32 => Proposal) internal proposals;

    struct Proposal {
        uint256 creationTimestamp;
        mapping(address => bool) voted;
        mapping(TorrentCategory => uint) votes;
    }

    constructor (address _blacklist) {
        blackList = TorrentBlackList(_blacklist);
    }

    function vote(bytes32 _torrentHash, TorrentCategory _category) public {
        require(!proposals[_torrentHash].voted[msg.sender], "already voted");

        proposals[_torrentHash].voted[msg.sender] = true;
        if (proposals[_torrentHash].creationTimestamp == 0) { 
            proposals[_torrentHash].creationTimestamp = block.timestamp;
        }
        proposals[_torrentHash].votes[_category]++;
    }

    function evaluateVoting(bytes32 _torrentHash) public {
        uint malwareCounter = proposals[_torrentHash].votes[TorrentCategory.MALWARE];
        uint copyrightedCounter = proposals[_torrentHash].votes[TorrentCategory.COPYRIGHTED];
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
}

