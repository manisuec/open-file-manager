import { useState } from 'react';
import { FolderRounded } from '@material-ui/icons';
import { Grid, IconButton } from '@material-ui/core';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Info from '@material-ui/icons/Info';

import UploadDriveFile from '../files/upload_file';
import { getFolderDetail } from '../../../actions/drive';
import { trimString } from '../../../utils/utils';
import { RootState } from '../../../reducers';
import { DriveFolderProps } from '../../../interfaces/Drive';
import FolderInfo from './folder_info';

const FolderSection = () => {
  const dispatch = useDispatch();
  const { projId: projectId } = useParams<any>();

  const [showUploadFile, setShowUploadFile] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const folders = useSelector((state: RootState) => state.driveReducer.folders);

  const FolderCard = ({ row }: { row: DriveFolderProps }) => {
    return (
      <Grid item>
        <div className="folder-card">
          <div className="p-2">
            <span className="folder-more-icon d-flex align-items-center">
              <IconButton style={{ height: 20, width: 20 }} color="primary">
                <Info
                  className="fes-m"
                  onClick={() => {
                    setShowInfoModal(true);
                    dispatch(getFolderDetail(row?._id, true));
                  }}
                />
              </IconButton>
            </span>

            <Link
              to={`/project/${projectId}/drive/${row._id}`}
              className="text-decoration-none"
            >
              <div className="tex-dark">
                <FolderRounded style={{ color: '#58b3f9' }} />
                <strong className="ml-2 text-dark">
                  {trimString(row.name, 15)}
                </strong>
              </div>
            </Link>
          </div>
        </div>
      </Grid>
    );
  };

  return (
    <div>
      {folders.length ? (
        <>
          <Grid item className="fes-xl fw-bold">
            {'Folders'}
          </Grid>
          <div className="px-2 mt-2">
            <Grid item>
              <Grid container spacing={2}>
                {folders.map((folder: DriveFolderProps, index: number) => {
                  return (
                    <FolderCard key={'folder_div_' + index} row={folder} />
                  );
                })}
              </Grid>
            </Grid>
          </div>
        </>
      ) : null}
      <FolderInfo open={showInfoModal} setOpen={setShowInfoModal} />
      <UploadDriveFile show={showUploadFile} setShow={setShowUploadFile} />
    </div>
  );
};
export default FolderSection;
