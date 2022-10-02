const dragDrop = require('drag-drop');
const bencode = require('bencode');

dragDrop('.file-drag', files => {
    const reader = new FileReader();
    reader.addEventListener('load', e => {
        var decoded = bencode.decode(e.target.result);
        console.log(decoded);
    });
    reader.readAsText(files[0]);
});

function onNewFile(hash) {
    console.log(hash);
}
