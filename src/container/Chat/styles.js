import { StyleSheet } from "react-native";
import { color, appStyle } from "../../utility";

export default StyleSheet.create({
  sendMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderRadius: 20,
    // borderBottomLeftRadius: 20,
    width: "75%",
  },

  sendBtnContainer: {
    height: appStyle.fieldHeight,
    //backgroundColor: color.DARK_GRAY,
    // borderTopRightRadius: 20,
    // borderBottomRightRadius: 20,
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
    //width: "29%",
  },
});
