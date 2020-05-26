import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FiPower, FiClock } from 'react-icons/fi';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { Container, Header, HeaderContent, Profile, Content, Schedule, Calendar, NextAppointment, Section, Appointment } from './styles';
import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import { Link } from 'react-router-dom';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface AppointmentInfo {
  id: string;
  date: string;
  time: string;
  user: {
    name: string;
    avatar_url: string;
  }
}

const Dashboard: React.FunctionComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);
  const [appointments, setAppointments] = useState<AppointmentInfo[]>([]);

  const { signOut, user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
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

  useEffect(() => {
    api.get<AppointmentInfo[]>('/appointments/me', {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate(),
      }
    }).then(response => {
      const formatted = response.data.map(appointment => ({
        ...appointment,
        time: format(parseISO(appointment.date), 'HH:mm'),
      }));
      setAppointments(formatted)
    });
  }, [selectedDate]);

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

  const selectedDateAsText = useMemo(() => {
    const monthDay = format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });
    const weekDay = format(selectedDate, 'cccc', {
      locale: ptBR,
    });
    return (
      <p>
        {isToday(selectedDate) && (<span>Hoje</span>)}
        <span>{monthDay}</span>
        <span>{weekDay}</span>
      </p>
    );
  }, [selectedDate]);

  const morningAppointments = useMemo(
    () =>
      appointments.filter(appointment =>
        parseISO(appointment.date).getHours() < 12
      ),
    [appointments]
  );

  const afternoonAppointments = useMemo(
    () =>
      appointments.filter(appointment =>
        parseISO(appointment.date).getHours() >= 12
      ),
    [appointments]
  );

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment =>
      isAfter(parseISO(appointment.date), new Date())
    );
  }, [appointments]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber"/>

          <Link to="/profile">
            <Profile>
              <img src={user.avatar_url} alt=""/>
              <div>
                <span>Bem-vindo</span>
                <strong>{user.name}</strong>
              </div>
            </Profile>
          </Link>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          {selectedDateAsText}

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Próximo agendamento</strong>
              <div>
                <img src={nextAppointment.user.avatar_url} alt=""/>
                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.time}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>
            {morningAppointments.length === 0 ?
              <p>Nenhum agendamento neste período</p> :
              morningAppointments.map(appointment => (
                <Appointment key={appointment.id}>
                  <span>
                    <FiClock />
                    {appointment.time}
                  </span>
                  <div>
                    <img src={appointment.user.avatar_url} alt=""/>
                    <strong>{appointment.user.name}</strong>
                  </div>
                </Appointment>
              ))
            }
          </Section>

          <Section>
            <strong>Tarde</strong>
            {afternoonAppointments.length === 0 ?
              <p>Nenhum agendamento neste período</p> :
              afternoonAppointments.map(appointment => (
                <Appointment key={appointment.id}>
                  <span>
                    <FiClock />
                    {appointment.time}
                  </span>
                  <div>
                    <img src={appointment.user.avatar_url} alt=""/>
                    <strong>{appointment.user.name}</strong>
                  </div>
                </Appointment>
              ))
            }
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
