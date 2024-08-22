import { useCallback, useEffect, useState } from "react";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Select, Space, Typography } from "antd";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ISelectOption } from "@/common/types";

import { useStyles } from "./TagSelector.styles";

type TWithTagField = {
  tag?: ISelectOption[];
};

interface ITagSelectorProps<T extends TWithTagField> {
  control: T extends TWithTagField
    ? ReturnType<typeof useForm<T>>["control"]
    : never;
  tagOption: ISelectOption[];
  onReInit?: () => void;
  errorMessage?: string;
}

export const TagSelector = <T extends TWithTagField>({
  control,
  tagOption,
  onReInit,
  errorMessage,
}: ITagSelectorProps<T>) => {
  const { t } = useTranslation();
  const { styles, cx } = useStyles();

  const {
    fields: addedTags,
    remove: removeTag,
    append: appendTag,
  } = useFieldArray({
    control,
    name: "tag",
  });

  const [selectedTagOption, setSelectedTagOption] = useState<string>("");
  const filteredOptions = tagOption.filter(
    (o) => !addedTags.find((t) => t?.value === o.value),
  );

  const addTag = useCallback(() => {
    const option = tagOption.find((t) => t.value === selectedTagOption);
    if (option) {
      appendTag(option);
      const firstAnotherVal = filteredOptions.find(
        (v) => v.value !== option?.value,
      )?.value;
      setSelectedTagOption(firstAnotherVal || "");
    }
  }, [appendTag, filteredOptions, selectedTagOption, tagOption]);

  useEffect(() => {
    if (!selectedTagOption && filteredOptions[0]?.value) {
      setSelectedTagOption(filteredOptions[0].value);
    }
  }, [filteredOptions, selectedTagOption]);

  return (
    <Flex justify="flex-end">
      <Space direction="vertical">
        <Space
          direction="vertical"
          className={cx(errorMessage && styles.errorBorder)}
        >
          {addedTags.map((tag, index) => (
            <Controller
              render={({ field }) => (
                <Flex align="center" justify="flex-end">
                  <Space size="large" classNames={{ item: styles.tagWrapper }}>
                    <Typography.Text className={styles.tagLabel}>
                      {field.value.label}
                    </Typography.Text>
                    <MinusCircleOutlined
                      className={styles.removeTagIcon}
                      onClick={() => {
                        removeTag(index);
                      }}
                    />
                  </Space>
                </Flex>
              )}
              name={`tag.${index}`}
              control={control}
              key={tag.id}
            />
          ))}

          <Flex justify="flex-end">
            <Space size="large">
              <Select
                size="middle"
                className={styles.select}
                options={filteredOptions}
                value={selectedTagOption}
                onChange={setSelectedTagOption}
              />
              <PlusOutlined onClick={addTag} />
            </Space>
          </Flex>
        </Space>

        {errorMessage && (
          <Typography.Text type="danger">{errorMessage}</Typography.Text>
        )}
        {onReInit && (
          <Button
            type="primary"
            className={styles.reInitButton}
            onClick={onReInit}
          >
            {t("common.form.buttons.reInit")}
          </Button>
        )}
      </Space>
    </Flex>
  );
};
