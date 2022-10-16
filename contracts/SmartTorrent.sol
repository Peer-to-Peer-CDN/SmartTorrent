// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract SmartTorrent {
    enum TorrentCategory { MALWARE, COPYRIGHTED }

    mapping(bytes32 => Proposal) internal proposals;

    struct Proposal {
        uint256 creationTimestamp;
        mapping(address => bool) voted;
        mapping(TorrentCategory => uint) votes;
    }

    function vote(bytes32 _torrentHash, TorrentCategory _category) public {
        require(!proposals[_torrentHash].voted[msg.sender], "already voted");

        proposals[_torrentHash].voted[msg.sender] = true;
        if (proposals[_torrentHash].creationTimestamp == 0) { 
            proposals[_torrentHash].creationTimestamp = block.timestamp;
        }
        proposals[_torrentHash].votes[_category]++;
    }
}
