import React, { useCallback, useEffect } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi';

import { ToastMessage, useToast } from '../../../hooks/toast';
import { Container} from './styles';

interface Props {
  message: ToastMessage;
  style: object;
}

const icons = {
  error: (<FiAlertCircle size={20} />),
  success: (<FiCheckCircle size={20} />),
  info: (<FiInfo size={20} />),
};

const Toast: React.FC<Props> = ({message, style}) => {
  const { removeToast } = useToast();

  const handleRemoveToast = useCallback(
    () => removeToast(message.id),
    [message.id, removeToast]
  );

  useEffect(() => {
    const timer = setTimeout(handleRemoveToast, 3000);
    return () => clearTimeout(timer);
  }, [handleRemoveToast]);

  return (
    <Container
      type={message.type}
      hasDescription={!!message.description}
      key={message.id}
      style={style}
    >
      {icons[message.type || 'info']}
      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>

      <button onClick={handleRemoveToast} type="button">
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
