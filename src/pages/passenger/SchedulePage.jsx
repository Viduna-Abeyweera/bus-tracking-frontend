import { useState, useEffect } from 'react';
import { routesAPI, schedulesAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiClock, FiCalendar } from 'react-icons/fi';
import './SchedulePage.css';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

function SchedulePage() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedDay, setSelectedDay] = useState(getCurrentDay());
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  function getCurrentDay() {
    return DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  }

  useEffect(() => {
    routesAPI.getAll()
      .then((res) => setRoutes(res.data))
      .catch((err) => console.error('Failed:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedRoute && selectedDay) {
      setScheduleLoading(true);
      schedulesAPI.getByRouteAndDay(selectedRoute, selectedDay)
        .then((res) => setSchedules(res.data))
        .catch(() => setSchedules([]))
        .finally(() => setScheduleLoading(false));
    }
  }, [selectedRoute, selectedDay]);

  if (loading) return <div className="page-container"><LoadingSpinner text="Loading..." /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📅 Schedules</h1>
        <p>View bus departure times by route and day</p>
      </div>

      <div className="schedule-filters">
        <div className="form-group">
          <label className="form-label">Route</label>
          <select
            className="form-select"
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
          >
            <option value="">Select a route</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                Route {r.routeNumber} — {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Day</label>
          <div className="day-selector">
            {DAYS.map((day) => (
              <button
                key={day}
                className={`day-btn ${selectedDay === day ? 'active' : ''}`}
                onClick={() => setSelectedDay(day)}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!selectedRoute ? (
        <div className="empty-state glass-card">
          <FiCalendar style={{ fontSize: '2rem', marginBottom: '1rem' }} />
          <p>Select a route to view schedules</p>
        </div>
      ) : scheduleLoading ? (
        <LoadingSpinner text="Loading schedules..." />
      ) : schedules.length === 0 ? (
        <div className="empty-state glass-card">
          <p>No schedules found for this route on {selectedDay.toLowerCase()}</p>
        </div>
      ) : (
        <div className="schedule-grid">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="schedule-card glass-card">
              <div className="schedule-time">
                <FiClock />
                <span>{schedule.departureTime}</span>
              </div>
              <div className="schedule-details">
                {schedule.busRegistration && (
                  <span className="badge badge-info">🚌 {schedule.busRegistration}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SchedulePage;
