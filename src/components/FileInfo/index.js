import React, { useState, useRef, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import dayjs from 'dayjs'

import {
  StyledFileCharacteristic,
  StyledFileCharacteristicsWrapper,
  StyledFileCharacteristicTitle,
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

export const FileInfo = ({ fileInfo, modals, setModals, setOpenFileInfoModal }) => {
  const [isVersionsOpen, setVersionsOpen] = useState(false);
  const [fileVersions, setFileVersions] = useState([]);
  const [isEditDisabled, setEditDisabled] = useState(true);
  const text = useRef(fileInfo["http://example.cz/name"]);
  const contentRef = useRef(null);
  

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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: "20px",
          background: "#2196f3",
          width: "100%",
          textAlign: "center",
          boxShadow: " rgb(189 189 189) 5px 5px 10px -1px",
        }}
      >
        <h1 style={{ margin: 0, marginLeft: '30%', color: "white", fontSize: "20px" }}>
          File information
        </h1>
        <div style={{color: 'white', marginRight: '3%', cursor: 'pointer', transform: 'scale(1.3)'}} onClick={()=>setOpenFileInfoModal(false)}>✖</div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "20px 0px 20px 50px",
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
          >
            <StyledFileCharacteristicTitle>File name:</StyledFileCharacteristicTitle>{" "}
            <ContentEditable
              // suppressContentEditableWarning={true}
              disabled={isEditDisabled}
              html={text.current}
              innerRef={contentRef}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <StyledIcon
              position="relative"
              src={editIcon}
              style={{ transform: "scale(0.5)" }}
              onClick={() => {
                setEditDisabled(!isEditDisabled);
                setTimeout(() => {
                  contentRef.current.focus();
                }, 0);
                
              }}
            />
          </StyledFileCharacteristic>
          <StyledFileCharacteristic>
            <StyledFileCharacteristicTitle>File type:</StyledFileCharacteristicTitle> {fileInfo["http://example.cz/fileType"]}
          </StyledFileCharacteristic>
          <StyledFileCharacteristic>
            <StyledFileCharacteristicTitle>File version:</StyledFileCharacteristicTitle> {fileInfo["http://example.cz/version"]}
          </StyledFileCharacteristic>
          <StyledFileCharacteristic>
            <StyledFileCharacteristicTitle>Date created: </StyledFileCharacteristicTitle> {dayjs.unix(fileInfo["http://example.cz/created"]).format('DD MMM YYYY HH:mm')}
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
              .map((version) => version).reverse();
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
            console.log(modals.folder.userLevel)
            if (modals.folder.userLevel === 'READ' || modals.folder.userLevel === 'NONE'){
              alert('You do not have permissions for this');
              return;
            }
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
              <div>{version["http://example.cz/fileType"]}</div>
              <div style={{color: '#80808087'}}>{dayjs.unix(version["http://example.cz/created"]).format('DD MMM YYYY HH:mm')}</div>
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
