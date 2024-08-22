import React, { FC } from "react";

// Initializing store before router
/* eslint-disable-next-line import/order */
import { store } from "./store";

import { ConfigProvider } from "antd";
import { ThemeProvider } from "antd-style";
import { I18nextProvider } from "react-i18next";
import { Provider as StoreProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { router } from "@/app/router";
import i18n from "@/common/i18n";
import { customTokens, theme } from "@/uikit";

import "antd/dist/reset.css";

export const App: FC = () => {
  return (
    <React.StrictMode>
      <StoreProvider store={store}>
        <I18nextProvider i18n={i18n}>
          <ConfigProvider>
            <ThemeProvider theme={theme} customToken={customTokens}>
              <RouterProvider router={router} />
            </ThemeProvider>
          </ConfigProvider>
        </I18nextProvider>
      </StoreProvider>
    </React.StrictMode>
  );
};
