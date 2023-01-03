import { useState } from 'react';
import {
  Grid,
  IconButton,
  MenuItem,
  TableBody,
  TableRow,
  Table,
  TextareaAutosize,
  Dialog,
} from '@material-ui/core';
import {
  DeleteOutlineOutlined,
  GetAppOutlined,
  InfoRounded,
  MoreVertOutlined,
  ShareRounded,
  AccountCircleRounded,
} from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { formatDate } from '../../../helpers/datehelper';
import { CustomMenu } from '../../common/CustomMenu';
import {
  ConfirmDialog,
  CustomDialogContent,
  CustomDialogTitle,
  CustomSpinner,
  CustomTableCell,
} from '../../common';
import { trimString } from '../../../utils/utils';
import {
  closeInfo,
  deleteFile,
  fileSharableLink,
  getFileInfo,
} from '../../../actions/drive';
import { formatSize } from '../../../helpers/mathutil';
import { RootState } from '../../../reducers';
import CopyButton from '../../common/CopyButton';
import { eventDispatch } from '../../../actions/base';
import { DRIVE_FILE_SHARABLE_LINK } from '../../../actions/drive/types';
import { getExtensionFromMimeType } from '../../../helpers/mimeTypeHelper';
import { DriveFileProps } from '../../../interfaces/Drive';
import { TagProps } from '../../../interfaces/Task';
import InfoSidebar from './InfoSidebar';
import FileIcon from '../../common/FileIcon';

const FileSection = () => {
  const dispatch = useDispatch();
  const { projId: projectId } = useParams<{ projId: string }>();

  const { files, share_file_info } = useSelector(
    (state: RootState) => state.driveReducer
  );
  const [showDelete, setShowDeleteModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DriveFileProps | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);

  const handleDownloadFile = (id: string) => {
    dispatch(fileSharableLink(id, '', true));
  };
  const handleShareFile = (id: string) => {
    setShowShareModal(true);
    dispatch(fileSharableLink(id, '', false));
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setSelectedFile(null);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    dispatch(eventDispatch(DRIVE_FILE_SHARABLE_LINK, null));
  };

  const handleDeleteFile = () => {
    if (selectedFile?._id)
      dispatch(
        deleteFile(
          selectedFile?._id || '',
          projectId,
          selectedFile?.parent_id || ''
        )
      );
  };

  const handleInfoFile = (row: DriveFileProps) => {
    dispatch(getFileInfo(row._id));
    setInfoModal(true);
  };

  const closeInfoModal = () => {
    setInfoModal(false);
    closeInfo();
  };

  return (
    <div className="mt-3">
      {files.length ? (
        <>
          <Grid item className="fes-xl fw-bold">
            {'Files'}
          </Grid>
          <div className="row">
            <div className="col-lg-12 mt-2">
              <div className="row px-2">
                <Grid item xs={12}>
                  <Table>
                    <colgroup>
                      <col style={{ minWidth: '30%' }} />
                      <col style={{ width: '10%' }} />
                      <col style={{ width: '15%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '15%' }} />
                      <col style={{ width: '15%' }} />
                    </colgroup>
                    <TableBody>
                      {files.map((row: DriveFileProps, file_index: number) => (
                        <TableRow
                          key={'file_key' + file_index}
                          className="border-bottom"
                        >
                          <CustomTableCell>
                            <div className="d-flex align-items-center">
                              <FileIcon
                                extension={
                                  getExtensionFromMimeType(
                                    row.mime_type
                                  ) as string
                                }
                              />

                              <span className="ml-2">
                                {trimString(row.name, 25)}
                              </span>
                            </div>
                          </CustomTableCell>
                          <CustomTableCell className="text-right">
                            {formatSize(row.size)}
                          </CustomTableCell>
                          <CustomTableCell className="text-right">
                            {formatDate(row.updatedAt, 'DD MMMM, YYYY')}
                            <br />
                            {formatDate(row.updatedAt, 'hh:mm A')}
                          </CustomTableCell>
                          <CustomTableCell>
                            {row.tags?.map((tag: TagProps, index: number) => {
                              if (index < 2)
                                return (
                                  <span
                                    className="file-tags text-dark"
                                    key={index}
                                  >
                                    {tag.tag_name}
                                  </span>
                                );
                              else return null;
                            })}
                          </CustomTableCell>
                          <CustomTableCell>
                            <div className="d-flex align-items-center">
                              <AccountCircleRounded />
                              <span className="p-2">
                                {row.initial_creator_name}
                              </span>
                            </div>
                          </CustomTableCell>
                          <CustomTableCell className="text-right">
                            <IconButton
                              style={{ height: 20, width: 20 }}
                              color="primary"
                              onClick={() => {
                                handleShareFile(row._id);
                              }}
                            >
                              <ShareRounded />
                            </IconButton>

                            <IconButton
                              style={{ height: 20, width: 20 }}
                              color="primary"
                              className="mx-2"
                              onClick={() => {
                                handleInfoFile(row);
                              }}
                            >
                              <InfoRounded />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDownloadFile(row._id)}
                              color="primary"
                              className="file_download_icon"
                            >
                              <GetAppOutlined />
                            </IconButton>
                            <IconButton
                              style={{ height: 20, width: 20 }}
                              color="primary"
                            >
                              <CustomMenu
                                element={
                                  <IconButton className="p-0">
                                    <MoreVertOutlined className="fes-m" />
                                  </IconButton>
                                }
                                anchorOrigin={{
                                  vertical: 'bottom',
                                  horizontal: 'right',
                                }}
                                transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right',
                                }}
                              >
                                <MenuItem
                                  dense
                                  onClick={() => {
                                    setSelectedFile(row);
                                    setShowDeleteModal(true);
                                  }}
                                >
                                  <DeleteOutlineOutlined className="mr-2 fes-xl light" />
                                  {'Delete'}
                                </MenuItem>
                              </CustomMenu>
                            </IconButton>
                          </CustomTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              </div>
            </div>
          </div>
        </>
      ) : null}

      <ConfirmDialog
        show={showDelete}
        onHide={handleCloseModal}
        headerIconType="alert"
        headerLabel={`Delete ${selectedFile?.name}`}
        content={`Are you sure you want to delete ${selectedFile?.name}?`}
        confirmButtonClassName="bg-danger text-white"
        confirmButtonLabel={'DELETE'}
        onSubmit={handleDeleteFile}
      />

      <Dialog
        open={showShareModal}
        fullWidth
        maxWidth="xs"
        className="typography-base"
      >
        <CustomDialogTitle onClose={closeShareModal}>
          <span>Share File</span>
        </CustomDialogTitle>
        <CustomDialogContent>
          {share_file_info ? (
            <div>
              <div className="mb-3">
                Sharable Link
                <br />
                <TextareaAutosize
                  className="form-control"
                  value={share_file_info?.url}
                  aria-label="empty textarea"
                  readOnly
                />
              </div>
              <span>
                <b>Valid Upto: </b>
                {formatDate(share_file_info?.expiry, 'DD MMMM, YYYY h:mm:ss A')}
              </span>
              <span className="float-right">
                <CopyButton text={'Copy link'}>
                  {share_file_info?.url}
                </CopyButton>
              </span>
            </div>
          ) : (
            <CustomSpinner />
          )}
        </CustomDialogContent>
      </Dialog>

      <InfoSidebar open={infoModal} handleClose={closeInfoModal} />
    </div>
  );
};
export default FileSection;
