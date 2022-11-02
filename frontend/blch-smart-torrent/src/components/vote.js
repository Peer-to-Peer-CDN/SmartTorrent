const vote = (hash, category) => {
    if (window.ethereum.isConnected()) {
        const transactionParameters = {
            gasPrice: '0x09184e72a000',
            gas: '0x249F0',
            to: '0xd93a2251336835cDD31bdac9158c0aA7226Ed25f',
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

function getZeros(amount) {
    let str = '';
    for (let i = 0; i < amount; i++) {
        str += '0';
    }
    return str;
}

export default vote