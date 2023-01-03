import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumbs } from '@material-ui/core';

import { trimString } from '../../../utils/utils';
import { RootState } from '../../../reducers';
import { DriveParentFolderProps } from '../../../interfaces/Drive';
import PageHeader from '../../common/PageHeader';

const BreadcrumbComp = () => {
  const { projId: projectId } = useParams<any>();

  const folder_detail = useSelector(
    (state: RootState) => state.driveReducer.folder_detail
  );
  const parents = folder_detail?.parent_list || [];

  return (
    <PageHeader>
      <Breadcrumbs
        maxItems={5}
        itemsAfterCollapse={3}
        separator={'/'}
        expandText=""
        classes={{ separator: 'fw-bold mx-1', ol: 'svg-black' }}
      >
        <Link
          color="inherit"
          to={`/project/${projectId}/drive`}
          className="d-flex align-items-center text-decoration-none text-black fw-bold"
        >
          {'Drive'}
        </Link>
        {parents?.map((item: DriveParentFolderProps, index: number) => {
          return (
            <Link
              color="inherit"
              to={'/project/' + projectId + '/drive/' + item._id}
              key={index}
              className="text-decoration-none fw-bold text-black"
            >
              {trimString(item.name)}
            </Link>
          );
        })}
        <div className="fw-bold text-default">
          {trimString(folder_detail?.name)}
        </div>
      </Breadcrumbs>
    </PageHeader>
  );
};

export default BreadcrumbComp;
