import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
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

  const upcomingEvents = events.filter(e => !isPast(parseISO(e.date_time)));
  const pastEvents = events.filter(e => isPast(parseISO(e.date_time))).reverse();

  const EventListItem = ({ event }) => {
    const date = parseISO(event.date_time);
    const past = isPast(date);

    return (
      <Link
        to={`/events/${event.id}`}
        data-testid={`event-item-${event.id}`}
        className={`group flex flex-col md:flex-row md:items-center gap-4 md:gap-8 border-b border-border py-8 hover:bg-muted/30 transition-colors duration-300 px-2 ${past ? 'opacity-60' : ''}`}
      >
        {/* Date Badge */}
        <div className={`flex flex-col items-center justify-center w-16 h-16 font-black uppercase border shrink-0 ${past ? 'bg-muted/50 border-border/50 text-muted-foreground' : 'bg-muted text-foreground border-border'}`}>
          <span className=\"text-xs tracking-widest\">{format(date, 'MMM')}</span>
          <span className=\"text-2xl font-heading leading-none\">{format(date, 'dd')}</span>
        </div>

        {/* Info */}
        <div className=\"flex-1 min-w-0\">
          <h3 className=\"font-heading text-xl md:text-2xl font-semibold tracking-normal group-hover:text-[#FF4D00] transition-colors duration-300\">
            {event.name}
          </h3>
          <div className=\"flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground\">
            <span className=\"flex items-center gap-1\">
              <Calendar className=\"w-3.5 h-3.5\" />
              {format(date, 'EEEE, MMM d · h:mm a')}
            </span>
            <span className=\"flex items-center gap-1\">
              <MapPin className=\"w-3.5 h-3.5\" />
              {event.location}
            </span>
            {event.photos?.length > 0 && (
              <span className=\"flex items-center gap-1\">
                <Image className=\"w-3.5 h-3.5\" />
                {event.photos.length} photo{event.photos.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Distance Badge */}
        <Badge className={`font-bold uppercase tracking-wider text-xs px-3 py-1 w-fit border-0 ${past ? 'bg-muted text-muted-foreground' : 'bg-[#141B2D] text-white'}`}>
          {event.distance}
        </Badge>

        <ChevronRight className=\"w-5 h-5 text-muted-foreground group-hover:text-[#FF4D00] transition-colors duration-300 hidden md:block\" />
      </Link>
    );
  };

  return (
    <div data-testid=\"events-page\" className=\"pt-16\">
      {/* Header */}
      <div className=\"bg-[#141B2D] relative noise-overlay\">
        <div className=\"relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28\">
          <p className=\"text-[#FF4D00] font-bold text-sm uppercase tracking-[0.3em] mb-2\">
            Schedule
          </p>
          <h1 className=\"font-heading text-5xl md:text-6xl font-bold text-white uppercase tracking-tight\">
            All Events
          </h1>
          <p className=\"text-gray-400 text-lg mt-4 max-w-xl\">
            Find your next race, group run, or community meetup. Every run counts.
          </p>
        </div>
      </div>

      {/* Events List */}
      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20\">
        {loading ? (
          <div className=\"flex flex-col gap-4\">
            {[1,2,3,4].map(i => (
              <div key={i} className=\"h-24 bg-muted animate-pulse\" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className=\"text-center py-20\">
            <p className=\"text-muted-foreground text-lg\">No events yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Upcoming */}
            {upcomingEvents.length > 0 && (
              <div data-testid=\"upcoming-events-list\" className=\"mb-16\">
                <h2 className=\"font-heading text-2xl font-bold uppercase tracking-tight mb-6 flex items-center gap-3\">
                  <span className=\"w-2 h-2 bg-[#D2F800]\" />
                  Upcoming
                </h2>
                <div className=\"flex flex-col\">
                  {upcomingEvents.map(event => (
                    <EventListItem key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {/* Past */}
            {pastEvents.length > 0 && (
              <div data-testid=\"past-events-list\">
                <h2 className=\"font-heading text-2xl font-bold uppercase tracking-tight mb-6 flex items-center gap-3\">
                  <span className=\"w-2 h-2 bg-muted-foreground\" />
                  Past Events
                </h2>
                <div className=\"flex flex-col\">
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
