import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getEvents, deleteEvent } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Calendar, MapPin, Image, LayoutDashboard } from 'lucide-react';
import { format, parseISO, isPast } from 'date-fns';

export default function AdminDashboardPage() {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!admin) {
      navigate('/login');
      return;
    }
    fetchEvents();
  }, [admin, navigate]);

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

  const handleDelete = async () => {
    if (!deleteDialog) return;
    setDeleting(true);
    try {
      await deleteEvent(deleteDialog.id);
      setEvents(prev => prev.filter(e => e.id !== deleteDialog.id));
      toast.success('Event deleted');
    } catch (err) {
      toast.error('Failed to delete event');
    } finally {
      setDeleting(false);
      setDeleteDialog(null);
    }
  };

  const upcomingCount = events.filter(e => !isPast(parseISO(e.date_time))).length;
  const totalPhotos = events.reduce((acc, e) => acc + (e.photos?.length || 0), 0);

  return (
    <div data-testid=\"admin-dashboard\" className=\"pt-16 min-h-screen bg-muted/20\">
      {/* Header */}
      <div className=\"bg-[#141B2D] relative noise-overlay\">
        <div className=\"relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12\">
          <div className=\"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4\">
            <div>
              <div className=\"flex items-center gap-2 mb-2\">
                <LayoutDashboard className=\"w-5 h-5 text-[#FF4D00]\" />
                <p className=\"text-[#FF4D00] font-bold text-sm uppercase tracking-[0.3em]\">
                  Command Center
                </p>
              </div>
              <h1 className=\"font-heading text-3xl md:text-4xl font-bold text-white uppercase tracking-tight\">
                Admin Dashboard
              </h1>
            </div>
            <Link to=\"/admin/events/new\" data-testid=\"create-event-btn\">
              <Button className=\"bg-[#FF4D00] text-white hover:bg-[#FF4D00]/90 rounded-sm font-bold uppercase tracking-widest px-6 py-5 h-auto transition-transform duration-300 hover:-translate-y-1\">
                <Plus className=\"w-4 h-4 mr-2\" />
                New Event
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6\">
        <div className=\"grid grid-cols-1 sm:grid-cols-3 gap-4\">
          <div data-testid=\"stat-total-events\" className=\"bg-background border border-border p-6 hover:border-[#FF4D00] transition-colors duration-300\">
            <p className=\"text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1\">Total Events</p>
            <p className=\"font-heading text-3xl font-bold\">{events.length}</p>
          </div>
          <div data-testid=\"stat-upcoming\" className=\"bg-background border border-border p-6 hover:border-[#FF4D00] transition-colors duration-300\">
            <p className=\"text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1\">Upcoming</p>
            <p className=\"font-heading text-3xl font-bold text-[#FF4D00]\">{upcomingCount}</p>
          </div>
          <div data-testid=\"stat-total-photos\" className=\"bg-background border border-border p-6 hover:border-[#FF4D00] transition-colors duration-300\">
            <p className=\"text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1\">Total Photos</p>
            <p className=\"font-heading text-3xl font-bold\">{totalPhotos}</p>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10\">
        <h2 className=\"font-heading text-xl font-bold uppercase tracking-tight mb-6\">
          All Events
        </h2>

        {loading ? (
          <div className=\"flex flex-col gap-3\">
            {[1,2,3].map(i => (
              <div key={i} className=\"h-20 bg-muted animate-pulse\" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className=\"text-center py-16 border border-dashed border-border bg-background\">
            <Calendar className=\"w-12 h-12 mx-auto text-muted-foreground/30 mb-4\" />
            <p className=\"text-muted-foreground mb-4\">No events yet. Create your first event!</p>
            <Link to=\"/admin/events/new\">
              <Button className=\"bg-[#FF4D00] text-white hover:bg-[#FF4D00]/90 rounded-sm font-bold uppercase tracking-widest px-6 py-4 h-auto\">
                <Plus className=\"w-4 h-4 mr-2\" />
                Create Event
              </Button>
            </Link>
          </div>
        ) : (
          <div className=\"flex flex-col gap-0\">
            {events.map((event) => {
              const date = parseISO(event.date_time);
              const past = isPast(date);
              return (
                <div
                  key={event.id}
                  data-testid={`admin-event-${event.id}`}
                  className={`flex flex-col md:flex-row md:items-center gap-4 bg-background border-b border-border py-5 px-4 hover:bg-muted/30 transition-colors duration-300 ${past ? 'opacity-60' : ''}`}
                >
                  {/* Date */}
                  <div className=\"flex flex-col items-center justify-center w-14 h-14 bg-muted text-foreground font-black uppercase border border-border shrink-0\">
                    <span className=\"text-[10px] tracking-widest\">{format(date, 'MMM')}</span>
                    <span className=\"text-xl font-heading leading-none\">{format(date, 'dd')}</span>
                  </div>

                  {/* Info */}
                  <div className=\"flex-1 min-w-0\">
                    <div className=\"flex items-center gap-2\">
                      <h3 className=\"font-heading text-lg font-semibold truncate\">{event.name}</h3>
                      <Badge className=\"bg-[#141B2D] text-white border-0 text-[10px] px-2 py-0.5 font-bold uppercase\">{event.distance}</Badge>
                    </div>
                    <div className=\"flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground\">
                      <span className=\"flex items-center gap-1\">
                        <Calendar className=\"w-3 h-3\" />
                        {format(date, 'MMM d, yyyy · h:mm a')}
                      </span>
                      <span className=\"flex items-center gap-1\">
                        <MapPin className=\"w-3 h-3\" />
                        {event.location}
                      </span>
                      <span className=\"flex items-center gap-1\">
                        <Image className=\"w-3 h-3\" />
                        {event.photos?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className=\"flex items-center gap-2 shrink-0\">
                    <Link to={`/admin/events/${event.id}/edit`} data-testid={`edit-event-${event.id}`}>
                      <Button variant=\"outline\" size=\"sm\" className=\"gap-1 text-xs font-bold uppercase tracking-wider border-border hover:border-foreground\">
                        <Pencil className=\"w-3 h-3\" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant=\"outline\"
                      size=\"sm\"
                      data-testid={`delete-event-${event.id}`}
                      onClick={() => setDeleteDialog(event)}
                      className=\"gap-1 text-xs font-bold uppercase tracking-wider text-destructive border-destructive/30 hover:bg-destructive hover:text-white hover:border-destructive\"
                    >
                      <Trash2 className=\"w-3 h-3\" />
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent data-testid=\"delete-confirm-dialog\">
          <DialogHeader>
            <DialogTitle className=\"font-heading text-xl uppercase\">Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete \"{deleteDialog?.name}\"? This will also remove all associated photos. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant=\"outline\"
              onClick={() => setDeleteDialog(null)}
              data-testid=\"delete-cancel-btn\"
              className=\"font-bold uppercase tracking-wider text-xs\"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              data-testid=\"delete-confirm-btn\"
              className=\"bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold uppercase tracking-wider text-xs\"
            >
              {deleting ? 'Deleting...' : 'Delete Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
