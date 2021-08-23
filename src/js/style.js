import Select from "react-select";
import styled from "styled-components";
import {motion} from "framer-motion";

export const titleTextTheme = {
    textColor: "#337dff",
    fontSize: "2.4em",
    textAlign: "left",
    fontWeight: "900"
};

export const descriptionTextTheme = {
    textColor: "hsl(0, 0%, 20%)",
    fontSize: "1.2em",
    textAlign: "left",
};

export const fieldDescriptionTextTheme = {
    textColor: "hsl(0, 0%, 20%)",
    fontSize: "1em",
    textAlign: "left",
    margin: "20px 0px 20px 0px"
};

export const sliderTheme = {
    width: "100%",
    trackHeight: 2,
    railHeight: 2,
    fillProgressColor: '#337dff',
    thumbColor: '#75A7FF',
    thumbSize: 20,
    thumbMargin: {
        marginTop: -10,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: -5
    },
    valueLabelBackground: '#337dff',
    valueLabelFontColor: '#ffffff',
    markLabelFontColor: 'hsl(0, 0%, 20%)',
    markLabelActiveFontColor: '#337dff',
    markLabelActiveFontWeight: 700,
    markColor: '#75A7FF',
    markActiveColor: '#337dff',
    railColor: '#75A7FF',
    markSize: 8,
    markActiveSize: 8,
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

export const stopButtonTheme = {
    width: "50%",
    height: "50px",
    background: "#0085FF",
    disabledBackground: "#c4dbff",
    hoverBackground: "#336bce",
    borderRadius: "10px",
    border: "none",

    text: {
        textColor: "#ffffff",
        disabledTextColor: "rgba(255,255,255,1)",
        textAlign: 'center',
        fontSize: '1.2em'
    }
};

export const shuffleButtonTheme = {
    width: "200px",
    height: "50px",
    background: "#0085FF",
    disabledBackground: "#c4dbff",
    hoverBackground: "#336bce",
    borderRadius: "10px",
    border: "none",

    text: {
        textColor: "#ffffff",
        disabledTextColor: "rgba(255,255,255,1)",
        textAlign: 'center',
        fontSize: '1.2em'
    }
};

export const sortButtonTheme = {
    width: "50%",
    height: "50px",
    background: "#0085FF",
    disabledBackground: "#c4dbff",
    hoverBackground: "#336bce",
    borderRadius: "10px",
    border: "none",
    margin: "0px 0px 0px 10px",

    text: {
        textColor: "#ffffff",
        disabledTextColor: "rgba(255,255,255,1)",
        textAlign: 'center',
        fontSize: '1.2em'
    }
};

export const StyledSelect = styled(Select)`
    margin-top: 20px;
`;

export const StyledTopSection = styled.div`
  padding: 20px 20px 0;
  height: 180px;
`;

export const StyledStopStartButtons = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-top: 20px;
`;

export const StyledSortPage = styled.div`
  width: 100%;
  height: 100%;
  min-width: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
`;

export const StyledSortVisualiserWindow = styled.div`
  padding: 20px;
  box-shadow: 0 0 150px 36px rgba(0, 117, 255, 0.26);
  display: flex;
  flex-direction: row;
  width: 50%;
  min-width: 900px;
  height: 700px;
  border-radius: 10px;
  background: white;
  overflow: auto;
  
  @media (max-width: 1024px) {
    flex-direction: column-reverse;
    width: 100%;
    border-radius: 0;
    height: 100%;
    max-height: 100%;
    min-width: 100%;
    padding: 0;
  }
`;

export const StyledToolbar = styled(motion.div)`
  border-bottom-left-radius: 10px;
  border-top-left-radius: 10px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 400px;
  min-width: 400px;
  max-width: 400px;
  padding: 0 20px;
  
  @media (max-width: 1024px) {
    min-width: 100%;
    width: 100%;
    padding: 30px;
  }
  
  .algorithmSelectSection {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: white;
  }
`;

export const StyledChart = styled(motion.div)`
  flex: 1 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-width: 500px;
  min-height: 300px;
  
  @media (max-width: 1024px) {
    min-width: 300px;
  }
  // prevents from growing with inner canvas:
  overflow:hidden; 
`;

export const StyledOverChartSection = styled(motion.div)`
  min-width: 50px;
  display: flex;
  height: 100px;
  align-items: center;
  justify-content: center;
`;

export const StyledDescriptionWrapper = styled(motion.div)`
  max-width: 300px;
`;

export const StyledTitleWrapper = styled(motion.div)`
  max-width: 300px;
`;

export const animatedWindowProps = {
    initial: { opacity: 0, y: -50},
    animate: { opacity: 1, y: 0},
    transition: {type: "spring", stiffness: 1060, damping: 30, delay: 0.3}
};

export const animatedWindowProps2 = {
    initial: {opacity: 0, y: -50},
    animate: {opacity: 1, y: 0},
    transition: {type: "spring", stiffness: 560, damping: 30, delay: 0.2}
};

export const animatedWindowProps3 = {
    initial: {opacity: 0, y: -50},
    animate: {opacity: 1, y: 0},
    transition: {type: "spring", stiffness: 560, damping: 30, delay: 0.1}
};