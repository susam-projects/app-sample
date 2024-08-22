import { ComponentProps } from "react";

import { Form, Segmented } from "antd";
import { Control, Controller, FieldValues, FieldPath } from "react-hook-form";

import { useStyles } from "./SegmentedField.styles.ts";

interface ISegmentedFieldProps<TFieldValues extends FieldValues>
  extends ComponentProps<typeof Segmented> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  required?: boolean;
}

export const SegmentedField = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  required,
  className,
  disabled,
  ...segmentedProps
}: ISegmentedFieldProps<TFieldValues>) => {
  const { styles, cx } = useStyles();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Form.Item
          label={label}
          required={required}
          help={fieldState.error?.message}
          validateStatus={fieldState?.error ? "error" : undefined}
        >
          <Segmented
            {...segmentedProps}
            value={field.value || null}
            disabled={field.disabled || disabled}
            onChange={field.onChange}
            onBlur={field.onBlur}
            className={cx(fieldState?.error && styles.error, className)}
          />
        </Form.Item>
      )}
    />
  );
};
