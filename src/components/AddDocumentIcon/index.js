import React from 'react';
import { Icon } from '../Icon';
import plusIcon from '../../assets/plus_blue.svg';

const AddDocumentIcon = ({ onOpenAddModal }) => {
  return (
    <Icon
      right="30px"
      src={plusIcon}
      title="Add a new document"
      onClick={onOpenAddModal}
      // style={{ position: "absolute", right: 20 }}
      // onClick={() => {
      //   setOpenFolderModal(true);
      //   setNewFolder({ ...newFolder, type: "Document", event: "Add" });
      // }}
    />
  );
};

export { AddDocumentIcon };
