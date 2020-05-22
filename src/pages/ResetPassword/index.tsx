import React, { useCallback, useRef } from 'react';
import { FiLock } from 'react-icons/fi'
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import { Container, AnimationContainer, Content, Background } from './styles';
import logo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FunctionComponent = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(async (data: ResetPasswordFormData) => {
    try {
      formRef.current?.setErrors({});
      const token = location.search.replace('?token=', '');
      if (!token) {
        throw new Error();
      }

      const schema = Yup.object().shape({
        password: Yup.string().required('Senha obrigatória'),
        password_confirmation: Yup.string().oneOf([Yup.ref('password')], 'Confirmação incorreta'),
      });
      await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('/password/reset', {
        password: data.password,
        password_confirmation: data.password_confirmation,
        token,
      });
      history.push('/');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        formRef.current?.setErrors(getValidationErrors(err));
      } else {
        addToast({
          type: 'error',
          title: 'Erro ao resetar senha',
          description: 'Ocorreu um erro ao resetar sua senha, tente novamente.',
        });
      }
    }
  }, [history, addToast, location.search]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber"/>

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>

            <Input icon={FiLock} name="password" type="password" placeholder="Nova senha" />
            <Input icon={FiLock} name="password_confirmation" type="password" placeholder="Confirmação da senha" />
            <Button type="submit">Alterar senha</Button>

          </Form>

        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
}

export default ResetPassword;
