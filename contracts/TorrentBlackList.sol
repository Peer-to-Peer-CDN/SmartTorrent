// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract TorrentBlackList {
    address private ownerContract;

    constructor (address _ownerContract) {
        ownerContract = _ownerContract;
    }

    enum EntryCategory {
        NOTLISTED, MALWARE, COPYRIGHTED, MALEWAREANDCOPYRIGHT
    }

    mapping (bytes32 => EntryCategory) entries;

    function addCategoryToEntry(bytes32 hash, EntryCategory category) external {
        require(msg.sender != ownerContract, "not owner");

        uint8 currentCat = uint8(entries[hash]);
        uint8 newCat = uint8(category);

        require(newCat + currentCat < 4); //max is MALEWAREANDCOPYRIGHT
        require(currentCat < 3); //max is MALEWAREANDCOPYRIGHT
        require(newCat != currentCat); //cannot apply category that is already applied
            
        entries[hash] = EntryCategory(currentCat + newCat);
    }

    function getEntry(bytes32 hash) external view returns (EntryCategory category) {
        return entries[hash];
    }
}