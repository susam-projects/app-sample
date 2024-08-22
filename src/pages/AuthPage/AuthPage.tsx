import { FC, useState } from "react";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Flex, Form, Input, Space, Typography } from "antd";
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

import { CenteredContentPage, THandleSubmit } from "@/common/components";
import i18n from "@/common/i18n";
import { authService } from "@/features/authentication";

import { useStyles } from "./AuthPage.styles.ts";

const getAuthFormSchema = (args: { allowEmptyCredentials: boolean }) => {
  function optionalIfAllowEmptyCredentials<T extends z.ZodTypeAny>(z: T) {
    if (args.allowEmptyCredentials) {
      return z.optional();
    }
    return z;
  }

  return z.object({
    userName: optionalIfAllowEmptyCredentials(
      z
        .string({ required_error: i18n.t("common.form.error.required") })
        .min(1, i18n.t("common.form.error.required"))
        .trim(),
    ),

    password: optionalIfAllowEmptyCredentials(
      z
        .string({ required_error: i18n.t("common.form.error.required") })
        .min(1, i18n.t("common.form.error.required"))
        .trim(),
    ),
  });
};

export type TAuthFormValues = z.infer<ReturnType<typeof getAuthFormSchema>>;

export const AuthPage: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { styles } = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [shouldShowError, setShouldShowError] = useState(false);
  const hideError = () => setShouldShowError(false);
  const showError = () => setShouldShowError(true);

  const { handleSubmit, control } = useForm<TAuthFormValues>({
    resolver: zodResolver(
      getAuthFormSchema({
        allowEmptyCredentials: authService.isCredentialsOverride(),
      }),
    ),
  });

  const handleFinish = async ({ userName, password }: TAuthFormValues) => {
    setIsLoading(true);
    const isAuthenticated = await authService.authenticate(userName, password);
    setIsLoading(false);
    if (isAuthenticated) {
      navigate("/");
    } else {
      showError();
    }
  };

  return (
    <CenteredContentPage>
      <Card>
        <Flex justify="center">
          <Typography.Title level={1} className={styles.title}>
            {t("auth.title")}
          </Typography.Title>
        </Flex>
        <Space direction="vertical" className={styles.inputWrapper}>
          <Form
            name="auth"
            onSubmitCapture={handleSubmit(handleFinish) as THandleSubmit}
          >
            <FormItem control={control} name="userName" required>
              <Input
                placeholder={t("auth.userName")}
                prefix={<UserOutlined className={styles.inputPrefix} />}
                onChange={hideError}
                disabled={isLoading}
              />
            </FormItem>
            <FormItem control={control} name="password" required>
              <Input.Password
                placeholder={t("auth.password")}
                prefix={<LockOutlined className={styles.inputPrefix} />}
                onChange={hideError}
                disabled={isLoading}
              />
            </FormItem>
            {shouldShowError && (
              <Typography.Paragraph
                type={"danger"}
                className={styles.errorText}
              >
                {t("auth.loginError")}
              </Typography.Paragraph>
            )}
            <Button
              className={styles.loginButton}
              htmlType="submit"
              loading={isLoading}
            >
              {t("auth.login")}
            </Button>
          </Form>
        </Space>
      </Card>
    </CenteredContentPage>
  );
};
