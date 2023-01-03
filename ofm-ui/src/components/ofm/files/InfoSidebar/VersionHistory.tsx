import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Box,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Typography,
  TextareaAutosize,
  Table,
  TableBody,
  TableRow,
} from '@material-ui/core';
import { ExpandMoreRounded } from '@material-ui/icons';

import {
  fileSharableLink,
  makeDefaultVersion,
} from '../../../../actions/drive';
import { formatDate } from '../../../../helpers/datehelper';
import { formatSize } from '../../../../helpers/mathutil';
import { getExtensionFromMimeType } from '../../../../helpers/mimeTypeHelper';
import { DriveFileVersionProps } from '../../../../interfaces/Drive';
import { RootState } from '../../../../reducers';
import { CustomButton, CustomTableCell } from '../../../common';
import { copyToClipBoard } from '../../../common/CopyButton';

export default function VersionHistory() {
  const { projId: projectId } = useParams<{ projId: string }>();

  const { file_info, file_version, share_file_info } = useSelector(
    (state: RootState) => state.driveReducer
  );

  useEffect(() => {
    if (share_file_info?.url) {
      copyToClipBoard(share_file_info.url, 'Link copied to clipboard');
    }
  }, [share_file_info]);
  const dispatch = useDispatch();

  const handleDownloadFile = (version_id: string) => () => {
    const file_id = file_info?._id as string;
    dispatch(fileSharableLink(file_id, version_id, true));
  };

  const handleShareFile = (version_id: string) => () => {
    const file_id = file_info?._id as string;
    dispatch(fileSharableLink(file_id, version_id, false));
  };

  const handleUseVersion = (version_id: string) => () => {
    const file_id = file_info?._id as string;
    const parent_id = file_info?.parent_id || '';
    const body = {
      version_id,
      file_id,
      project_id: projectId,
      parent_id,
    };
    dispatch(makeDefaultVersion(body));
  };

  return (
    <Box>
      {file_version &&
        file_version.map(
          (file_version: DriveFileVersionProps, index: number) => (
            <Accordion key={index + '_file_version'}>
              <AccordionSummary
                expandIcon={<ExpandMoreRounded />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>{file_version.version_name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Table className="table table-borderless w-100">
                  <TableBody>
                    <TableRow>
                      <CustomTableCell>
                        <span className="light text-capitalize">
                          Version Name
                        </span>
                      </CustomTableCell>
                      <CustomTableCell>
                        {file_version.version_name}
                      </CustomTableCell>
                    </TableRow>
                    <TableRow>
                      <CustomTableCell>
                        <span className="light text-capitalize">Size</span>
                      </CustomTableCell>
                      <CustomTableCell>
                        {formatSize(file_version?.size)}
                      </CustomTableCell>
                    </TableRow>
                    <TableRow>
                      <CustomTableCell>
                        <span className="light text-capitalize">Creator</span>
                      </CustomTableCell>
                      <CustomTableCell>
                        {file_version.creator_name}
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
                          file_version.createdAt,
                          'DD MMMM, YYYY h:mm:ss A'
                        )}
                      </CustomTableCell>
                    </TableRow>
                    <TableRow>
                      <CustomTableCell>
                        <span className="light text-capitalize">File Type</span>
                      </CustomTableCell>
                      <CustomTableCell>
                        {getExtensionFromMimeType(file_version.mime_type)}
                      </CustomTableCell>
                    </TableRow>

                    {file_version.comment && (
                      <TableRow>
                        <CustomTableCell>
                          <span className="light text-capitalize">
                            Comments
                          </span>
                        </CustomTableCell>
                        <CustomTableCell>
                          <TextareaAutosize
                            className="form-control"
                            value={file_version.comment}
                            aria-label="empty textarea"
                            readOnly
                          />
                        </CustomTableCell>
                      </TableRow>
                    )}

                    <TableRow>
                      <CustomTableCell></CustomTableCell>
                      <CustomTableCell>
                        <CustomButton
                          label="Share"
                          buttonSize="small"
                          handleSubmit={handleShareFile(
                            file_version?._id || ''
                          )}
                        />
                        <CustomButton
                          label="Download"
                          buttonSize="small"
                          handleSubmit={handleDownloadFile(
                            file_version._id || ''
                          )}
                          className="mx-1"
                        />
                        <CustomButton
                          label="Use this version"
                          buttonSize="small"
                          handleSubmit={handleUseVersion(
                            file_version?._id as string
                          )}
                        />
                      </CustomTableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div></div>
              </AccordionDetails>
            </Accordion>
          )
        )}
    </Box>
  );
}
