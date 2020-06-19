import React, {InputHTMLAttributes, useRef, useEffect, useState, useCallback} from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

import { Container, Error } from './styles';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
}

const Input: React.FC<Props> = ({name, icon: Icon, ...props}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const {registerField, fieldName, error, defaultValue} = useField(name);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled(Boolean(inputRef.current?.value));
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container
      isErrored={!!error}
      isFocused={isFocused}
      isFilled={isFilled}
      data-testid="input-container"
    >
      {Icon && <Icon size={20} />}
      <input
        ref={inputRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        defaultValue={defaultValue}
        {...props}
      />
      {error && (
        <Error title={error}>
          <FiAlertCircle size={20} />
        </Error>
      )}
    </Container>
  );
}

export default Input;
