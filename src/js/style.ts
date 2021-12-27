import styled from "styled-components";
import {motion} from "framer-motion";

export const StyledSortPage = styled.div`
  width: 100%;
  height: 100%;
  min-width: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: #212121;
`;

export const StyledControlsSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-height: 70%;
  overflow-y: auto;
  width: 100%;
`;

export const titleTextTheme = {
    textColor: "#9d9393",
    fontSize: "1.4em",
    textAlign: "left",
    fontWeight: "600"
};

export const descriptionTextTheme = {
    textColor: "#b9b9b9",
    fontSize: "1.2em",
    textAlign: "left",
    fontWeight: "600"
};

export const samplesTextTheme = {
    textColor: "#b9b9b9",
    fontSize: "1.2em",
    fontWeight: 800,
    textAlign: "left",
    margin: "0px 0px 20px 0px"
};

export const samplesValueTextTheme = {
    textColor: "#b9b9b9",
    fontSize: "1.6em",
    fontWeight: 800,
    textAlign: "left",
    margin: "0px 0px 20px 0px"
};

export const sliderTheme = {
    width: "300px",
    height: 30,
    trackHeight: 2,
    railHeight: 2,
    fillProgressColor: 'rgba(51,125,255,0)',
    thumbColor: 'transparent',
    thumbSize: 40,
    thumbMargin: {
        marginTop: -15,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: -14
    },
    valueLabelPositionLeft: "calc(-50% + 15px)",
    valueLabelBackground: '#9A9FB4',
    valueLabelFontColor: '#ffffff',
    markLabelFontColor: '#4d4d4d',
    markLabelActiveFontColor: '#9A9FB4',
    markLabelActiveFontWeight: 700,
    markColor: '#adadad',
    markActiveColor: '#9A9FB4',
    railColor: '#5d63ad',
    trackColor: '#1a1a1a',
    markSize: 8,
    markActiveSize: 8,
    modernMarkLabelFontSize: "1em",
    modernMinMarkLabelTopMargin: 45,
    modernMinMarkLabelRightMargin: 0,
    modernMaxMarkLabelRightMargin: 0,
    modernMaxMarkLabelTopMargin: 45,
    markMargin: {
        marginTop: -3,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: -2
    },
    markActiveMargin: {
        marginTop: -3,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: -2
    }
};

export const stopPauseButtonTheme = {
    width: "50%",
    height: "50px",
    background: "#646875",
    disabledBackground: "#c4dbff",
    hoverBackground: "#727786",
    border: "none",

    text: {
        textColor: "#ffffff",
        disabledTextColor: "rgba(255,255,255,1)",
        textAlign: 'center',
        fontSize: '1.2em',
        fontWeight: 600
    }
};

export const selectTheme = {
    // Size
    width: "300px",
    height: 50,

    // List
    listBorderRadius: 14,
    listBackgroundColor: '#1a1a1a',

    // List item
    itemHeight: 40,
    itemTextColor: "#dcdcdc",
    itemSelectedTextColor: "#dcdcdc",
    itemHoverBackgroundColor: '#414141',
    itemSelectedBackgroundColor: '#5865F2',
    itemHoverTextColor:  '#dcdcdc',
    itemFontSize: '0.9em',
    itemFontWeight: 600,

    // Selected value
    selectedValueTextColor: '#c0c0c0',
    selectedValueFontWeight: 600,
    selectedValueFontSize: '1.0em',

    // Arrow
    arrowColor: '#c0c0c0',
    arrowColorHover: '#c0c0c0',
    arrowColorDisabled: 'rgba(192,192,192,0.33)',

    // Separator line
    indicatorSeparatorColor: '#afafaf',
    indicatorSeparatorDisplay: 'none',

    // Placeholder
    placeholderTextColor: '#c0c0c0',
    placeholderTextColorDisabled: 'rgba(192,192,192,0.25)',
    placeholderFontSize: '1em',
    placeholderFontWeight: 500,

    // Other
    border: 'none',
    backgroundColor: '#2a2a2a',
    backgroundColorDisabled: 'rgba(47,47,47,0.42)',
    borderRadius: 7,
    menuBorderRadius: 7,
    optionBorderRadius: 4,
    boxShadow: "0 9px 15px 0 rgba(0, 0, 0, 0.12)",
    cursorOnHover: 'pointer'
};

export const shuffleButtonTheme = {
    width: "200px",
    height: "50px",
    background: "#646875",
    disabledBackground: "#c4dbff",
    hoverBackground: "#4a4d57",
    borderRadius: "10px",
    border: "none",

    text: {
        textColor: "#ffffff",
        disabledTextColor: "rgba(255,255,255,1)",
        textAlign: 'center',
        fontSize: '1.2em',
        fontWeight: 600
    }
};

export const StyledSortButtonContent = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const sortTextTheme = (disabled) => {
    return {
        textColor: !disabled ? "#ffffff" : "rgba(136,136,136,0.8)",
        disabledTextColor: "rgba(255,255,255,1)",
        textAlign: 'center',
        fontWeight: 800,
        fontSize: '1.2em'
    };
};

export const sortButtonTheme = {
    width: "300px",
    height: "50px",
    background: "#5d63ad",
    disabledBackground: "rgba(93,99,173,0.32)",
    hoverBackground: "#666cbd",
    borderRadius: "6px",
    border: "none",
    text: {
        textColor: "#ffffff",
        disabledTextColor: "rgba(255,255,255,0.34)",
        textAlign: 'center',
        fontSize: '1.2em'
    }
};

export const StyledTitleSection = styled.div`
  width: calc(100% / 3);
  display: flex;
  padding: 20px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const StyledStopStartPauseButtons = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const StyledDoubleButton = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 6px;
  overflow: hidden;
  width: 300px;
  background: #33495F;
  align-items: center;
  justify-content: center;
`;

export const StyledSortVisualiserWindow2 = styled.div`
  padding: 20px;
  box-shadow: 0 0 150px 36px rgba(0, 117, 255, 0.26);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
  min-width: 900px;
  height: 700px;
  border-radius: 10px;
  background: white;
  overflow: auto;

  @media (max-width: 1024px) {
    align-items: center;
    justify-content: center;
    width: 100%;
    border-radius: 0;
    height: 100%;
    max-height: 100%;
    min-width: 100%;
    text-align: center;
  }
`;

export const StyledChart = styled(motion.div)`
  flex: 1 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 50%;
  padding: 0px;
  box-sizing: border-box;
  // prevents from growing with inner canvas:
  overflow: hidden;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

export const StyledShuffle = styled.div`
    max-height: 40px;
`;

export const animatedProps = {
    initial: {opacity: 0, y: -50},
    animate: {opacity: 1, y: 0},
    transition: {type: "spring", stiffness: 560, damping: 30, delay: 0.2}
};

export const animatedProps2 = {
    initial: {opacity: 0, y: -50},
    animate: {opacity: 1, y: 0},
    transition: {type: "spring", stiffness: 560, damping: 30, delay: 0.1}
};