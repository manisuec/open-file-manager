import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { Box, Chip, TextareaAutosize } from '@material-ui/core';
import { AddRounded, HighlightOffRounded } from '@material-ui/icons';
import { createSelector } from 'reselect';
import { useParams } from 'react-router-dom';

import { RootState } from '../../../../reducers';
import { CustomButton, CustomTextField } from '../../../common';
import { createTag, getAllTagsRequest } from '../../../../actions/tagActions';
import { TAG_TYPE } from '../../../../constant/tag_constants';
import { updateFile } from '../../../../actions/drive';
import { TagProps } from '../../../../interfaces/Task';

export function TagEditor({ onClose }: { onClose: Function }) {
  const dispatch = useDispatch();
  const { projId: projectId } = useParams<{ projId: string }>();

  const { file_info } = useSelector((state: RootState) => state.driveReducer);

  const tagSelector = createSelector(
    (state: any) => state.tagReducer.tags.drive,
    tags =>
      tags.map((tag: TagProps) => ({
        tag_name: tag.tag_name,
        _id: tag._id,
      }))
  );

  const options: { _id: string; tag_name: string }[] = useSelector(tagSelector);
  const orgId = useSelector(
    (state: RootState) => state.organisationReducer.orgProfile._id
  );

  const [tags, setTags] = useState<TagProps[]>(file_info?.tags || []);
  const [searchVal, setSearchVal] = useState<undefined | string>('');
  const filteredOptions = options.filter((v: any) =>
    v.tag_name.toLowerCase().includes((searchVal || '').toLowerCase())
  );

  function handleSuccess(newTag: any) {
    setTags((prev: any) => [
      ...prev,
      { _id: newTag._id, tag_name: newTag.tag_name },
    ]);
  }

  const handleChange = (_: unknown, val: any[]) => {
    const newTag = val.find(v => !v._id);
    if (newTag?.tag_name) {
      dispatch(createTag(newTag.tag_name, TAG_TYPE.TYPE.DRIVE, handleSuccess));
    } else {
      var resArr: any = [];
      val.forEach(function (item) {
        var i = resArr.findIndex((x: any) => x._id == item._id);
        if (i <= -1) {
          resArr.push(item);
        }
      });
      setTags(resArr);
    }
  };

  const handleOpen = () => {
    dispatch(
      getAllTagsRequest({
        org_id: orgId,
        tag_type: TAG_TYPE.TYPE.DRIVE,
      })
    );
  };

  const handleUpdateFileTags = () => {
    const tag_ids = tags.map((tag: TagProps) => tag._id || '');
    const body = {
      tags: tag_ids,
      file_id: file_info?._id,
      project_id: projectId,
      parent_id: file_info?.parent_id,
    };
    dispatch(updateFile(body));
  };

  const handleSubmit = () => {
    handleUpdateFileTags();
    onClose();
  };

  const handleFilterChange = (options: TagProps[], params: any) => {
    const filteredOptions = [...options];

    if (params.inputValue !== '') {
      filteredOptions.unshift({
        _id: '',
        tag_name: params?.inputValue,
      });
    } else filteredOptions.unshift({ _id: undefined, tag_name: undefined });

    return filteredOptions;
  };

  const handleInputChange = (tag: TagProps) => {
    if (tag._id) {
      return (
        <Box display="flex" alignItems="center">
          <div className="fes-m">{tag?.tag_name}</div>
        </Box>
      );
    } else if (tag.tag_name) {
      return (
        <CustomButton
          fullWidth
          label={
            <div className="text-black">
              Create tag <b>{`“${searchVal}”`}</b>
            </div>
          }
          variant="text"
          style={{ textTransform: 'none' }}
          buttonSize="small"
          className="justify-content-start"
          classes={{ root: 'p-0' }}
          startIcon={<AddRounded className="ml-1" />}
        />
      );
    } else {
      return (
        <CustomButton
          fullWidth
          label={'Type to search or create tag'}
          variant="text"
          className="justify-content-start"
          disabled
          buttonSize="small"
          classes={{
            root: 'p-0 my-0',
          }}
          style={{ textTransform: 'none' }}
          startIcon={<AddRounded className="ml-1" />}
        />
      );
    }
  };

  const handleRender = (value: TagProps[], getTagProps: any) =>
    value.map((option, index) => (
      <Chip
        label={option.tag_name}
        {...getTagProps({ index })}
        key={index}
        size="small"
        deleteIcon={<HighlightOffRounded fontSize="small" />}
        className="file-tags fes-m mr-1 mb-1 fes-m p-0"
      />
    ));

  return (
    <Autocomplete
      freeSolo
      inputValue={searchVal}
      multiple
      onBlur={handleSubmit}
      onOpen={handleOpen}
      className="w-100"
      classes={{ paper: 'shadow rounded-sm' }}
      value={tags}
      options={filteredOptions || []}
      filterOptions={handleFilterChange}
      onInputChange={(e: any) => setSearchVal(e?.target?.value || '')}
      onChange={handleChange}
      renderOption={handleInputChange}
      renderTags={handleRender}
      getOptionLabel={op => op?.tag_name || ''}
      popupIcon={null}
      renderInput={params => (
        <CustomTextField
          {...params}
          fullWidth
          autoFocus
          placeholder={'Search Tags'}
          variant="outlined"
        />
      )}
    />
  );
}

export function EditFileName({ onClose }: { onClose: Function }) {
  const { file_info } = useSelector((state: RootState) => state.driveReducer);
  const dispatch = useDispatch();
  const { projId: projectId } = useParams<{ projId: string }>();

  const file_name = file_info?.name;
  const extension = file_name?.split('.').pop();
  const name = file_name?.split('.').shift();
  const [fileName, setFileName] = useState(name || '');

  const handleSubmit = () => {
    let name = fileName.trim();
    if (name.length > 0) {
      if (extension) name = `${name}.${extension}`;
      const body = {
        name,
        file_id: file_info?._id,
        project_id: projectId,
        parent_id: file_info?.parent_id,
      };
      dispatch(updateFile(body));
    }
  };

  const handleClose = () => {
    onClose();
    handleSubmit();
  };

  return (
    <CustomTextField
      value={fileName}
      className="w-100"
      onBlur={handleClose}
      onChange={e => {
        setFileName(e.target.value);
      }}
    />
  );
}

export function EditFileDescription({ onClose }: { onClose: Function }) {
  const { file_info } = useSelector((state: RootState) => state.driveReducer);
  const { projId: projectId } = useParams<{ projId: string }>();

  const dispatch = useDispatch();
  const [description, setFileDescription] = useState(
    file_info?.description || ''
  );

  const handleSubmit = () => {
    const body = {
      description: description.trim(),
      file_id: file_info?._id,
      project_id: projectId,
      parent_id: file_info?.parent_id,
    };
    dispatch(updateFile(body));
  };

  const handleClose = () => {
    onClose();
    handleSubmit();
  };

  return (
    <TextareaAutosize
      value={description}
      className="form-control"
      onBlur={handleClose}
      onChange={e => {
        setFileDescription(e.target.value);
      }}
    />
  );
}
