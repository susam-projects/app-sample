import { ComponentProps, ReactNode } from "react";

import { MinusCircleOutlined } from "@ant-design/icons";
import { DatePicker, Form, Space, Typography } from "antd";
import dayjs from "dayjs";
import {
  Control,
  Controller,
  FieldError,
  useFieldArray,
  UseFormTrigger,
} from "react-hook-form";

import { DATE_FORMAT } from "@/common/constants";

import { useStyles } from "./ClosingPeriods.styles.ts";

export interface IClosingPeriod {
  start: string | null;
  end: string | null;
}

type TFormValue = IClosingPeriod | null;

interface IFormValueError {
  start: FieldError;
  end: FieldError;
}

type TWithClosingPeriodsField = {
  closingPeriods?: TFormValue[];
};

interface IClosingPeriodsProps<TFormValues extends TWithClosingPeriodsField> {
  label: string;
  control: TFormValues extends TWithClosingPeriodsField
    ? Control<TFormValues>
    : never;
  trigger: TFormValues extends TWithClosingPeriodsField
    ? UseFormTrigger<TFormValues>
    : never;
  suffix?: ReactNode;
  errorMessage?: string;
}

type TAntdValue = ComponentProps<typeof DatePicker.RangePicker>["value"];

const toAntdValue = (formValue: TFormValue): TAntdValue => {
  return [
    formValue?.start ? dayjs(formValue.start, DATE_FORMAT) : null,
    formValue?.end ? dayjs(formValue.end, DATE_FORMAT) : null,
  ];
};

const toFormValue = (antdValue: TAntdValue): TFormValue => {
  return {
    start: antdValue?.[0]?.format(DATE_FORMAT) || null,
    end: antdValue?.[1]?.format(DATE_FORMAT) || null,
  };
};

export const ClosingPeriods = <TFormValues extends TWithClosingPeriodsField>({
  control,
  trigger,
  label,
  suffix,
  errorMessage,
}: IClosingPeriodsProps<TFormValues>) => {
  const {
    fields: closingPeriods,
    remove,
    append,
    update,
  } = useFieldArray({
    control,
    name: "closingPeriods",
  });

  const { styles, cx } = useStyles();

  return (
    <Space direction="vertical">
      <Typography.Text>{label}</Typography.Text>

      <Form.Item wrapperCol={{ span: "100%" }}>
        <Space direction="vertical">
          <Space
            direction="vertical"
            className={cx(errorMessage && styles.errorBorder)}
          >
            {closingPeriods.map((closingPeriod, index) => (
              <Controller
                key={closingPeriod.id}
                control={control}
                name={`closingPeriods.${index}`}
                render={({ field, fieldState }) => {
                  const fieldError = fieldState.error as
                    | FieldError
                    | IFormValueError
                    | undefined;
                  const error =
                    (fieldError as FieldError)?.message ||
                    (fieldError as IFormValueError)?.start?.message ||
                    (fieldError as IFormValueError)?.end?.message;

                  return (
                    <Form.Item
                      help={error}
                      validateStatus={error ? "error" : undefined}
                    >
                      <Space>
                        <DatePicker.RangePicker
                          ref={field.ref}
                          value={toAntdValue(field.value)}
                          onChange={(val) => {
                            update(index, toFormValue(val));
                            void trigger(`closingPeriods.${index}`);
                          }}
                          onBlur={field.onBlur}
                          allowClear={false}
                        />
                        <MinusCircleOutlined
                          className={styles.removePeriodIcon}
                          onClick={() => remove(index)}
                        />
                      </Space>
                    </Form.Item>
                  );
                }}
              />
            ))}

            <Form.Item wrapperCol={{ span: 25 }} noStyle>
              <DatePicker.RangePicker
                className={styles.addPeriodPicker}
                onChange={(val) => {
                  append(toFormValue(val));
                }}
              />
            </Form.Item>
          </Space>

          {errorMessage && (
            <Typography.Text type="danger">{errorMessage}</Typography.Text>
          )}
        </Space>
      </Form.Item>

      {suffix}
    </Space>
  );
};
