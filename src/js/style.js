import Select from "react-select";
import styled from "styled-components";

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

export const buttonTheme = {
    width: "50%",
    height: "40px",
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
    width: "100%",
    height: "50px",
    background: "#0085FF",
    disabledBackground: "#c4dbff",
    hoverBackground: "#336bce",
    borderRadius: "10px",
    border: "none",
    margin: "20px 0px 0px 0px",

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
  padding: 20px;
`;

export const StyledBottomSection = styled.div`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  flex: 1 0;

  @media (max-width: 1200px) {
    padding: 0;
    flex-direction: column-reverse;
    width: 100%;
    height: 100%;
    box-shadow: none;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }
  
  .toolbar {
    border-bottom-left-radius: 10px;
    border-top-left-radius: 10px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 400px;
    min-width: 300px;
    max-width: 400px;
    padding: 20px;

    @media (max-width: 1200px) {
      padding: 10px;
      width: 100%;
      max-width: 100%;
    }
    
    @media (max-width: 1200px) {
      width: 100%;
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
    height: 100%;
    min-height: 50px;
    flex: 1 0;
    min-width: 300px;
    padding: 20px;
    box-sizing: border-box;
    border-bottom-right-radius: 10px;
    border-top-right-radius: 10px;

    @media (max-width: 1200px) {
      padding: 0;
    }
  }
`;

export const StyledDescriptionWrapper = styled.div`
  max-width: 300px;
`;

export const StyledTitleWrapper = styled.div`
  max-width: 300px;
`;