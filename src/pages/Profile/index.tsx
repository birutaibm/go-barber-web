import React, { useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi'
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
//import * as Yup from 'yup';

import { Container, Content, AvatarInput } from './styles';
//import api from '../../services/api';
//import { useToast } from '../../hooks/toast';
import Input from '../../components/Input';
import Button from '../../components/Button';
//import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';

interface FormData {
  name: string;
  email: string;
  password: string;
}

const Profile: React.FunctionComponent = () => {
  const formRef = useRef<FormHandles>(null);
  const { user } = useAuth();
  //const { addToast } = useToast();
  //const history = useHistory();

  const handleSubmit = useCallback(async (data: FormData) => {
    /*TODO implement based in this code:
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
        .required('E-mail obrigatório')
        .email('Digite um e-mail válido'),
        password: Yup.string().min(6, 'No mínimo 6 caracteres'),
      });
      await schema.validate(data, {
        abortEarly: false,
      });
      await api.post('/users', data);
      addToast({
        type: 'success',
        title: 'Cadastro realizado',
        description: 'Você já pode fazer seu login no GoBarber',
      });
      history.push('/');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        formRef.current?.setErrors(getValidationErrors(err));
      } else {
        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: err.message,
        });
      }
    }
    */
  }, [/* addToast, history */]);

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>

        <Form ref={formRef} initialData={{
          name: user.name,
          email: user.email,
        }} onSubmit={handleSubmit}>
          <AvatarInput>
            <img src={user.avatar_url} alt="Avatar"/>
            <button type="button"><FiCamera /></button>
          </AvatarInput>
          <h1>Meu perfil</h1>

          <Input icon={FiUser} name="name" placeholder="Nome" />
          <Input icon={FiMail} name="email" placeholder="E-mail" />

          <fieldset>
            <Input
              icon={FiLock}
              name="old_password"
              type="password"
              placeholder="Senha atual"
            />
            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder="Nova senha"
            />
            <Input
              icon={FiLock}
              name="password_confirmation"
              type="password"
              placeholder="Confirmar senha"
            />
          </fieldset>

          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
}

export default Profile;
