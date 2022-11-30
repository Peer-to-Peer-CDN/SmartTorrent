import { getZeros } from "./vote";

export const getVotes = async (hash, category) => {
    if (window.ethereum.isConnected()) {
        const malwareTransactionParameters = {
            to: '0x816197b9783cbe56a366152366e22d4ef9bd9892',
            data: '0x19c6268e' + getZeros(24) + hash + getZeros(63) + category
        }
        let result = await window.ethereum.request({
            "jsonrpc": "2.0",
            "method": "eth_call",
            "params": [malwareTransactionParameters, "latest"],
            "id": category
        }).catch ((error) => { console.log(error); });
        return result;
    }
}

export const isBlacklisted = async (hash) => {
    if (window.ethereum.isConnected()) {
        const malwareTransactionParameters = {
            to: '0x7b89c0531005c7f4b1e8a4988ca607a073ef892c',
            data: '0x19c6268e' 
        }
        let result = await window.ethereum.request({
            "jsonrpc": "2.0",
            "method": "eth_call",
            "params": [malwareTransactionParameters, "latest"],
            "id": 2
        }).catch ((error) => { console.log(error); });
        return result;
    }
}