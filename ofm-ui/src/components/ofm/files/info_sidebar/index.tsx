import { Grid, IconButton, Tabs, Tab, Box } from '@material-ui/core';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MouseEventHandler } from 'react-select';

import { RootState } from '../../../../reducers';
import {
  CloseIcon,
  CustomDialogContent,
  CustomDialogTitle,
  CustomSpinner,
  SideScreenDialog,
} from '../../../common';
import {
  DRIVE_UPLOAD_FILE_RESET,
  DRIVE_FILE_SHARE_RESET,
} from '../../../../actions/drive/types';
import FileInfo from './file_info';
import VersionHistory from './version_history';
import VersionUpdate from './version_update';

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

export default function InfoSidebar({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: Function;
}) {
  const file_info_pending = useSelector(
    (state: RootState) => state.driveReducer.file_info_pending
  );
  const file_info = useSelector(
    (state: RootState) => state.driveReducer.file_info
  );
  const file_info_error = useSelector(
    (state: RootState) => state.driveReducer.file_info_error
  );
  const file_version = useSelector(
    (state: RootState) => state.driveReducer.file_version
  );

  const [value, setValue] = useState(0);
  const dispatch = useDispatch();

  const resetFileOptions = () => {
    dispatch({ type: DRIVE_UPLOAD_FILE_RESET });
    dispatch({ type: DRIVE_FILE_SHARE_RESET });
  };

  const handleChange = (_event: object, newValue: number) => {
    setValue(newValue);
    resetFileOptions();
  };

  const closeSidebar = () => {
    setValue(0);
    resetFileOptions();
    handleClose();
  };

  return (
    <SideScreenDialog
      open={open}
      onClose={closeSidebar}
      className="typography-base h-100"
      width={40}
    >
      <CustomDialogTitle className="p-0 overflow-hidden">
        <Grid container justify="space-between" className="px-4 pt-3 mb-2">
          <Grid item xs={11}>
            {file_info?.name}
            <br />
            <span className="text-muted">{file_version[0]?.version_name}</span>
          </Grid>
          <Grid item xs={1} className="d-flex justify-content-end">
            <div>
              <IconButton
                className="rounded"
                classes={{ root: 'p-2' }}
                onClick={handleClose as MouseEventHandler}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          </Grid>
        </Grid>
      </CustomDialogTitle>
      <CustomDialogContent>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="File Info" />
          <Tab label="Version History" />
          <Tab label="Update Version" />
        </Tabs>
        <TabPanel value={value} index={0}>
          {file_info_pending ? <CustomSpinner /> : <FileInfo />}
          {file_info_error && (
            <div className="text-center">
              <div className="text-danger">{file_info_error}</div>
            </div>
          )}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {file_info_pending ? <CustomSpinner /> : <VersionHistory />}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {<VersionUpdate />}
        </TabPanel>
      </CustomDialogContent>
    </SideScreenDialog>
  );
}
