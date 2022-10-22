import React from "react";

import { useDropzone } from "react-dropzone";

function Dropzone({ open }) {
  const { getRootProps, getInputProps } = useDropzone({});
  return (
    <div className="container">
      <div {...getRootProps({ className: "dropzone file-drag" })}>
        <input className="input-zone" {...getInputProps()} />
        <div className="text-center">
          <p className="dropzone-content">
            Drop your torrent file here or click to select file
          </p>
        </div>
      </div>
    </div>
  );
}
export default Dropzone;
