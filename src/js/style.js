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

export const StyledToolbarSection = styled(motion.div)`
  border-bottom-left-radius: 10px;
  border-top-left-radius: 10px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 400px;
  min-width: 300px;
  max-width: 400px;
  padding: 0 20px;

  @media (max-width: 1200px) {
    flex: 1 0;
    padding: 10px;
    width: 100%;
    max-width: 100%;
    box-shadow: none;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  .algorithmSelectSection {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: white;
  }
`;

export const StyledMainSection = styled.div`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  flex: 1 0;
  min-width: 200px;
  background: white;
  
  @media (max-width: 1200px) {
    flex-direction: column-reverse;
    width: 100%;
    box-shadow: none;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }

  .buttonsSection {
    box-sizing: border-box;
    display: flex;
    align-items: flex-end;
    flex: 1 0 auto;

    @media (max-width: 1200px) {
      margin-top: 30px;
    }
  }

  .chart {
    min-height: 50px;
    flex: 1 0;
    display: flex;
    flex-direction: column;
    min-width: 10px;
    
    border-bottom-right-radius: 10px;
    border-top-right-radius: 10px;
  }
`;

export const StyledOverChartSection = styled(motion.div)`
  min-width: 50px;
  display: flex;
  height: 100px;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 1200px) {
    display: none;
  }
`;

export const StyledChartSection = styled(motion.div)`
  flex: 1 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-width: 10px;
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