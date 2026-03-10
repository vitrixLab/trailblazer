import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '@/lib/api';
import { Calendar, MapPin, ChevronRight, Image } from 'lucide-react';
import { format, parseISO, isPast } from 'date-fns';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const upcomingEvents = events.filter(e => !isPast(parseISO(e.date)));
  const pastEvents = events.filter(e => isPast(parseISO(e.date))).reverse();

  const EventListItem = ({ event }) => {
    const date = parseISO(event.date);
    const past = isPast(date);

    return (
      <Link
        to={`/events/${event.id}`}
        data-testid={`event-item-${event.id}`}
        className="card-event"
        style={{ opacity: past ? 0.6 : 1 }}
      >
        {/* Date Badge */}
        <div className="badge-date" style={past ? { backgroundColor: 'rgba(243,244,246,0.5)', borderColor: 'rgba(226,232,240,0.5)', color: 'var(--color-muted-foreground)' } : {}}>
          <span className="caption" style={{ fontSize: '0.75rem' }}>{format(date, 'MMM')}</span>
          <span className="h3" style={{ fontSize: '1.5rem', lineHeight: 1 }}>{format(date, 'dd')}</span>
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="h3" style={{ marginBottom: '0.5rem' }}>
            {event.title}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: 'var(--color-muted-foreground)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar style={{ width: '0.875rem', height: '0.875rem' }} />
              {format(date, 'EEEE, MMM d · h:mm a')}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin style={{ width: '0.875rem', height: '0.875rem' }} />
              {event.location}
            </span>
            {event.photos?.length > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Image style={{ width: '0.875rem', height: '0.875rem' }} />
                {event.photos.length} photo{event.photos.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Distance Badge */}
        <span
          style={{
            backgroundColor: past ? 'var(--color-muted)' : 'var(--color-secondary)',
            color: past ? 'var(--color-muted-foreground)' : 'white',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '0.25rem 0.75rem',
            borderRadius: '2px',
            whiteSpace: 'nowrap',
          }}
        >
          {event.distance_km ? `${event.distance_km} km` : 'TBD'}
        </span>

        <ChevronRight style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-muted-foreground)', display: 'none' }} className="desktop-chevron" />
        <style>{`
          @media (min-width: 768px) {
            .desktop-chevron {
              display: block;
            }
          }
        `}</style>
      </Link>
    );
  };

  return (
    <div data-testid="events-page" style={{ paddingTop: '4rem' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--color-secondary)', position: 'relative' }} className="noise-overlay">
        <div className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '5rem', paddingBottom: '7rem' }}>
          <p style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>
            Schedule
          </p>
          <h1 className="hero" style={{ color: 'white' }}>
            All Events
          </h1>
          <p className="body-lg" style={{ color: '#9ca3af', marginTop: '1rem', maxWidth: '36rem' }}>
            Find your next race, group run, or community meetup. Every run counts.
          </p>
        </div>
      </div>

      {/* Events List */}
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ height: '6rem', backgroundColor: 'var(--color-muted)', animation: 'pulse 2s infinite' }} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p className="body-lg" style={{ color: 'var(--color-muted-foreground)' }}>No events yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Upcoming */}
            {upcomingEvents.length > 0 && (
              <div data-testid="upcoming-events-list" style={{ marginBottom: '4rem' }}>
                <h2 className="h3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <span style={{ width: '0.5rem', height: '0.5rem', backgroundColor: 'var(--color-accent)' }} />
                  Upcoming
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {upcomingEvents.map(event => (
                    <EventListItem key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {/* Past */}
            {pastEvents.length > 0 && (
              <div data-testid="past-events-list">
                <h2 className="h3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <span style={{ width: '0.5rem', height: '0.5rem', backgroundColor: 'var(--color-muted-foreground)' }} />
                  Past Events
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {pastEvents.map(event => (
                    <EventListItem key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}