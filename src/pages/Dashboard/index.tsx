import React, { useState } from 'react';

import { Container, Header, HeaderContent, Profile, Content, Schedule, Calendar, NextAppointment, Section, Appointment } from './styles';
import logoImg from '../../assets/logo.svg';
import { FiPower, FiClock } from 'react-icons/fi';
import { useAuth } from '../../hooks/auth';

const Dashboard: React.FunctionComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { signOut, user } = useAuth();
  const appointment = {
    user: {
      name: 'Rafael Arantes',
      avatar_url: 'https://avatars2.githubusercontent.com/u/19666564?v=4',
    },
    time: '08:00',

    manha: {
      user: {
        name: 'Rafael Arantes',
        avatar_url: 'https://avatars2.githubusercontent.com/u/19666564?v=4',
      },
      time: '08:00',
    },
    tarde: {
      user: {
        name: 'Rafael Arantes',
        avatar_url: 'https://avatars2.githubusercontent.com/u/19666564?v=4',
      },
      time: '08:00',
    },
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

          <Section>
            <strong>Manhã</strong>
            <Appointment>
              <span>
                <FiClock />
                {appointment.manha.time}
              </span>
              <div>
                <img src={appointment.manha.user.avatar_url} alt=""/>
                <strong>{appointment.manha.user.name}</strong>
              </div>
            </Appointment>
          </Section>

          <Section>
            <strong>Tarde</strong>
            <Appointment>
              <span>
                <FiClock />
                {appointment.tarde.time}
              </span>
              <div>
                <img src={appointment.tarde.user.avatar_url} alt=""/>
                <strong>{appointment.tarde.user.name}</strong>
              </div>
            </Appointment>
          </Section>
        </Schedule>
        <Calendar />
      </Content>
    </Container>
  );
};

export default Dashboard;
