import React, { useState, useRef } from "react";
import ContentEditable from "react-contenteditable";

import {
  StyledFileCharacteristic,
  StyledFileCharacteristicsWrapper,
  StyledFileInfo,
  StyledIcon,
  StyledVersionsHeader,
  StyledVersionsHeaderWrapper,
} from "./styled";

import downloadIcon from "../../assets/download.svg";
import addVersionIcon from "../../assets/plus_versions.svg";
import { getLinkInfo } from "../../features/document/utils";
import { getFileContent, getFileVersions } from "../../features/document";
import fileIcon from "../FolderList/assets/file_simple.svg";
import editIcon from "../FolderList/assets/edit.svg";
import { updateFile } from "../../features/document/api";

export const FileInfo = ({ fileInfo, setModals }) => {
  const [isVersionsOpen, setVersionsOpen] = useState(false);
  const [fileVersions, setFileVersions] = useState([]);
  const [isEditDisabled, setEditDisabled] = useState(true);
  const text = useRef(fileInfo["http://example.cz/name"]);

  const handleChange = event => {
      text.current = event.target.value;
  };
  
  const handleBlur = () => {
    setEditDisabled(false)
    const currentFileName = getLinkInfo(fileInfo["@id"], 2);
    updateFile(text.current, currentFileName, "");
  };

    

  return (
    <StyledFileInfo>
      <div
        style={{
          padding: "20px",
          background: "#2196f3",
          width: "100%",
          textAlign: "center",
          boxShadow: " rgb(189 189 189) 5px 5px 10px -1px",
        }}
      >
        <h1 style={{ margin: 0, color: "white", fontSize: "20px" }}>
          File information
        </h1>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "75%",
          padding: "20px",
        }}
      >
        <StyledIcon
          position="relative"
          src={fileIcon}
          style={{ transform: "scale(1.5)" }}
        />
        <StyledFileCharacteristicsWrapper
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <StyledFileCharacteristic
            style={{ display: "flex", alignItems: "center" }}
          >
            <b>File name:</b>{" "}
            <ContentEditable
              // suppressContentEditableWarning={true}
              disabled={isEditDisabled}
              html={text.current}
              // innerRef={text}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <StyledIcon
              position="relative"
              src={editIcon}
              style={{ transform: "scale(0.5)" }}
              onClick={() => {
                setEditDisabled(!isEditDisabled);
                // text.current.focus();
                // setTimeout(() => {
                //   // text.current.focus();
                // }, 0);
                
              }}
            />
          </StyledFileCharacteristic>
          <StyledFileCharacteristic>
            <b>File type</b>: {fileInfo["http://example.cz/fileType"]}
          </StyledFileCharacteristic>
          <StyledFileCharacteristic>
            <b>File version</b>: {fileInfo["http://example.cz/version"]}
          </StyledFileCharacteristic>
          <StyledFileCharacteristic>
            <b>Date created</b>: {fileInfo["http://example.cz/created"]}
          </StyledFileCharacteristic>
        </StyledFileCharacteristicsWrapper>
      </div>

      <StyledVersionsHeaderWrapper>
        <StyledVersionsHeader
          onClick={async () => {
            const _fileVersions = await getFileVersions(
              getLinkInfo(fileInfo["@id"], 2)
            );
            const reversedFileVersions = _fileVersions
              .map((version) => version)
              .reverse()
              .reverse();
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
                updateType: "content",
                fileInfo: fileInfo,
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
              onClick={async () => {
                const fileName = getLinkInfo(fileInfo["@id"], 2);
                const fileContent = await getFileContent(
                  fileName,
                  version["http://example.cz/version"]
                );
                const url = URL.createObjectURL(new Blob([fileContent]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute(
                  "download",
                  `${fileInfo["http://example.cz/fileName"]}`
                );

                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
              }}
            />
          </div>
        ))}
    </StyledFileInfo>
  );
};
