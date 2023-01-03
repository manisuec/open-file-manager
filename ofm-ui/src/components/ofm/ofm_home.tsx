import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getFolders, getFiles, getFolderDetail } from '../../actions/drive';
import { RootState } from '../../reducers';
import DriveHeader from './Header';
import FolderSection from './Folders/FolderSection';
import Breadcrumb from './Header/Breadcrumb';
import FileSection from './Files/FileSection';
import { eventDispatch } from '../../actions/base';
import { DRIVE_OPEN_FOLDER_DETAIL } from '../../actions/drive/types';

const Drive = () => {
  const dispatch = useDispatch();
  const { folderId, projId: projectId } = useParams<any>();

  useEffect(() => {
    dispatch(getFolders(projectId, folderId));
    dispatch(getFiles(projectId, folderId));
    if (folderId) {
      dispatch(getFolderDetail(folderId));
    } else {
      dispatch(eventDispatch(DRIVE_OPEN_FOLDER_DETAIL, null));
    }
  }, [folderId]);

  const { files, folders, pending: loading, error } = useSelector(
    (state: RootState) => state.driveReducer
  );

  return (
    <div className="bg-white">
      <Breadcrumb />
      <div className="px-4" style={{ minHeight: '60vh' }}>
        <DriveHeader />
        <FolderSection />
        <FileSection />
        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-center">{error}</div>}
        {folders.length === 0 && files.length === 0 && !loading && !error && (
          <div className="col-lg-12">
            <h3 className="text-center mt-3">Empty Folder</h3>
          </div>
        )}
      </div>
    </div>
  );
};
export default Drive;
