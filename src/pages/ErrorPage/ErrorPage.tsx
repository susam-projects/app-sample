import { FC } from "react";

import { useRouteError } from "react-router-dom";

import { useStyles } from "./ErrorPage.styles.ts";

export const ErrorPage: FC = () => {
  const { styles } = useStyles();

  const error = useRouteError() as any as Record<string, string>;
  console.error(error);

  return (
    <div className={styles.errorPage}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
};
