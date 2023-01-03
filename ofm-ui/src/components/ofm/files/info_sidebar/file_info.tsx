import { useState } from 'react';
import { Table, TableBody, TableRow } from '@material-ui/core';
import { useSelector } from 'react-redux';

import { formatDate } from '../../../../helpers/datehelper';
import { formatSize } from '../../../../helpers/mathutil';
import { getExtensionFromMimeType } from '../../../../helpers/mimeTypeHelper';
import { TagProps } from '../../../../interfaces/Task';
import { RootState } from '../../../../reducers';
import { TagEditor, EditFileName, EditFileDescription } from './InfoEdit';
import { CustomTableCell } from '../../../common';

export default function FileInfo() {
  const { file_info_pending, file_info_error, file_info } = useSelector(
    (state: RootState) => state.driveReducer
  );

  const [editName, setEditName] = useState(false);
  const [editTags, setEditTags] = useState(false);
  const [editDescription, setEditDescription] = useState(false);

  return (
    <div>
      {file_info_pending ? (
        'Loading'
      ) : file_info_error ? (
        file_info
      ) : (
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
                    {file_info?.name}
                  </div>
                )}
              </CustomTableCell>
            </TableRow>
            <TableRow>
              <CustomTableCell>
                <span className="light text-capitalize">Size</span>
              </CustomTableCell>
              <CustomTableCell>{formatSize(file_info?.size)}</CustomTableCell>
            </TableRow>
            <TableRow>
              <CustomTableCell>
                <span className="light text-capitalize">Creator</span>
              </CustomTableCell>
              <CustomTableCell>
                {file_info?.initial_creator_name}
              </CustomTableCell>
            </TableRow>
            <TableRow>
              <CustomTableCell>
                <span className="light text-capitalize">Created At</span>
              </CustomTableCell>
              <CustomTableCell>
                {formatDate(file_info?.createdAt, 'DD MMMM, YYYY h:mm A')}
              </CustomTableCell>
            </TableRow>
            <TableRow>
              <CustomTableCell>
                <span className="light text-capitalize">Last Update</span>
              </CustomTableCell>
              <CustomTableCell>
                {formatDate(file_info?.updatedAt, 'DD MMMM, YYYY h:mm A')}
              </CustomTableCell>
            </TableRow>
            <TableRow>
              <CustomTableCell>
                <span className="light text-capitalize">File Type</span>
              </CustomTableCell>
              <CustomTableCell>
                {getExtensionFromMimeType(file_info?.mime_type)}
              </CustomTableCell>
            </TableRow>
            <TableRow>
              <CustomTableCell>
                <span className="light text-capitalize">Tags</span>
              </CustomTableCell>
              <CustomTableCell>
                {editTags ? (
                  <TagEditor
                    onClose={() => {
                      setEditTags(false);
                    }}
                  />
                ) : (
                  <div
                    className="d-flex flex-wrap mx-n1 p-2 hover-border-blue rounded-sm"
                    onDoubleClick={() => {
                      setEditTags(true);
                    }}
                  >
                    {file_info?.tags.length ? (
                      file_info?.tags.map((tag: TagProps, index: number) => (
                        <span className="file-tags" key={index}>
                          {tag.tag_name}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted">No Tags</span>
                    )}
                  </div>
                )}
              </CustomTableCell>
            </TableRow>
            <TableRow>
              <CustomTableCell>
                <span className="light text-capitalize">Comment</span>
              </CustomTableCell>
              <CustomTableCell>
                {editDescription ? (
                  <EditFileDescription
                    onClose={() => {
                      setEditDescription(false);
                    }}
                  />
                ) : (
                  <div
                    className="d-flex flex-wrap p-2 hover-border-blue rounded-sm"
                    onDoubleClick={() => {
                      setEditDescription(true);
                    }}
                  >
                    {file_info?.description ? (
                      file_info?.description
                    ) : (
                      <span className="text-muted">No description</span>
                    )}
                  </div>
                )}
              </CustomTableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
}
