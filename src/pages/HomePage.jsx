import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '@/lib/api';
import { Calendar, MapPin, ArrowRight, ChevronRight } from 'lucide-react';
import { format, parseISO, isPast } from 'date-fns';

// The custom CSS is assumed to be imported globally (e.g., in index.css)

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await getEvents();
        const upcoming = data.filter(e => !isPast(parseISO(e.date))).slice(0, 4);
        setEvents(upcoming);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Unable to load upcoming events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div data-testid="home-page">
      {/* ===== HERO SECTION ===== */}
      <section
        data-testid="hero-section"
        className="hero-bg"
        style={{ height: '90vh', minHeight: '600px', position: 'relative', overflow: 'hidden' }}
        aria-labelledby="hero-heading"
      >
        <div className="container" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '5rem', position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '48rem' }}>
            <p style={{ color: '#FF4D00', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              Run together. Run further.
            </p>
            <h1 id="hero-heading" className="hero" style={{ color: 'white', marginBottom: '1.5rem' }}>
              TrailBlazers<br />Run Club
            </h1>
            <p className="body-lg" style={{ color: '#d1d5db', maxWidth: '32rem', marginBottom: '2rem' }}>
              A community of runners pushing limits on every trail. Weekly runs, epic races, and memories that last.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Link
                to="/events"
                data-testid="hero-events-btn"
                aria-label="View all upcoming events"
              >
                <button className="btn-primary">
                  View Events
                  <ArrowRight style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} aria-hidden="true" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== UPCOMING EVENTS ===== */}
      <section
        data-testid="upcoming-events-section"
        className="section-spacing"
        aria-labelledby="upcoming-heading"
      >
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem' }}>
            <div>
              <p style={{ color: '#FF4D00', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>
                What's Next
              </p>
              <h2 id="upcoming-heading" className="h2">
                Upcoming Events
              </h2>
            </div>
            <Link
              to="/events"
              data-testid="view-all-events-link"
              className="nav-link"
              style={{ display: 'none' }} // Hidden on mobile, visible via media query in CSS
              aria-label="View all events"
            >
              View All <ChevronRight style={{ width: '1rem', height: '1rem' }} aria-hidden="true" />
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div aria-live="polite" aria-busy="true">
              <span className="sr-only">Loading upcoming events</span>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: '6rem', backgroundColor: '#F3F4F6', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div style={{ textAlign: 'center', padding: '5rem 0' }} role="alert" aria-live="assertive">
              <p style={{ color: '#dc2626', fontSize: '1.125rem' }}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
                style={{ marginTop: '1rem' }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && events.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <p className="body" style={{ color: '#64748B', fontSize: '1.125rem' }}>No upcoming events yet. Check back soon!</p>
            </div>
          )}

          {/* Events list */}
          {!loading && !error && events.length > 0 && (
            <div className="grid-events">
              {events.map((event) => {
                const date = parseISO(event.date);
                return (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    data-testid={`event-card-${event.id}`}
                    className="card-event"
                    aria-label={`View details for ${event.title} on ${format(date, 'EEEE, MMMM d, yyyy')}`}
                  >
                    {/* Date Badge */}
                    <div className="badge-date">
                      <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>{format(date, 'MMM')}</span>
                      <span style={{ fontSize: '1.5rem', fontFamily: 'var(--font-headings)', lineHeight: 1 }}>{format(date, 'dd')}</span>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 className="h3" style={{ marginBottom: '0.5rem' }}>
                        {event.title}
                      </h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#64748B' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Calendar style={{ width: '0.875rem', height: '0.875rem' }} aria-hidden="true" />
                          {format(date, 'EEEE, MMM d · h:mm a')}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin style={{ width: '0.875rem', height: '0.875rem' }} aria-hidden="true" />
                          {event.location}
                        </span>
                      </div>
                    </div>

                    {/* Distance Badge */}
                    <span style={{
                      backgroundColor: '#141B2D',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '2px',
                      whiteSpace: 'nowrap'
                    }}>
                      {event.distance_km ? `${event.distance_km} km` : 'TBD'}
                    </span>

                    <ChevronRight style={{ width: '1.25rem', height: '1.25rem', color: '#64748B', marginLeft: 'auto', display: 'none' }} className="desktop-chevron" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          )}

          {/* Mobile "View All" link */}
          <Link
            to="/events"
            className="nav-link"
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '2rem' }}
            aria-label="View all events"
          >
            View All Events <ChevronRight style={{ width: '1rem', height: '1rem' }} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ===== COMMUNITY SECTION ===== */}
      <section
        data-testid="community-section"
        style={{ position: 'relative', overflow: 'hidden' }}
        aria-labelledby="community-heading"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', '@media (min-width: 768px)': { gridTemplateColumns: '1fr 1fr' } }}>
          {/* Image */}
          <div style={{ position: 'relative', height: '400px', '@media (min-width: 768px)': { height: 'auto' } }}>
            <img
              src="https://images.unsplash.com/photo-1623208525215-a573aacb1560?crop=entropy&cs=srgb&fm=jpg&q=85"
              alt="A diverse group of runners smiling and running together on a track"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div style={{ backgroundColor: '#141B2D', position: 'relative', padding: '5rem 2rem', '@media (min-width: 768px)': { padding: '8rem 4rem' } }} className="noise-overlay">
            <div style={{ position: 'relative', zIndex: 10 }}>
              <p style={{ color: '#D2F800', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '1rem' }}>
                The Community
              </p>
              <h2 id="community-heading" className="h2" style={{ color: 'white', marginBottom: '1.5rem' }}>
                Every Trail.<br />Every Pace.<br />Every Runner.
              </h2>
              <p className="body-lg" style={{ color: '#9ca3af', maxWidth: '28rem', marginBottom: '2rem' }}>
                Whether you're chasing a PR or just getting started, TrailBlazers is your crew. No judgment, just miles.
              </p>
              <Link
                to="/events"
                data-testid="community-events-btn"
                aria-label="Find your next run"
              >
                <button
                  style={{
                    backgroundColor: '#D2F800',
                    color: '#0A0A0A',
                    borderRadius: '2px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '1.5rem 2rem',
                    height: 'auto',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease-out, background-color 0.2s ease-out',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-0.25rem)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Find Your Run
                  <ArrowRight style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} aria-hidden="true" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}