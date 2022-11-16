import { getZeros } from "./vote";

const getVotes = (hash, category) => {
	if (window.ethereum.isConnected()) {
        const transactionParameters = {
            gas: '0x249F0',
            to: '0x816197b9783cbe56a366152366e22d4ef9bd9892',
            from: window.ethereum.selectedAddress,
            value: '0x00',
            data: '0x19c6268e' + getZeros(24) + hash + getZeros(63) + category
        }

        window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters]
        }).then((result) => {console.log(result);});
    }
}


export default getVotes;