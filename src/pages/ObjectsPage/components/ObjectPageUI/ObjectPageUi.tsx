import { ComponentProps, FC, ReactNode } from "react";

import { Dropdown, Input, Select, Space } from "antd";
import { useTranslation } from "react-i18next";

import { ResizableSiderPage } from "@/common/components";
import { UserInfo } from "@/feature-blocks/userInfo";
import { TasksButton } from "@/features/tasks";

import { useStyles } from "./ObjectPageUi.styles.ts";

interface IObjectPageUiProps {
  hideSearch: boolean;
  inputValue: NonNullable<ComponentProps<typeof Input.Search>["value"]>;
  onInputChange: NonNullable<ComponentProps<typeof Input.Search>["onChange"]>;
  onInputSearch: NonNullable<ComponentProps<typeof Input.Search>["onSearch"]>;
  tagOptions: NonNullable<ComponentProps<typeof Select<string>>["options"]>;
  selectedTag: ComponentProps<typeof Select<string>>["value"];
  onTagSelect: NonNullable<ComponentProps<typeof Select<string>>["onSelect"]>;
  onTagClear: NonNullable<ComponentProps<typeof Select<string>>["onClear"]>;
  userMenuItems: NonNullable<ComponentProps<typeof Dropdown>["menu"]>["items"];
  objectTree: ReactNode;
  objectForm: ReactNode;
}

export const ObjectPageUi: FC<IObjectPageUiProps> = ({
  hideSearch,
  onInputChange,
  onInputSearch,
  tagOptions,
  selectedTag,
  onTagSelect,
  onTagClear,
  userMenuItems,
  objectTree,
  objectForm,
}) => {
  const { t } = useTranslation();
  const { styles } = useStyles();

  return (
    <ResizableSiderPage
      name="objects-page"
      minSiderWidth={300}
      maxSiderWidth={1200}
      defaultSiderWidth={550}
      header={
        <>
          <Space align="start">
            {!hideSearch && (
              <Input.Search
                className={styles.searchInput}
                placeholder={t("objectsPage.searchPlaceholder")}
                allowClear
                onChange={onInputChange}
                onSearch={onInputSearch}
              />
            )}
            {!hideSearch && (
              <Select
                className={styles.tagSelect}
                placeholder={t("objectsPage.tagsPlaceholder")}
                allowClear
                options={tagOptions}
                value={selectedTag}
                onSelect={onTagSelect}
                onClear={onTagClear}
              />
            )}
          </Space>
          <Space>
            <TasksButton />
            <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
              <div className={styles.userInfoWrapper}>
                <UserInfo />
              </div>
            </Dropdown>
          </Space>
        </>
      }
      sider={objectTree}
      content={objectForm}
    />
  );
};
