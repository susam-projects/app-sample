import { FC } from "react";

import { Avatar, Flex, Space, Typography } from "antd";

import { useStyles } from "./UserInfoUI.styles.ts";

interface UserInfoUIProps {
  firstName?: string | null;
  lastName?: string | null;
}

const abbreviate = (
  firstName: string | undefined | null,
  lastName: string | undefined | null,
) => {
  return (
    (firstName?.charAt(0).toUpperCase() || "") +
    (lastName?.charAt(0).toUpperCase() || "")
  );
};

export const UserInfoUI: FC<UserInfoUIProps> = ({
  firstName = "",
  lastName = "",
}) => {
  const { styles } = useStyles();

  return (
    <Flex className={styles.root}>
      <Space>
        <Avatar size="large" className={styles.avatar}>
          <Typography className={styles.name}>
            {abbreviate(firstName, lastName)}
          </Typography>
        </Avatar>
        <Flex vertical>
          <Typography className={styles.name}>{firstName}</Typography>
          <Typography className={styles.name}>{lastName}</Typography>
        </Flex>
      </Space>
    </Flex>
  );
};
