import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Dialog, FormControl } from '@material-ui/core';

import { createFolder } from '../../../actions/drive';
import { NewFolderProps } from '../../../interfaces/Drive';
import {
  CustomButton,
  CustomDialogActions,
  CustomDialogContent,
  CustomDialogTitle,
  CustomTextField,
} from '../../common';
import { useState } from 'react';
import { AddRounded } from '@material-ui/icons';

export default function CreateFolder() {
  const dispatch = useDispatch();
  const { folderId: parentFolder, projId: projectId } = useParams<any>();
  const [open, setOpen] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setFolderName('');
    setComment('');
    setError('');
  };

  const handleNameChange = (e: any) => {
    setFolderName(e.target.value);
    if (error) setError('');
  };

  const handleCommentChange = (e: any) => {
    setComment(e.target.value);
  };

  const createFolderHandler = () => {
    if (folderName) {
      const body: NewFolderProps = {
        name: folderName,
        comment,
        parent_id: parentFolder,
        project_id: projectId,
      };
      dispatch(createFolder(body));
      handleClose();
    } else {
      setError('Folder name is required');
    }
  };

  return (
    <>
      <CustomButton
        onClick={handleClickOpen}
        buttonSize="small"
        startIcon={<AddRounded />}
        label={'Create Folder'}
      />
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <CustomDialogTitle onClose={handleClose}>
          {'Create Folder'}
        </CustomDialogTitle>
        <CustomDialogContent>
          <FormControl variant="standard" fullWidth>
            <label>Folder Name</label>
            <CustomTextField
              variant="outlined"
              value={folderName}
              error={error.length > 0}
              className="w-100"
              autoFocus
              onChange={handleNameChange}
            />
          </FormControl>

          {error ? <span className="text-danger">{error}</span> : null}

          <FormControl variant="standard" fullWidth className="mt-3">
            <label>Comment</label>

            <CustomTextField
              multiline
              variant="outlined"
              className="w-100"
              maxRows={4}
              rows={4}
              value={comment}
              onChange={handleCommentChange}
            />
          </FormControl>
        </CustomDialogContent>
        <CustomDialogActions>
          <CustomButton
            onClick={createFolderHandler}
            label="Create"
            size="large"
            className="mt-3"
          />
        </CustomDialogActions>
      </Dialog>
    </>
  );
}
