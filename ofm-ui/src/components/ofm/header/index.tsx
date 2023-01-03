import { useState } from 'react';
import { BackupRounded } from '@material-ui/icons';
import { Grid } from '@material-ui/core';

import CreateFolder from './CreateFolder';
import UploadDriveFile from '../Files/UploadDriveFile';
import { CustomButton } from '../../common';

export default function DriveHeader() {
  const [showUploadFile, setShowUploadFile] = useState(false);

  const handleShowUploadFile = () => {
    setShowUploadFile(true);
  };

  return (
    <>
      <Grid container justifyContent="space-between" className="mt-n4">
        <Grid container justifyContent="flex-end" spacing={2}>
          <Grid item>
            <CreateFolder />
          </Grid>
          <Grid item>
            <CustomButton
              label="Upload File"
              startIcon={<BackupRounded />}
              variant="contained"
              buttonSize="small"
              classes={{ label: 'typography-base fes-m fw-bold' }}
              onClick={handleShowUploadFile}
            />
          </Grid>
        </Grid>
      </Grid>
      <UploadDriveFile show={showUploadFile} setShow={setShowUploadFile} />
    </>
  );
}
