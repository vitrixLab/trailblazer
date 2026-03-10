import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEvent } from '@/lib/api';
import { Lightbox } from '@/components/Lightbox';
import { Badge } from '@/components/ui/badge';
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
      <div className=\"pt-16 min-h-screen\">
        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20\">
          <div className=\"h-8 w-48 bg-muted animate-pulse mb-4\" />
          <div className=\"h-16 w-96 bg-muted animate-pulse mb-8\" />
          <div className=\"grid grid-cols-2 md:grid-cols-3 gap-4\">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className=\"h-60 bg-muted animate-pulse\" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className=\"pt-16 min-h-screen flex items-center justify-center\">
        <div className=\"text-center\">
          <h2 className=\"font-heading text-3xl font-bold uppercase mb-4\">Event Not Found</h2>
          <Link to=\"/events\" className=\"text-[#FF4D00] font-bold uppercase tracking-widest text-sm hover:underline\">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const date = parseISO(event.date_time);
  const photos = event.photos || [];

  return (
    <div data-testid=\"event-detail-page\" className=\"pt-16\">
      {/* Header */}
      <div className=\"bg-[#141B2D] relative noise-overlay\">
        <div className=\"relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24\">
          <Link
            to=\"/events\"
            data-testid=\"back-to-events\"
            className=\"inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm font-bold uppercase tracking-widest mb-8 transition-colors duration-300\"
          >
            <ArrowLeft className=\"w-4 h-4\" />
            All Events
          </Link>
          <div className=\"flex flex-wrap items-start gap-4 mb-4\">
            <Badge className=\"bg-[#FF4D00] text-white border-0 font-bold uppercase tracking-wider text-xs px-3 py-1\">
              {event.distance}
            </Badge>
          </div>
          <h1 className=\"font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white uppercase tracking-tight mb-6\">
            {event.name}
          </h1>
          <div className=\"flex flex-wrap items-center gap-6 text-gray-400\">
            <span className=\"flex items-center gap-2\">
              <Calendar className=\"w-4 h-4 text-[#FF4D00]\" />
              {format(date, 'EEEE, MMMM d, yyyy · h:mm a')}
            </span>
            <span className=\"flex items-center gap-2\">
              <MapPin className=\"w-4 h-4 text-[#FF4D00]\" />
              {event.location}
            </span>
          </div>
        </div>
      </div>

      {/* Description + Gallery */}
      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20\">
        {/* Description */}
        {event.description && (
          <div data-testid=\"event-description\" className=\"mb-16 max-w-3xl\">
            <h2 className=\"font-heading text-2xl font-bold uppercase tracking-tight mb-4\">About This Event</h2>
            <p className=\"text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap\">
              {event.description}
            </p>
          </div>
        )}

        {/* Photo Gallery */}
        {photos.length > 0 && (
          <div data-testid=\"photo-gallery\">
            <div className=\"flex items-center gap-3 mb-8\">
              <Image className=\"w-5 h-5 text-[#FF4D00]\" />
              <h2 className=\"font-heading text-2xl font-bold uppercase tracking-tight\">
                Gallery
              </h2>
              <span className=\"text-sm text-muted-foreground font-bold ml-2\">
                {photos.length} photo{photos.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className=\"gallery-grid\">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  data-testid={`gallery-photo-${index}`}
                  className=\"gallery-item relative overflow-hidden cursor-pointer group\"
                  onClick={() => setLightboxIndex(index)}
                >
                  <img
                    src={photo.url}
                    alt={`Event photo ${index + 1}`}
                    className=\"absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105\"
                    loading=\"lazy\"
                  />
                  <div className=\"absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300\" />
                </button>
              ))}
            </div>
          </div>
        )}

        {photos.length === 0 && (
          <div data-testid=\"no-photos\" className=\"text-center py-16 border border-dashed border-border\">
            <Image className=\"w-12 h-12 mx-auto text-muted-foreground/30 mb-4\" />
            <p className=\"text-muted-foreground\">No photos for this event yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
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
