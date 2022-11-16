import { getZeros } from "./vote";

const getVotes = (hash, category) => {
	if (window.ethereum.isConnected()) {
        const transactionParameters = {
            gas: '0x249F0',
            to: '0x92ce25817f83b1657ff1fc53b92dc18148a1d65d',
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