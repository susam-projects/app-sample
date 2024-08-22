import { ComponentProps, FC, memo } from "react";

import { DatePicker } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import dayjs from "dayjs";
import { Control, Controller } from "react-hook-form";

import { DATE_FORMAT } from "@/common/constants";

import { useStyles } from "./DatePickerField.styles";

type TFormValue = string | null;

type TAntdValue = dayjs.Dayjs | null;

const toAntdValue = (
  formValue: TFormValue,
  dateFormat = DATE_FORMAT,
): TAntdValue => {
  return formValue ? dayjs(formValue, dateFormat) : null;
};

const toFormValue = (
  antdValue: TAntdValue,
  dateFormat = DATE_FORMAT,
): TFormValue => {
  return antdValue?.format(dateFormat) || null;
};

interface IDatePickerFieldProps extends ComponentProps<typeof DatePicker> {
  name: string;
  control: Control<any>;
  placeholder?: string;
  size?: SizeType;
  disabled?: boolean;
  dateFormat?: string;
  width?: string;
  noYear?: boolean;
}

const DatePickerComponent: FC<IDatePickerFieldProps> = ({
  name,
  control,
  placeholder,
  size = "middle",
  disabled = false,
  dateFormat = DATE_FORMAT,
  width = "auto",
  noYear = false,
  ...rest
}) => {
  const { styles, cx } = useStyles();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, ref }, fieldState }) => {
        return (
          <div>
            <DatePicker
              status={fieldState.error ? "error" : undefined}
              size={size}
              format={dateFormat}
              value={toAntdValue(value ? String(value) : null, dateFormat)}
              onChange={(val) => {
                onChange(toFormValue(val as TAntdValue, dateFormat));
              }}
              ref={ref}
              placeholder={placeholder}
              disabled={disabled}
              style={{ width }}
              popupClassName={cx(noYear && styles.datePickerWithNoYear)}
              {...rest}
            />
            {fieldState.error && !disabled ? (
              <div>
                <span className={styles.errorMessage}>
                  {fieldState.error?.message}
                </span>
              </div>
            ) : null}
          </div>
        );
      }}
    />
  );
};

export const DatePickerField = memo(DatePickerComponent);
