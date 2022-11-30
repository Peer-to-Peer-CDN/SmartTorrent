import React, { useCallback, useState } from "react";
import parseTorrent from "parse-torrent";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import { useEffect } from "react";


function Dropzone({ updateHash }) {
  const [hash, setHash] = useState("hash");

  useEffect(() => {
    setHash("");
  }, []);


  const onDrop = useCallback(acceptedFiles => {
    const filesFiltered = acceptedFiles.filter((file) => {
      return file.name.match(/.*\.torrent/g) ? file : null;
    });

    if (filesFiltered.length > 0) {
      const reader = new FileReader();
      reader.onabort = () => toast.error("file reading was aborted");
      reader.onerror = () => toast.error("file reading has failed");
      reader.onloadend = () => {
        let buffer = Buffer.from(reader.result);
        let parsedTorrent = parseTorrent(buffer);
        setHash(parsedTorrent.infoHash);
        updateHash(parsedTorrent.infoHash);
        toast.success("Torrent file loaded successfully");
      };

      reader.readAsArrayBuffer(filesFiltered[0]);
    } else {
      console.log("No valid file dropped");
    }
  }, [updateHash]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div {...getRootProps({ className: "dropzone file-drag" })}>
      <input className="input-zone" {...getInputProps()} />
      <div className="text-center">
        <p className="dropzone-content">
          {hash.length > 0 ? "Torrent hash: " + hash : "Drop your torrent file here or click to select file"}
        </p>
      </div>
    </div>
  );
}
export default Dropzone;
