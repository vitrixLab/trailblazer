import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ArrowRight, ChevronRight } from 'lucide-react';
import { format, parseISO, isPast } from 'date-fns';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await getEvents();
        setEvents(data.filter(e => !isPast(parseISO(e.date_time))).slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div data-testid=\"home-page\">
      {/* Hero Section */}
      <section data-testid=\"hero-section\" className=\"relative h-[90vh] min-h-[600px] overflow-hidden\">
        <img
          src=\"https://images.unsplash.com/photo-1656476425479-2918d88f2a57?crop=entropy&cs=srgb&fm=jpg&q=85\"
          alt=\"Trail at sunrise\"
          className=\"absolute inset-0 w-full h-full object-cover\"
        />
        <div className=\"hero-overlay absolute inset-0\" />
        <div className=\"relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20\">
          <div className=\"max-w-3xl\">
            <p className=\"text-[#FF4D00] font-bold text-sm uppercase tracking-[0.3em] mb-4\">
              Run together. Run further.
            </p>
            <h1 className=\"font-heading text-5xl sm:text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-6\">
              TrailBlazers<br />Run Club
            </h1>
            <p className=\"text-gray-300 text-lg md:text-xl max-w-lg leading-relaxed mb-8\">
              A community of runners pushing limits on every trail. Weekly runs, epic races, and memories that last.
            </p>
            <div className=\"flex flex-wrap gap-4\">
              <Link to=\"/events\" data-testid=\"hero-events-btn\">
                <Button className=\"bg-[#FF4D00] text-white hover:bg-[#FF4D00]/90 rounded-sm font-bold uppercase tracking-widest px-8 py-6 h-auto transition-transform duration-300 hover:-translate-y-1\">
                  View Events
                  <ArrowRight className=\"w-4 h-4 ml-2\" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section data-testid=\"upcoming-events-section\" className=\"py-20 md:py-32\">
        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
          <div className=\"flex items-end justify-between mb-12\">
            <div>
              <p className=\"text-[#FF4D00] font-bold text-sm uppercase tracking-[0.3em] mb-2\">
                What's Next
              </p>
              <h2 className=\"font-heading text-4xl font-bold uppercase tracking-tight\">
                Upcoming Events
              </h2>
            </div>
            <Link to=\"/events\" data-testid=\"view-all-events-link\" className=\"hidden sm:flex items-center gap-1 text-sm font-bold uppercase tracking-widest hover:text-[#FF4D00] transition-colors duration-300\">
              View All <ChevronRight className=\"w-4 h-4\" />
            </Link>
          </div>

          {loading ? (
            <div className=\"flex flex-col gap-4\">
              {[1,2,3].map(i => (
                <div key={i} className=\"h-24 bg-muted animate-pulse\" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className=\"text-center py-20\">
              <p className=\"text-muted-foreground text-lg\">No upcoming events yet. Check back soon!</p>
            </div>
          ) : (
            <div className=\"flex flex-col gap-0\">
              {events.map((event) => {
                const date = parseISO(event.date_time);
                return (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    data-testid={`event-card-${event.id}`}
                    className=\"group flex flex-col md:flex-row md:items-center gap-4 md:gap-8 border-b border-border py-8 hover:bg-muted/30 transition-colors duration-300 px-2\"
                  >
                    {/* Date Badge */}
                    <div className=\"flex flex-col items-center justify-center w-16 h-16 bg-muted text-foreground font-black uppercase border border-border shrink-0\">
                      <span className=\"text-xs tracking-widest\">{format(date, 'MMM')}</span>
                      <span className=\"text-2xl font-heading leading-none\">{format(date, 'dd')}</span>
                    </div>

                    {/* Info */}
                    <div className=\"flex-1 min-w-0\">
                      <h3 className=\"font-heading text-2xl font-semibold tracking-normal group-hover:text-[#FF4D00] transition-colors duration-300\">
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
                      </div>
                    </div>

                    {/* Distance Badge */}
                    <Badge className=\"bg-[#141B2D] text-white border-0 font-bold uppercase tracking-wider text-xs px-3 py-1 w-fit\">
                      {event.distance}
                    </Badge>

                    <ChevronRight className=\"w-5 h-5 text-muted-foreground group-hover:text-[#FF4D00] transition-colors duration-300 hidden md:block\" />
                  </Link>
                );
              })}
            </div>
          )}

          <Link to=\"/events\" className=\"sm:hidden flex items-center gap-1 text-sm font-bold uppercase tracking-widest hover:text-[#FF4D00] mt-8 transition-colors duration-300\">
            View All Events <ChevronRight className=\"w-4 h-4\" />
          </Link>
        </div>
      </section>

      {/* Community Section */}
      <section data-testid=\"community-section\" className=\"relative overflow-hidden\">
        <div className=\"grid grid-cols-1 md:grid-cols-2\">
          <div className=\"relative h-[400px] md:h-auto\">
            <img
              src=\"https://images.unsplash.com/photo-1623208525215-a573aacb1560?crop=entropy&cs=srgb&fm=jpg&q=85\"
              alt=\"Running community\"
              className=\"absolute inset-0 w-full h-full object-cover\"
            />
          </div>
          <div className=\"bg-[#141B2D] relative noise-overlay text-white px-8 sm:px-16 py-20 md:py-32 flex flex-col justify-center\">
            <div className=\"relative z-10\">
              <p className=\"text-[#D2F800] font-bold text-sm uppercase tracking-[0.3em] mb-4\">
                The Community
              </p>
              <h2 className=\"font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight mb-6\">
                Every Trail.<br />Every Pace.<br />Every Runner.
              </h2>
              <p className=\"text-gray-400 text-lg leading-relaxed max-w-md mb-8\">
                Whether you're chasing a PR or just getting started, TrailBlazers is your crew. No judgment, just miles.
              </p>
              <Link to=\"/events\" data-testid=\"community-events-btn\">
                <Button className=\"bg-[#D2F800] text-[#0A0A0A] hover:bg-[#D2F800]/90 rounded-sm font-bold uppercase tracking-widest px-8 py-6 h-auto transition-transform duration-300 hover:-translate-y-1\">
                  Find Your Run
                  <ArrowRight className=\"w-4 h-4 ml-2\" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
