const vote = (hash, category) => {
    if (window.ethereum.isConnected()) {
        const transactionParameters = {
            gas: '0x249F0',
            to: '0x8b3a97d63286d979d792182c85800C1E8026631E',
            from: window.ethereum.selectedAddress,
            value: '0x00',
            data: '0xc9a28cb9' + getZeros(24) + hash + getZeros(63) + category
        }

        window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters]
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