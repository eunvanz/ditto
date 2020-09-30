import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { useForm } from "react-hook-form";
import isEqual from "lodash/isEqual";
import PerfectScrollbar from "react-perfect-scrollbar";
import AddIcon from "@material-ui/icons/Add";
import { ProjectUrlDoc } from "../../../types";
import {
  TextField,
  makeStyles,
  Divider,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Card,
  CardHeader,
  TableBody,
  Typography,
} from "@material-ui/core";
import { regExps } from "../../../helpers/commonHelpers";

const useStyles = makeStyles(() => ({
  root: {},
}));

export interface ProjectUrlFormValues {
  label: string;
  url: string;
  description?: string;
}

export interface ProjectUrlFormProps {
  onSubmit: (values: ProjectUrlFormValues) => void;
  onDelete: (projectUrl: ProjectUrlDoc) => void;
  projectUrl?: ProjectUrlDoc;
}

const ProjectUrlForm: React.FC<ProjectUrlFormProps> = ({
  onSubmit,
  onDelete,
  projectUrl,
}) => {
  const defaultValues = useMemo(() => {
    return {
      title: projectUrl?.label,
      url: projectUrl?.url,
    };
  }, [projectUrl]);

  const { register, handleSubmit, errors, watch, reset } = useForm<
    ProjectUrlFormValues
  >({
    mode: "all",
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const watchedValues = watch();

  const isNotModified = useMemo(() => {
    return isEqual(defaultValues, watchedValues);
  }, [defaultValues, watchedValues]);

  const [isFormVisible, setIsFormVisible] = useState(false);

  const isFocusingRef = useRef<boolean>(false);

  const handleOnBlur = useCallback(() => {
    isFocusingRef.current = false;
    setTimeout(() => {
      if (!Object.keys(errors).length && !isFocusingRef.current) {
        handleSubmit(onSubmit)();
        setIsFormVisible(false);
      }
    }, 200);
  }, [errors, handleSubmit, onSubmit]);

  const handleOnFocus = useCallback(() => {
    isFocusingRef.current = true;
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card>
        <CardHeader title="베이스URL" />
        <Divider />
        <PerfectScrollbar>
          <Box minWidth={700}>
            <Table>
              <caption>
                베이스 URL은 리퀘스트 URL 설정 시에 편리하게 사용할 수 있습니다.
              </caption>
              <TableHead>
                <TableRow>
                  <TableCell component="th">라벨*</TableCell>
                  <TableCell>URL*</TableCell>
                  <TableCell>설명</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {isFormVisible ? (
                  <>
                    <TableCell>
                      <TextField
                        size="small"
                        autoFocus
                        name="label"
                        inputRef={register({
                          required: "이름표를 붙여주세요.",
                          maxLength: {
                            value: 20,
                            message: "이름이 너무 길어요.",
                          },
                        })}
                        fullWidth
                        required
                        error={!!errors.label}
                        helperText={errors.label?.message}
                        onBlur={handleOnBlur}
                        onFocus={handleOnFocus}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        name="url"
                        inputRef={register({
                          required: "URL을 입력해주세요.",
                          maxLength: {
                            value: 200,
                            message: "URL이 너무 긴 것 같아요.",
                          },
                          pattern: {
                            value: regExps.url,
                            message: "URL형식으로 입력해주세요.",
                          },
                        })}
                        fullWidth
                        required
                        error={!!errors.url}
                        helperText={errors.url?.message}
                        onBlur={handleOnBlur}
                        onFocus={handleOnFocus}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        name="description"
                        inputRef={register({
                          maxLength: {
                            value: 80,
                            message: "설명이 너무 길어요.",
                          },
                        })}
                        fullWidth
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        onBlur={handleOnBlur}
                        onFocus={handleOnFocus}
                      />
                    </TableCell>
                    <TableCell />
                  </>
                ) : (
                  <TableCell colSpan={4}>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                      onClick={() => setIsFormVisible(true)}
                    >
                      <AddIcon fontSize="small" />
                      새로운 베이스URL 등록
                    </Typography>
                  </TableCell>
                )}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
      </Card>
    </form>
  );
};

export default ProjectUrlForm;
