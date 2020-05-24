import React from 'react';

import { Container, Header, HeaderContent, Profile, Content, Schedule, Calendar, NextAppointment } from './styles';
import logoImg from '../../assets/logo.svg';
import { FiPower, FiClock } from 'react-icons/fi';
import { useAuth } from '../../hooks/auth';

const Dashboard: React.FunctionComponent = () => {
  const { signOut, user } = useAuth();
  const appointment = {
    user: {
      name: 'Rafael Arantes',
      avatar_url: 'https://avatars2.githubusercontent.com/u/19666564?v=4',
    },
    time: '08:00',
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber"/>
          <Profile>
            <img src={user.avatar_url} alt=""/>
            <div>
              <span>Bem-vindo</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>
          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            <span>Hoje</span>
            <span>Dia 24</span>
            <span>Domingo</span>
          </p>

          <NextAppointment>
            <strong>Atendimento a seguir</strong>
            <div>
              <img src={appointment.user.avatar_url} alt=""/>
              <strong>{appointment.user.name}</strong>
              <span>
                <FiClock />
                {appointment.time}
              </span>
            </div>
          </NextAppointment>
        </Schedule>
        <Calendar />
      </Content>
    </Container>
  );
};

export default Dashboard;
