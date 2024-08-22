import { ComponentProps, forwardRef } from "react";

import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Select } from "antd";

import { ISelectOption } from "@/common/types";

import { useStyles } from "./EditShop.styles";

interface IPumpGroupSelectProps extends ComponentProps<typeof Select> {
  pumpGroupOption: ISelectOption[];
  onPlusClick: () => void;
}

const PumpGroupSelectComponent = (
  { pumpGroupOption, onPlusClick, ...rest }: IPumpGroupSelectProps,
  ref?: ComponentProps<typeof Select>["ref"],
) => {
  const { styles } = useStyles();

  return (
    <Flex>
      <Select size="middle" options={pumpGroupOption} ref={ref} {...rest} />
      <Button className={styles.plusButton} onClick={onPlusClick}>
        <PlusOutlined />
      </Button>
    </Flex>
  );
};

export const PumpGroupSelect = forwardRef(PumpGroupSelectComponent);
