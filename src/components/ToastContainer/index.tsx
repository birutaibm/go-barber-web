import React from 'react';
import { useTransition } from 'react-spring';

import { ToastMessage } from '../../hooks/toast';
import Toast from './Toast';
import { Container } from './styles';

interface Props {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<Props> = ({messages}) => {
  const messagesWithTransitions = useTransition(
    messages,
    message => message.id,
    {
      from: { right: '-120%' },
      enter: { right: '0%' },
      leave: { right: '-120%' },
    }
  );

  return (
    <Container>
      {messagesWithTransitions.map(({ item, key, props}) => (
        <Toast
          message={item}
          key={key}
          style={props}
        />
      ))}
    </Container>
  );
};

export default ToastContainer;
