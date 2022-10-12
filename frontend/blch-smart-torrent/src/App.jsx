import "./App.css";

const App = () => {
  const dragDrop = require("drag-drop");
  dragDrop("div", (files) => {
    console.log("Here are the dropped files", files);
  });

  return (
    <body>
      <h1>...-Hub</h1>
      <div class="file-drag">
        <p>
          Drag a .torrent file here or paste a magnet link and find out if it was flagged as copyrighted or maleware!
        </p>
        <input type="text" name="magnet" class="magnet"/>
      </div>
      <div class="info box">
        <div class="votes">
          <p>Votes for Copyrighted: X</p>
          <button class="vote">Vote!</button>
        </div>
        <div class="votes">
          <p>Votes for Maleware: X</p>
          <button class="vote">Vote!</button>
        </div>
      </div>
    </body>
  );
};

export default App;
