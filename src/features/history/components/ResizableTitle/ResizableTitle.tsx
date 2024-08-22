import { HTMLAttributes, SyntheticEvent } from "react";

import { Resizable, ResizeCallbackData } from "react-resizable";

import { useStyles } from "./ResizableTitle.styles";

export const ResizableTitle = ({
  onResize,
  width,
  ...restProps
}: HTMLAttributes<Element> & {
  onResize: (e: SyntheticEvent, data: ResizeCallbackData) => void;
  width: number;
}) => {
  const { styles } = useStyles();

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className={styles.reactResizableHandle}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};
