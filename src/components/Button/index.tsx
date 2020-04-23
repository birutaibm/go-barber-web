import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FunctionComponent<Props> = ({children, ...rest}) => (
  <Container type="button" {...rest}>
    {children}
  </Container>
);

export default Button;
