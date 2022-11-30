import { toast } from "react-hot-toast";

const vote = async (hash, category) => {
    if (window.ethereum.isConnected()) {
        const transactionParameters = {
            gas: '0x249F0',
            to: '0x816197b9783cbe56a366152366e22d4ef9bd9892',
            from: window.ethereum.selectedAddress,
            value: '0x00',
            data: '0xc9a28cb9' + getZeros(24) + hash + getZeros(63) + category
        }
        toast.promise(
            window.ethereum.request({
                method: "eth_sendTransaction",
                params: [transactionParameters]
            }), {
            loading: "Voting in progress",
            success: "Voted successfully",
            error: "Error voting, please try again later"
        });

    }
}

export function getZeros(amount) {
    let str = '';
    for (let i = 0; i < amount; i++) {
        str += '0';
    }
    return str;
}
export default vote
