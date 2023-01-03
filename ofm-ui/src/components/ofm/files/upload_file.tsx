import { useState, useCallback } from 'react';
import { Dialog, TextareaAutosize } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import Progress from '@material-ui/core/LinearProgress';
import { CancelRounded, CheckCircleRounded } from '@material-ui/icons';

import {
  CustomButton,
  CustomDialogActions,
  CustomDialogContent,
  CustomDialogTitle,
  CustomTextField,
} from '../../common';
import { UploadPlanIcon } from '../../common/Icons/UploadIcon';
import { uploadFile, createVersion } from '../../../actions/drive';
import { RootState } from '../../../reducers';
import { eventDispatch } from '../../../actions/base';
import {
  CREATE_FILE_API_ERROR,
  CREATE_FILE_API_PENDING,
  DRIVE_UPLOAD_FILE_RESET,
} from '../../../actions/drive/types';
import { getExtensionFromMimeType } from '../../../helpers/mimeTypeHelper';
import { DriveFileProps } from '../../../interfaces/Drive';
import {
  getFileKeyName,
  singleS3UploadHelper,
} from '../../../helpers/uploadhelper';
import { DRIVE_BUCKET_NAME } from '../../../constants';
import { FileProps } from '../../../interfaces/Base';
import { toastErrorMessage } from '../../../helpers';

