import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { FiPower, FiClock } from 'react-icons/fi';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { Container, Header, HeaderContent, Profile, Content, Schedule, Calendar, NextAppointment, Section, Appointment } from './styles';
import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

const Dashboard: React.FunctionComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);
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

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    api.get<MonthAvailabilityItem[]>(`/providers/${user.id}/month-availability`, {
      params: {
        year: currentMonth.getFullYear(),
        month: currentMonth.getMonth() + 1,
      }
    }).then(response => {
      setMonthAvailability(response.data);
    });
  }, [currentMonth, user.id]);

  const disabledDays = useMemo(() => {
    return monthAvailability
      .filter(availability => !availability.available)
      .map(availability => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const { day } = availability;
        return new Date(year, month, day);
      });
  }, [currentMonth, monthAvailability]);

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
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] }
            }}
            onMonthChange={handleMonthChange}
            onDayClick={handleDateChange}
            selectedDays={selectedDate}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
