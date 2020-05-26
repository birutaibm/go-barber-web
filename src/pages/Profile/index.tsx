import React, { useCallback, useRef, ChangeEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi'
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { Container, Content, AvatarInput } from './styles';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';

interface FormData {
  name: string;
  email: string;
  password: string;
  old_password: string;
  password_confirmation: string;
}

const Profile: React.FunctionComponent = () => {
  const formRef = useRef<FormHandles>(null);
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      const data = new FormData();
      data.append('avatar', files[0]);
      api.patch('/users/avatar', data).then(response => {
        updateUser(response.data);
        addToast({
          type: 'success',
          title: 'Avatar atualizado!',
        });
      });
    }
  }, [updateUser, addToast]);

  const handleSubmit = useCallback(async (data: FormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail válido'),
        old_password: Yup.string(),
        password: Yup.string().when('old_password', {
          is: val => val.length,
          then: Yup.string().min(6, 'No mínimo 6 caracteres'),
          otherwise: Yup.string().oneOf(
            ['', null],
            'Impossível alterar sem a senha antiga'
          ),
        }),
        password_confirmation: Yup.string().oneOf(
          [Yup.ref('password')],
          'Confirmação incorreta',
        ),
      });
      await schema.validate(data, {
        abortEarly: false,
      });

      if (data.password === '') {
        delete data.old_password;
        delete data.password;
        delete data.password_confirmation;
      }
      const response = await api.put('/profile', data);
      updateUser(response.data);

      addToast({
        type: 'success',
        title: 'Perfil atualizado',
        description: 'Suas informações de perfil foram atualizadas com sucesso',
      });
      history.push('/dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        formRef.current?.setErrors(getValidationErrors(err));
      } else {
        addToast({
          type: 'error',
          title: 'Erro na atualização do perfil',
          description: err.message,
        });
      }
    }
  }, [addToast, history, updateUser]);

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
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" name="avatar" id="avatar" onChange={handleAvatarChange} />
            </label>
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