function UploadDriveFile({ show, setShow }: { show: boolean; setShow: any }) {
  const files = useSelector((state: RootState) => state.driveReducer.files);
  const { folderId, projId: projectId } = useParams<any>();
  const dispatch = useDispatch();
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  const [prevFileID, setPrevFileID] = useState('');
  const [versionComment, setVersionComment] = useState('');
  const [versionName, setVersionName] = useState('');
  const [versionError, setVersionError] = useState('');

  const isUploading = useSelector(
    (state: RootState) => state.driveReducer.upload_file_pending
  );
  const error = useSelector(
    (state: RootState) => state.driveReducer.upload_file_error
  );
  const uploadSuccess = useSelector(
    (state: RootState) => state.driveReducer.upload_file_success
  );

  const [selectedFiles, setSelectedFiles] = useState<any>([]);

  const handleClose = () => {
    setShow(false);
    dispatch(eventDispatch(DRIVE_UPLOAD_FILE_RESET));
    setSelectedFiles([]);
    setVersionName('');
    setShowVersionDialog(false);
    setVersionComment('');
  };

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

  const resetUpload = () => {
    setVersionName('');
    setVersionComment('');
    setShowVersionDialog(false);
    setSelectedFiles([]);
    setPrevFileID('');
    setVersionError('');
  };

  const handleUploadFile = async (file: any) => {
    const fileKeyName = getFileKeyName(projectId, 'drive', file.name);
    const url = await uploadFileToS3(file, fileKeyName);
    if (url) {
      const body = {
        project_id: projectId,
        parent_id: folderId,
        file: {
          name: file.name,
          description: '',
          tags: [] as string[],
        },
        version: {
          storage_info: {
            url,
            bucket: DRIVE_BUCKET_NAME,
            key: fileKeyName,
          },
          comment: '1st version',
          mime_type: file.type,
          size: file.size,
        },
      };
      dispatch(uploadFile(body));
      resetUpload();
    }
  };

  const uploadVersion = async (
    file: any,
    version_name: string,
    comment: string
  ) => {
    setShowVersionDialog(false);
    setVersionError('');
    setShow(true);
    const fileKeyName = getFileKeyName(projectId, 'drive', file.name);
    const url = await uploadFileToS3(file, fileKeyName);
    if (url) {
      const body = {
        storage_info: {
          url,
          bucket: DRIVE_BUCKET_NAME,
          key: fileKeyName,
        },
        comment: comment,
        mime_type: file.type,
        size: file.size,
        parent_id: folderId,
        version_name: version_name,
        project_id: projectId,
      };
      dispatch(createVersion(prevFileID, body));
      resetUpload();
    }
  };

  const onDrop = useCallback(
    acceptedFiles => {
      const file = acceptedFiles[0];
      const file_name = file?.name;
      setSelectedFiles(acceptedFiles);
      const prev_file: any =
        files.find((o: DriveFileProps) => o.name === file_name) || null;
      if (prev_file) {
        setShowVersionDialog(true);
        setPrevFileID(prev_file?._id);
        setShow(false);
      } else {
        handleUploadFile(file);
      }
    },
    [files]
  );

  const handleKeepSeparate = () => {
    const file = selectedFiles[0];
    const new_name = new Date().getTime() + '_' + file.name;
    const blob = file.slice(0, file.size, file.type);
    const newFile = new File([blob], new_name, { type: file.type });
    handleUploadFile(newFile);
  };

  const handleUpdateVersion = () => {
    const comment = versionComment.trim();
    const version_name = versionName.trim() || '';
    if (version_name) {
      setVersionError('');
      uploadVersion(selectedFiles[0], version_name, comment);
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
            'fiv-cla fiv-icon-' +
            getExtensionFromMimeType(selectedFiles[0]?.type)
          }
          style={{
            fontSize: '3.5rem',
          }}
        ></span>
        <div className="text-center mt-2">{selectedFiles[0]?.name}</div>
        <div className="hand-pointer icons-list mt-3 fes-l text-success">
          <CheckCircleRounded fontSize="small" className="mx-2" />
          Successfully Uploaded
        </div>
      </div>
    ) : (
      <div className="mx-auto my-5 text-center p-5">
        <span
          className={
            'fiv-cla fiv-icon-' +
            getExtensionFromMimeType(selectedFiles[0]?.type)
          }
          style={{
            fontSize: '3.5rem',
          }}
        ></span>
        <div className="text-center mt-2">{selectedFiles[0]?.name}</div>
        <div className="hand-pointer icons-list mt-3 fes-l text-danger">
          <CancelRounded fontSize="small" className="mx-2" />
          Upload Failed
        </div>
      </div>
    );
  };

  return (
    <>
      <Dialog
        open={show}
        fullWidth
        maxWidth="sm"
        PaperProps={{ style: { height: 350, width: 651 } }}
      >
        <CustomDialogTitle onClose={!isUploading ? handleClose : ''}>
          Upload File
        </CustomDialogTitle>
        <CustomDialogContent dividers={false}>
          <>
            {!uploadSuccess && !error ? (
              <>
                {!isUploading ? (
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
                          Drop or Select file to Upload{' '}
                        </div>
                        <div
                          className=" fs-l mt-2"
                          style={{ color: '#666666' }}
                        ></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className="mx-auto my-5 text-center p-5"
                    style={{ width: 250 }}
                  >
                    <span
                      className={
                        'fiv-cla fiv-icon-' +
                        getExtensionFromMimeType(selectedFiles[0]?.type)
                      }
                      style={{
                        fontSize: '3.5rem',
                      }}
                    ></span>
                    <div className=" text-center mt-2">
                      {selectedFiles[0]?.name}
                    </div>
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
          </>
        </CustomDialogContent>

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
      </Dialog>

      <Dialog open={showVersionDialog} fullWidth maxWidth="xs">
        <CustomDialogTitle onClose={handleClose}>
          File Already Exist
        </CustomDialogTitle>
        <CustomDialogContent>
          <div>
            <div className="text-dark">Version Name</div>
            <CustomTextField
              value={versionName}
              className="w-100"
              error={versionError.length > 0}
              onChange={(e: any) => setVersionName(e.target.value)}
              placeholder="Enter Version Name"
            />
            <div className="text-dark mt-3">Comment</div>
            <TextareaAutosize
              value={versionComment}
              minRows={3}
              onChange={e => setVersionComment(e.target.value)}
              className="w-100 p-2"
              placeholder="Enter Version Comment"
            />
            <span className="text-danger">{versionError}</span>
          </div>
        </CustomDialogContent>
        <CustomDialogActions>
          <CustomButton
            label="Rename File"
            color="default"
            handleSubmit={handleKeepSeparate}
            className="fw-bold mr-3"
          />
          <CustomButton
            label="Update Version"
            handleSubmit={handleUpdateVersion}
            className="fw-bold"
            color="secondary"
          />
        </CustomDialogActions>
      </Dialog>
      {/* </Modal.Body>
      </Modal> */}
    </>
  );
}

export default UploadDriveFile;
