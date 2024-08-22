import { ComponentProps, FC, useEffect, useMemo, useState } from "react";

import { notification, Spin } from "antd";
import debounce from "lodash/debounce";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { useOnMount } from "@/common/hooks";
import i18n from "@/common/i18n";
import {
  filterTree,
  ObjectTree,
  useObjectsRouting,
  selectIsLoading,
} from "@/feature-blocks/objectTree";
import { authService } from "@/features/authentication";

import { ObjectPageUi } from "./components/ObjectPageUI/ObjectPageUi.tsx";
import { selectTags, loadTags } from "./store/objectsPage.slice.ts";

type TMenuItems = ComponentProps<typeof ObjectPageUi>["userMenuItems"];

export const ObjectsPage: FC = () => {
  const navigate = useNavigate();
  const [notify, notificationContext] = notification.useNotification();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const tagOptions = useAppSelector(selectTags);
  const isLoading = useAppSelector(selectIsLoading);

  const [searchValue, setSearchValue] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useOnMount(() => {
    const loadData = debounce(
      () => {
        void dispatch(
          loadTags({
            onError: () => {
              notify.error({ message: t("objectsPage.error.loadingInitData") });
            },
          }),
        );
      },
      300,
      { leading: false, trailing: true },
    );
    // TODO: uncomment when there's API for tags
    // void loadData();

    return () => {
      loadData.cancel();
    };
  });

  const filterData = useMemo(
    () =>
      debounce(
        (...args: Parameters<typeof filterTree>) => {
          void dispatch(filterTree(...args));
        },
        300,
        { leading: false, trailing: true },
      ),
    [dispatch],
  );

  useEffect(() => {
    const onError = () => {
      notify.error({
        message: t("objectsPage.error.filteringData"),
      });
    };

    filterData({ searchValue, tag: selectedTag, onError });
  }, [filterData, notify, searchValue, selectedTag, t]);

  const userMenuItems: TMenuItems = useMemo(() => {
    const handleLogoutClick = () => {
      authService.logout();
      navigate("/auth");
    };

    return [
      {
        label: (
          <div onClick={handleLogoutClick}>{i18n.t("objectsPage.logout")}</div>
        ),
        key: "0",
      },
    ];
  }, [navigate]);

  useObjectsRouting();

  return (
    <>
      {notificationContext}
      <ObjectPageUi
        hideSearch // TODO: remove when enabling search function
        inputValue={searchValue}
        onInputChange={(event) => {
          setSearchValue(event.target.value);
        }}
        onInputSearch={(value) => {
          setSearchValue(value);
        }}
        tagOptions={tagOptions}
        selectedTag={selectedTag}
        onTagSelect={(value) => {
          setSelectedTag(value);
        }}
        onTagClear={() => {
          setSelectedTag(null);
        }}
        userMenuItems={userMenuItems}
        objectTree={<ObjectTree />}
        objectForm={
          <>
            {isLoading && (
              <Spin
                size="large"
                fullscreen
                tip={t("objectsPage.loadingForm")}
              />
            )}
            <Outlet />
          </>
        }
      />
    </>
  );
};
