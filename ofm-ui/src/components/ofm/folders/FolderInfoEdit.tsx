import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextareaAutosize } from '@material-ui/core';
import { useParams } from 'react-router-dom';

import { RootState } from '../../../reducers';
import { CustomTextField } from '../../common';
import { updateFolder } from '../../../actions/drive';

export function EditFileName({ onClose }: { onClose: Function }) {
  const folder_detail = useSelector(
    (state: RootState) => state.driveReducer.selected_folder_info
  );
  const dispatch = useDispatch();
  const { projId: projectId } = useParams<{ projId: string }>();

  const name = folder_detail?.name;
  const [fileName, setFileName] = useState(name || '');

  const handleSubmit = () => {
    const name = fileName.trim();
    const body = {
      name,
      folder_id: folder_detail?._id,
      project_id: projectId,
    };
    dispatch(updateFolder(body));
  };

  const handleClose = () => {
    onClose();
    handleSubmit();
  };

  return (
    <CustomTextField
      value={fileName}
      className="w-100"
      onBlur={handleClose}
      onChange={e => {
        setFileName(e.target.value);
      }}
    />
  );
}

export function EditFileDescription({ onClose }: { onClose: Function }) {
  const folder_detail = useSelector(
    (state: RootState) => state.driveReducer.selected_folder_info
  );
  const { projId: projectId } = useParams<{ projId: string }>();

  const dispatch = useDispatch();
  const [comment, setComment] = useState(folder_detail?.comment || '');

  const handleSubmit = () => {
    const body = {
      comment: comment.trim(),
      folder_id: folder_detail?._id,
      project_id: projectId,
    };
    dispatch(updateFolder(body));
  };

  const handleClose = () => {
    onClose();
    handleSubmit();
  };

  return (
    <TextareaAutosize
      value={comment}
      className="form-control"
      onBlur={handleClose}
      onChange={e => {
        setComment(e.target.value);
      }}
    />
  );
}
