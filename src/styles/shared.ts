import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const AnimatedContainer = styled('div')`
  animation: ${fadeIn} 0.5s ease-out;
`; 