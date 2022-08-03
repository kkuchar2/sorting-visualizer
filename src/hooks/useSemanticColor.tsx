import {useColorMode} from '@chakra-ui/react';
import {useTheme} from '@emotion/react';

export const useSemanticColor = (token: string) => {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    return theme['semanticTokens'].colors[token][colorMode === 'light' ? 'default' : '_dark'];
};