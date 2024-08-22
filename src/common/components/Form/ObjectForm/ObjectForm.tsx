import {
  ComponentProps,
  forwardRef,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Form, Spin, Typography } from "antd";
import debounce from "lodash/debounce";
import { useTranslation } from "react-i18next";

import { useStyles } from "./ObjectForm.styles.ts";

interface IObjectFormProps extends ComponentProps<typeof Form> {
  isLoading?: boolean;
  skipLoading?: boolean;
  header?: ReactNode;
  formContent?: ReactNode;
  footer?: ReactNode;
}

const useDebouncedLoading = (isLoading?: boolean, skipLoading?: boolean) => {
  const [internalIsLoading, setInternalIsLoading] = useState(!skipLoading);

  const setLoadingIsFinished = useMemo(
    () =>
      debounce(() => setInternalIsLoading(false), 300, {
        leading: false,
        trailing: true,
      }),
    [],
  );

  useEffect(() => {
    if (isLoading) {
      setLoadingIsFinished.cancel();
      setInternalIsLoading(true);
    } else {
      setLoadingIsFinished();
    }
  }, [setLoadingIsFinished, isLoading]);

  return { internalIsLoading };
};

const ObjectFormComponent = (
  {
    isLoading,
    skipLoading,
    header,
    formContent,
    footer,
    className,
    ...rest
  }: IObjectFormProps,
  ref: ComponentProps<typeof Form>["ref"],
) => {
  const { t } = useTranslation();
  const { styles, cx } = useStyles();

  const loadingTip = t("common.form.loading");

  const { internalIsLoading } = useDebouncedLoading(isLoading, skipLoading);

  return internalIsLoading ? (
    <div className={styles.loadingRoot}>
      <Spin size="large" tip={loadingTip}>
        <Typography className={styles.loadingFillerText}>
          {loadingTip}
        </Typography>
      </Spin>
    </div>
  ) : (
    <Form ref={ref} className={cx(styles.root, className)} {...rest}>
      <section className={styles.contentRoot}>
        <header>{header}</header>
        <section className={styles.content}>{formContent}</section>
      </section>
      <footer className={styles.footer}>{footer}</footer>
    </Form>
  );
};

export const ObjectForm = forwardRef(ObjectFormComponent);
