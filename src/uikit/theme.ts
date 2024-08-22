import { ThemeConfig } from "antd";
import { CustomToken } from "antd-style";

declare module "antd-style" {
  export interface CustomToken {
    customYellow: string;
    customYellowLight: string;
    customGreen: string;
    customGreenLight: string;
    customGreenMiddle: string;
    customBlue: string;
    customBlueMiddle: string;
    customBlueLight: string;
    customRed: string;
    customGreyNeutral: string;
  }
}

export const customTokens: CustomToken = {
  customYellow: "#FFBC00",
  customYellowLight: "#FEF7E2",
  customGreen: "#52C41A",
  customGreenLight: "#FFF6ED",
  customGreenMiddle: "#B7EB8F",
  customBlue: "#0075BF",
  customBlueMiddle: "#48AAEE",
  customBlueLight: "#E2F4FF",
  customRed: "#F44336",
  customGreyNeutral: "#C5C6C7",
};

export const theme: ThemeConfig = {
  token: {
    colorPrimary: "#482882",
    colorLink: "#2B184E",
    colorError: "#FF4E58",
    colorBorder: "#D9D9D9",
    colorTextPlaceholder: "#8E8E93",
    colorIcon: "#575757",
    colorBgContainerDisabled: "#F7F7FA",
    colorTextDisabled: "#575757",
    controlItemBgHover: "#F0EBF9",
    fontSize: 16,
  },
  components: {
    Layout: {
      bodyBg: "#FCFCFD",
    },
    Button: {
      defaultColor: "#2B184E",
      defaultHoverColor: "#2B184E",
    },
    Tree: {
      colorBgContainer: "#FCFCFD",
      nodeSelectedBg: "#F0EBF9",
      nodeHoverBg: "#F7F7FA",
      colorText: "#2B184E",
    },
    Menu: {
      itemActiveBg: "#F0EBF9",
      itemHoverBg: "#F7F7FA",
      itemSelectedBg: "#F0EBF9",
    },
  },
};

// TODO: remove it. keeping it for reference for now
// const colors = {
//   // main colors: violet, black, white
//   // also there are: red, yellow, green, blue
//
//   main: "#482882",
//   secondary: "#F0EBF9",
//   mainText: "#2B184E",
//   red: "#FF4E58",
//   white: "#FFF",
//   black: "#000",
//
//   accent: {
//     yellow: "#FFBC00",
//     yellowLight: "#FEF7E2",
//     green: "#52C41A",
//     greenLight: "#FFF6ED",
//     greenMiddle: "#B7EB8F", // border
//     blue: "#0075BF", // secondary accent
//     blueLight: "#E2F4FF", // secondary accent
//     red: "#F44336",
//   },
//
//   info: {
//     bg: "#FFFBE6",
//     color: "#FAAD14",
//     text: "#3C4043",
//   },
//
//   icon: {
//     color: "#694696",
//     colorLight: "#E2D8F3",
//   },
//
//   text: {
//     main: "{colors.main}",
//     mainContrast: "{colors.white}",
//     sup1: "",
//     sup2: "#444444",
//   },
//
//   button: {
//     main: {
//       bg: "{colors.main}",
//       color: "#FFF",
//     },
//     textButton: "{colors.mainText}",
//     secondary: {
//       bg: "{colors.white}",
//       border: "{color.main}",
//       color: "{colors.mainText}",
//     },
//     mainDisabled: {
//       bg: "#F7F7FA",
//       color: "#575757",
//     },
//   },
//
//   accordion: {
//     headerBg: "#ECF1F4",
//     headerMainText: "{colors.mainText}",
//     headerSupText: "#B2B0C2",
//     contentText: "#000",
//     contentSupText: "#B6B6B6",
//   },
//
//   card: {
//     bg: "{colors.white}",
//     supButtons: "#D9D9D9",
//   },
//
//   twoColorTable: {
//     headerBg: "#FAFAFA",
//     evenRowBg: "#F7F7FA",
//     oddRowBg: "#FCFCFD",
//     border: "#EBEBEB",
//     textColor: "#3C4043",
//     textColor2: "{colors.mainText}",
//     textButton: "{colors.button.textButton}",
//   },
//
//   simpleTable: {
//     bg: "{colors.white}",
//   },
//
//   login: {
//     input: {
//       border: "#D9D9D9",
//       color: "{colors.mainText}",
//       label: "{colors.mainText}",
//     },
//   },
//
//   page: {
//     bg: "#FCFCFD",
//     header: {
//       bg: "{colors.white}",
//       color: "{colors.mainText}",
//       border: "#F0F0F0",
//     },
//     mainMenu: {
//       bg: "{colors.white}",
//       color: "#262626",
//       activeItemBg: "#F0EBF9",
//       activeItemColor: "{colors.mainText}",
//     },
//     button: {
//       bg: "#F7F7FA",
//       color: "#3C4043",
//       activeBg: "{colors.yellow}",
//       activeColor: "{colors.white}",
//     },
//     tabs: {
//       activeTabBg: "{colors.white}",
//       nonActiveTabBg: "#FAFAFA",
//       activeTabColor: "{colors.main}",
//       nonActiveTabColor: "#262626",
//     },
//     menu: {
//       bg: "#FCFCFD",
//       activeItemBg: "#F0EBF9",
//       text: "{colors.mainText}",
//     },
//     content: {
//       inputBorder: "#F2F2F5",
//       inputPlaceholder: "#8E8E93",
//       inputIcon: "#575757",
//       heading: "",
//       itemBg: "#F2F2F5",
//       itemColor: "{colors.mainText}",
//       itemInputBg: "{colors.white}",
//       itemInputColor: "{colors.mainText}",
//       itemInputDisabledBg: "#F7F7FA",
//       itemInputDisabledColor: "#C5C6C7",
//     },
//     switch: {
//       color: "{colors.white}",
//       bg: "#FEC010",
//     },
//   },
// };
