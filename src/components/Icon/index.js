import React from 'react';
import { StyledIcon } from './styled';

const Icon = ({ size = 30, src, alt = "icon", ...rest }) => {
  return <StyledIcon size={size} src={src} alt={alt} {...rest} />;
};

export { Icon };