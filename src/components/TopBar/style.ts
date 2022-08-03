import {Box} from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledTopBar = styled(Box)`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  flex-direction: row;
  position: fixed;
  left: 0;
  top: 0;
  height: 50px;
  z-index: 5;
  padding-left: 20px;
  padding-right: 20px;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`;