import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useParams } from 'react-router';
import Progress from '@material-ui/core/LinearProgress';
import { CancelRounded, CheckCircleRounded } from '@material-ui/icons';
import { TextareaAutosize } from '@material-ui/core';

import {
  CustomButton,
  CustomDialogActions,
  CustomTextField,
} from '../../../common';
import { UploadPlanIcon } from '../../../common/Icons/UploadIcon';
import { useDispatch, useSelector } from 'react-redux';
import { createVersion } from '../../../../actions/drive';
import { RootState } from '../../../../reducers';
import { eventDispatch } from '../../../../actions/base';
import {
  CREATE_FILE_API_ERROR,
  CREATE_FILE_API_PENDING,
  DRIVE_UPLOAD_FILE_RESET,
} from '../../../../actions/drive/types';
import { getExtensionFromMimeType } from '../../../../helpers/mimeTypeHelper';
import {
  getFileKeyName,
  singleS3UploadHelper,
} from '../../../../helpers/uploadhelper';
import { DRIVE_BUCKET_NAME } from '../../../../constants';
import { FileProps } from '../../../../interfaces/Base';
import { toastErrorMessage } from '../../../../helpers';

export default function VersionUpdate() {
  const { folderId, projId: projectId } = useParams<any>();

  const dispatch = useDispatch();
  const [versionComment, setVersionComment] = useState('');
  const [versionName, setVersionName] = useState('');
  const [versionError, setVersionError] = useState('');

  const file_info = useSelector(
    (state: RootState) => state.driveReducer.file_info
  );
  const isUploading = useSelector(
    (state: RootState) => state.driveReducer.upload_file_pending
  );
  const error = useSelector(
    (state: RootState) => state.driveReducer.upload_file_error
  );
  const uploadSuccess = useSelector(
    (state: RootState) => state.driveReducer.upload_file_success
  );

  const [files, setFiles] = useState<any>([]);
  const handleClose = () => {
    dispatch(eventDispatch(DRIVE_UPLOAD_FILE_RESET));
  };

  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles);
  }, []);

  const uploadFileToS3 = async (file: FileProps, key: string) => {
    try {
      dispatch(eventDispatch(CREATE_FILE_API_PENDING));
      const url = await singleS3UploadHelper(
        file,
        projectId,
        'drive',
        null,
        DRIVE_BUCKET_NAME,
        true,
        key
      );
      return url;
    } catch (e) {
      toastErrorMessage("Couldn't upload file");
      dispatch(eventDispatch(CREATE_FILE_API_ERROR, "Couldn't upload file"));
      return null;
    }
  };

  const handleUpdateversion = async () => {
    const version_name: string = versionName.trim();
    const comment: string = versionComment.trim() || '';
    if (version_name) {
      setVersionError('');
      const file_id = file_info?._id as string;
      const file = files[0];
      const fileKeyName = getFileKeyName(projectId, 'drive', file.name);
      const url = await uploadFileToS3(file, fileKeyName);
      if (url) {
        const body = {
          storage_info: {
            url,
            bucket: DRIVE_BUCKET_NAME,
            key: fileKeyName,
          },
          comment,
          mime_type: file.type,
          size: file.size,
          parent_id: folderId,
          version_name,
          project_id: projectId,
        };
        dispatch(createVersion(file_id, body));
      }
      setVersionComment('');
      setVersionName('');
      setFiles([]);
    } else {
      setVersionError('Please Enter Version Name');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop,
  });

  const AfterUpload = () => {
    return uploadSuccess ? (
      <div className="mx-auto my-5 text-center p-5">
        <span
          className={
            'fiv-cla fiv-icon-' + getExtensionFromMimeType(files[0]?.type)
          }
          style={{
            fontSize: '3.5rem',
          }}
        ></span>
        <div className="text-center mt-2">{files[0]?.name}</div>
        <div className="hand-pointer icons-list mt-3 fes-l text-success">
          <CheckCircleRounded fontSize="small" className="mx-2" />
          Successfully Uploaded
        </div>
      </div>
    ) : (
      <div className="mx-auto my-5 text-center p-5">
        <span
          className={
            'fiv-cla fiv-icon-' + getExtensionFromMimeType(files[0]?.type)
          }
          style={{
            fontSize: '3.5rem',
          }}
        ></span>
        <div className="text-center mt-2">{files[0]?.name}</div>
        <div className="hand-pointer icons-list mt-3 fes-l text-danger">
          <CancelRounded fontSize="small" className="mx-2" />
          Upload Failed
        </div>
      </div>
    );
  };

  return (
    <>
      {!uploadSuccess && !error ? (
        <>
          {!files.length && !isUploading && (
            <>
              <div {...getRootProps()} className="w-100">
                <input {...getInputProps()} />
                <div className="msp-dropzone hand-pointer mx-auto text-center bg-white">
                  <UploadPlanIcon
                    style={{ fontSize: '100px' }}
                    className="mx-auto"
                  />
                  <div className="fw-bold fs-l mt-3 mb-2">
                    {' '}
                    Drop or Select file to Update version{' '}
                  </div>
                  <div
                    className=" fs-l mt-2"
                    style={{ color: '#666666' }}
                  ></div>
                </div>
              </div>
            </>
          )}
          {files.length > 0 && !isUploading && (
            <div>
              <div className="text-dark">Version Name</div>
              <CustomTextField
                value={versionName}
                className="w-100"
                error={versionError?.length > 0}
                onChange={(e: any) => setVersionName(e.target.value)}
                placeholder="Enter Version Name"
              />
              <div className="text-dark mt-3">Comment</div>
              <TextareaAutosize
                value={versionComment}
                minRows={3}
                onChange={e => setVersionComment(e.target.value)}
                className="w-100"
                placeholder="Enter Version Comment"
              />

              <div className="text-danger">{versionError}</div>
              <CustomButton
                onClick={handleUpdateversion}
                label="Update Version"
                size="large"
                className="mt-3"
              />
            </div>
          )}

          {isUploading && (
            <div
              className="mx-auto my-5 text-center p-5"
              style={{ width: 250 }}
            >
              <span
                className={
                  'fiv-cla fiv-icon-' + getExtensionFromMimeType(files[0]?.type)
                }
                style={{
                  fontSize: '3.5rem',
                }}
              ></span>
              <div className=" text-center mt-2">{files[0]?.name}</div>
              <Progress
                className="mt-3 rounded"
                style={{ height: 8 }}
                classes={{ bar: 'rounded' }}
              />
              <div className="mt-2">Processing</div>
            </div>
          )}
        </>
      ) : (
        <AfterUpload />
      )}

      {uploadSuccess && (
        <CustomDialogActions>
          <CustomButton
            label="Done"
            buttonSize="small"
            onClick={handleClose}
            size="small"
          />
        </CustomDialogActions>
      )}
    </>
  );
}
