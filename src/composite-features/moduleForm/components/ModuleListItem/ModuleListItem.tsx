import { FC, useEffect, useRef } from "react";

import { Checkbox, Col, Row, Flex, Tooltip, Typography } from "antd";
import { Controller, useForm, useWatch } from "react-hook-form";

import { DatePickerField } from "@/common/containers";

import { TModuleListFormValues } from "../../models/formSchema.ts";

import { useStyles } from "./ModuleListItem.styles.ts";

interface IModuleListItemProps {
  index: number;
  control: ReturnType<typeof useForm<TModuleListFormValues>>["control"];
  setValue: ReturnType<typeof useForm<TModuleListFormValues>>["setValue"];
  name: string;
  id: string;
  selectedModuleId?: string;
}

export const ModuleListItem: FC<IModuleListItemProps> = ({
  index,
  control,
  setValue,
  name,
  id,
  selectedModuleId,
}) => {
  const { styles, cx } = useStyles();
  const isEnabled = useWatch({ control, name: `modules.${index}.isEnabled` });
  const divElement = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedModuleId || selectedModuleId !== id || !divElement.current)
      return;

    divElement.current.scrollIntoView({
      behavior: "auto",
      block: "start",
    });
  }, [id, selectedModuleId]);

  const toggleCheckboxHandler = () => {
    setValue(`modules.${index}.isEnabled`, !isEnabled);
  };

  return (
    <Row
      align="middle"
      gutter={16}
      className={cx(styles.rowWidth, styles.rowPadding)}
      ref={divElement}
    >
      <Col span={15}>
        <Flex>
          <Controller
            render={({ field: { value, ...rest } }) => {
              return (
                <Checkbox
                  checked={!!value}
                  className={styles.checkboxMargin}
                  {...rest}
                />
              );
            }}
            name={`modules.${index}.isEnabled`}
            control={control}
          />
          <Tooltip title={name}>
            <Typography.Text
              className={styles.spanName}
              onClick={toggleCheckboxHandler}
              ellipsis
            >
              {name}
            </Typography.Text>
          </Tooltip>
        </Flex>
      </Col>
      <Col span={9}>
        <Flex>
          <DatePickerField
            control={control}
            name={`modules.${index}.value`}
            disabled={!isEnabled}
          />
        </Flex>
      </Col>
    </Row>
  );
};
