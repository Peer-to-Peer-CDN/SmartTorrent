import { getZeros } from "./vote";
import { toast } from "react-hot-toast";

export const getVotes = async (hash, category) => {
    if (window.ethereum.isConnected()) {
        const malwareTransactionParameters = {
            to: "0x816197b9783cbe56a366152366e22d4ef9bd9892",
            data: "0x19c6268e" + getZeros(24) + hash + getZeros(63) + category
        }
        let result = await window.ethereum.request({
            "jsonrpc": "2.0",
            "method": "eth_call",
            "params": [malwareTransactionParameters, "latest"],
            "id": category
        }).catch((error) => {
            console.log(error);
            toast.error("Error fetching votes");
        });
        return result;
    }
}

export const isBlacklisted = async (hash) => {
    if (window.ethereum.isConnected()) {
        const transactionParameters = {
            to: "0x7b89c0531005c7f4b1e8a4988ca607a073ef892c",
            data: "0x9a5e4eb4" + getZeros(24) + hash + getZeros(64)
        }
        let result = await window.ethereum.request({
            "jsonrpc": "2.0",
            "method": "eth_call",
            "params": [transactionParameters, "latest"],
            "id": 2
        }).catch((error) => {
            console.log(error);
            toast.error("Error fetching blacklisted status");
        });
        return result;
    }
}