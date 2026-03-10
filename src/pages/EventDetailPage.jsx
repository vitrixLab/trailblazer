import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEvent } from '@/lib/api';
import Lightbox from '@/components/Lightbox';
import { Calendar, MapPin, ArrowLeft, Image } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await getEvent(id);
        setEvent(data);
      } catch (err) {
        console.error('Failed to fetch event:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleKeyDown = useCallback((e) => {
    if (lightboxIndex === null) return;
    if (e.key === 'Escape') setLightboxIndex(null);
    if (e.key === 'ArrowRight' && lightboxIndex < (event?.photos?.length || 0) - 1) {
      setLightboxIndex(prev => prev + 1);
    }
    if (e.key === 'ArrowLeft' && lightboxIndex > 0) {
      setLightboxIndex(prev => prev - 1);
    }
  }, [lightboxIndex, event]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (loading) {
    return (
      <div style={{ paddingTop: '4rem', minHeight: '100vh' }}>
        <div className="container" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
          <div style={{ height: '2rem', width: '12rem', backgroundColor: 'var(--color-muted)', animation: 'pulse 2s infinite', marginBottom: '1rem' }} />
          <div style={{ height: '4rem', width: '24rem', backgroundColor: 'var(--color-muted)', animation: 'pulse 2s infinite', marginBottom: '2rem' }} />
          <style>{`
            .gallery-skeleton {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 1rem;
            }
            @media (min-width: 768px) {
              .gallery-skeleton {
                grid-template-columns: repeat(3, 1fr);
              }
            }
          `}</style>
          <div className="gallery-skeleton">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ height: '15rem', backgroundColor: 'var(--color-muted)', animation: 'pulse 2s infinite' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ paddingTop: '4rem', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 className="h2" style={{ marginBottom: '1rem' }}>Event Not Found</h2>
          <Link to="/events" className="nav-link" style={{ color: 'var(--color-primary)' }}>
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const date = parseISO(event.date);
  const photos = event.photos || [];

  return (
    <div data-testid="event-detail-page" style={{ paddingTop: '4rem' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--color-secondary)', position: 'relative' }} className="noise-overlay">
        <div className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '4rem', paddingBottom: '6rem' }}>
          <Link
            to="/events"
            data-testid="back-to-events"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#9ca3af',
              fontSize: '0.875rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '2rem',
              transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
          >
            <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
            All Events
          </Link>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '0.25rem 0.75rem',
              borderRadius: '2px',
            }}>
              {event.distance_km ? `${event.distance_km} km` : 'TBD'}
            </span>
          </div>
          <h1 className="hero" style={{ color: 'white', marginBottom: '1.5rem' }}>
            {event.title}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', color: '#9ca3af' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar style={{ width: '1rem', height: '1rem', color: 'var(--color-primary)' }} />
              {format(date, 'EEEE, MMMM d, yyyy · h:mm a')}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin style={{ width: '1rem', height: '1rem', color: 'var(--color-primary)' }} />
              {event.location}
            </span>
          </div>
        </div>
      </div>

      {/* Description + Gallery */}
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        {event.description && (
          <div data-testid="event-description" style={{ marginBottom: '4rem', maxWidth: '48rem' }}>
            <h2 className="h3" style={{ marginBottom: '1rem' }}>About This Event</h2>
            <p className="body-lg" style={{ whiteSpace: 'pre-wrap' }}>
              {event.description}
            </p>
          </div>
        )}

        {photos.length > 0 && (
          <div data-testid="photo-gallery">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <Image style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-primary)' }} />
              <h2 className="h3" style={{ margin: 0 }}>Gallery</h2>
              <span className="caption" style={{ marginLeft: '0.5rem' }}>
                {photos.length} photo{photos.length > 1 ? 's' : ''}
              </span>
            </div>
            <style>{`
              .gallery-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
                grid-auto-rows: 250px;
              }
              @media (min-width: 768px) {
                .gallery-grid {
                  grid-template-columns: repeat(12, 1fr);
                }
                .gallery-item:nth-child(3n+1) {
                  grid-column: span 5;
                }
                .gallery-item:nth-child(3n+2) {
                  grid-column: span 4;
                }
                .gallery-item:nth-child(3n+3) {
                  grid-column: span 3;
                }
              }
            `}</style>
            <div className="gallery-grid">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  data-testid={`gallery-photo-${index}`}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: 'none',
                    padding: 0,
                    background: 'none',
                  }}
                  onClick={() => setLightboxIndex(index)}
                >
                  <img
                    src={photo.url}
                    alt={`Event photo ${index + 1}`}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s',
                    }}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {photos.length === 0 && (
          <div data-testid="no-photos" style={{ textAlign: 'center', padding: '4rem 0', border: '1px dashed var(--color-border)' }}>
            <Image style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', color: 'rgba(100,116,139,0.3)' }} />
            <p className="body">No photos for this event yet.</p>
          </div>
        )}
      </div>

      <Lightbox
        photos={photos}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNext={() => setLightboxIndex(prev => Math.min(prev + 1, photos.length - 1))}
        onPrev={() => setLightboxIndex(prev => Math.max(prev - 1, 0))}
      />
    </div>
  );
}