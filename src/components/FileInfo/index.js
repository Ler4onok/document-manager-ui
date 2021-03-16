import React from 'react';

export const FileInfo = ({fileInfo}) => {
  return(
    <div>
      <h1>File Information</h1>
      <div>
        <div>File name: {fileInfo["http://example.cz/fileName"]}</div>
        <div>File type: {fileInfo["http://example.cz/fileType"]}</div>
        <div>File version: {fileInfo["http://example.cz/version"]}</div>
      </div>
    </div>
  )
}