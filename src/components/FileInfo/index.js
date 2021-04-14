import React, { useState } from "react";

import {
  StyledFileCharacteristic,
  StyledFileCharacteristicsWrapper,
  StyledFileInfo,
  StyledIcon,
  StyledVersionsHeader,
  StyledVersionsHeaderWrapper,
} from './styled';

import downloadIcon from '../../assets/download.svg';
import addVersionIcon from '../../assets/plus_versions.svg';
import { getLinkInfo } from "../../features/document/utils";
import { getFileVersions } from "../../features/document";

export const FileInfo = ({ fileInfo, setModals }) => {
  const [isVersionsOpen, setVersionsOpen] = useState(false);
  const [fileVersions, setFileVersions] = useState([]);

  return (
    <StyledFileInfo>
      <h1 style={{ margin: 0, color: "#2196f3" }}>File information</h1>
      <StyledFileCharacteristicsWrapper
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <StyledFileCharacteristic>
          <b>File name</b>: {fileInfo["http://example.cz/name"]}
        </StyledFileCharacteristic>
        <StyledFileCharacteristic>
          <b>File type</b>: {fileInfo["http://example.cz/fileType"]}
        </StyledFileCharacteristic>
        <StyledFileCharacteristic>
          <b>File version</b>: {fileInfo["http://example.cz/version"]}
        </StyledFileCharacteristic>
      </StyledFileCharacteristicsWrapper>
      <StyledVersionsHeaderWrapper>
        <StyledVersionsHeader
          onClick={async () => {
            const _fileVersions = await getFileVersions(
              getLinkInfo(fileInfo["@id"], 2)
            );
            const reversedFileVersions = _fileVersions
              .map((version) => version)
              .reverse().reverse();
            setFileVersions(reversedFileVersions);
            setVersionsOpen(!isVersionsOpen);
          }}
        >
          {isVersionsOpen ? "Hide" : "Show"} file versions
        </StyledVersionsHeader>
        <StyledIcon
          src={addVersionIcon}
          title="Add a new file version"
          position="absolute"
          right={0}
          top="-3px"
          transform="scale(0.6)"
          onClick={() => {
            setModals({
              folder: {
                fileAdd: true,
                updateType: 'content', 
                fileInfo: fileInfo
              },
            });
          }}
        />
      </StyledVersionsHeaderWrapper>
      {isVersionsOpen &&
        fileVersions.map((version, key) => (
          <div
            style={{
              border: "solid 1px #80808029",
              borderRadius: "10px",
              padding: "15px",
              margin: "5px",
              width: "80%",
              position: "relative",
            }}
          >
            <div>
              <div>{`Version ${version["http://example.cz/version"]}`}</div>
              <div>{version["http://example.cz/fileName"]}</div>
              <div>{version["http://example.cz/created"]}</div>
              <div>{version["http://example.cz/fileType"]}</div>
            </div>
            <StyledIcon
              right="5%"
              top="40%"
              src={downloadIcon}
              // onClick={async () => {
              //   const fileName = getLinkInfo(fileInfo["@id"], 2);
              //   const fileContent = await getFileContent(
              //     fileName,
              //     version["http://example.cz/version"]
              //   );
              //   const url = URL.createObjectURL(new Blob([fileContent]));
              //   const link = document.createElement("a");
              //   link.href = url;
              //   link.setAttribute(
              //     "download",
              //     `${fileInfo["http://example.cz/fileName"]}`
              //   );

              //   document.body.appendChild(link);
              //   link.click();
              //   link.parentNode.removeChild(link);
              // }}
            />
          </div>
        ))}
    </StyledFileInfo>
  );
};
