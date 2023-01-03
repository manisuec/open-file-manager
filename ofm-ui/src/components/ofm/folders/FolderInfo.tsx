import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableRow,
} from '@material-ui/core';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { deleteFolder } from '../../../actions/drive';

import { formatDate } from '../../../helpers/datehelper';
import { RootState } from '../../../reducers';
import {
  CloseIcon,
  ConfirmDialog,
  CustomButton,
  CustomDialogActions,
  CustomDialogContent,
  CustomDialogTitle,
  CustomSpinner,
  CustomTableCell,
  SideScreenDialog,
} from '../../common';
import { EditFileDescription, EditFileName } from './FolderInfoEdit';

export default function FileInfo({ open, setOpen }: any) {
  const dispatch = useDispatch();

  const closeSidebar = () => {
    setOpen(false);
  };
  const [editName, setEditName] = useState(false);
  const [editComment, setEditComment] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { projId: projectId, folderId: parentID } = useParams<any>();

  const folder_detail = useSelector(
    (state: RootState) => state.driveReducer.selected_folder_info
  );
  const handleDelete = () => {
    setShowDelete(true);
  };

  const handleDeleteFolder = () => {
    if (folder_detail?._id) {
      dispatch(deleteFolder(folder_detail._id, projectId, parentID));
      setOpen(false);
    }
  };

  return (
    <div>
      <SideScreenDialog
        open={open}
        onClose={closeSidebar}
        className="typography-base h-100"
        width={40}
      >
        <CustomDialogTitle className="p-0 overflow-hidden">
          <Grid container justify="space-between" className="px-4 pt-3 mb-2">
            <Grid item xs={11}>
              {folder_detail?.name}
              <br />
            </Grid>
            <Grid item xs={1} className="d-flex justify-content-end">
              <div>
                <IconButton
                  className="rounded"
                  onClick={closeSidebar}
                  classes={{ root: 'p-2' }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
            </Grid>
          </Grid>
        </CustomDialogTitle>
        {Object.keys(folder_detail).length ? (
          <>
            <CustomDialogContent>
              <div className="mx-3">
                <Table className="table table-borderless">
                  <TableBody>
                    <TableRow>
                      <CustomTableCell>
                        <span className="light text-capitalize">Name</span>
                      </CustomTableCell>
                      <CustomTableCell>
                        {editName ? (
                          <EditFileName
                            onClose={() => {
                              setEditName(false);
                            }}
                          />
                        ) : (
                          <div
                            className="d-flex flex-wrap p-2 hover-border-blue rounded-sm"
                            onDoubleClick={() => {
                              setEditName(true);
                            }}
                          >
                            {folder_detail?.name}
                          </div>
                        )}
                      </CustomTableCell>
                    </TableRow>
                    <TableRow>
                      <CustomTableCell>
                        <span className="light text-capitalize">Creator</span>
                      </CustomTableCell>
                      <CustomTableCell>
                        {folder_detail?.creator_name}
                      </CustomTableCell>
                    </TableRow>
                    <TableRow>
                      <CustomTableCell>
                        <span className="light text-capitalize">
                          Created At
                        </span>
                      </CustomTableCell>
                      <CustomTableCell>
                        {formatDate(
                          folder_detail?.createdAt,
                          'DD MMMM, YYYY h:mm A'
                        )}
                      </CustomTableCell>
                    </TableRow>
                    <TableRow>
                      <CustomTableCell>
                        <span className="light text-capitalize">
                          Last Update At
                        </span>
                      </CustomTableCell>
                      <CustomTableCell>
                        {formatDate(
                          folder_detail?.updatedAt,
                          'DD MMMM, YYYY h:mm A'
                        )}
                      </CustomTableCell>
                    </TableRow>

                    <TableRow>
                      <CustomTableCell>
                        <span className="light text-capitalize">Comment</span>
                      </CustomTableCell>
                      <CustomTableCell>
                        {editComment ? (
                          <EditFileDescription
                            onClose={() => {
                              setEditComment(false);
                            }}
                          />
                        ) : (
                          <div
                            className="d-flex flex-wrap p-2 hover-border-blue rounded-sm"
                            onDoubleClick={() => {
                              setEditComment(true);
                            }}
                          >
                            {folder_detail?.comment ? (
                              folder_detail?.comment
                            ) : (
                              <span className="text-muted">No description</span>
                            )}
                          </div>
                        )}
                      </CustomTableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CustomDialogContent>
            <CustomDialogActions leftAlign>
              <CustomButton
                variant="contained"
                label="Close"
                onClick={closeSidebar}
                uppercase
                classes={{ label: 'typography-base fes-m fw-bold' }}
                buttonSize="small"
              />
              <CustomButton
                variant="contained"
                label="Delete Folder"
                onClick={handleDelete}
                uppercase
                className="bg-danger"
                classes={{ label: 'typography-base fes-m fw-bold' }}
                buttonSize="small"
              />
            </CustomDialogActions>
          </>
        ) : (
          <CustomSpinner />
        )}
      </SideScreenDialog>

      <ConfirmDialog
        show={showDelete}
        onHide={() => {
          setShowDelete(false);
        }}
        headerIconType="alert"
        headerLabel={`Delete ${folder_detail?.name}`}
        content={`Are you sure you want to delete ${folder_detail?.name}?`}
        confirmButtonClassName="bg-danger text-white"
        confirmButtonLabel={'DELETE'}
        onSubmit={handleDeleteFolder}
      />
    </div>
  );
}
