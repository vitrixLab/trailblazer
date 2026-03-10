import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getEvents, deleteEvent } from '@/lib/api';
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

  // 🔧 TEMPORARY: removed admin check – always fetch events
  //useEffect(() => {
    //fetchEvents();
  //}, []);  // no dependencies – runs once on mount

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

  const upcomingCount = events.filter(e => !isPast(parseISO(e.date))).length;
  const totalPhotos = events.reduce((acc, e) => acc + (e.photos?.length || 0), 0);

  return (
    <div data-testid="admin-dashboard" style={{ paddingTop: '4rem', minHeight: '100vh', backgroundColor: 'rgba(243,244,246,0.2)' }}>
      {/* Responsive header layout */}
      <style>{`
        .dashboard-header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .dashboard-header {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ backgroundColor: 'var(--color-secondary)', position: 'relative' }} className="noise-overlay">
        <div className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '3rem', paddingBottom: '3rem' }}>
          <div className="dashboard-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <LayoutDashboard style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-primary)' }} />
                <p style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                  Command Center
                </p>
              </div>
              <h1 className="h2" style={{ color: 'white' }}>
                Admin Dashboard
              </h1>
            </div>
            <Link to="/admin/events/new" data-testid="create-event-btn">
              <button className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.75rem 1.5rem' }}>
                <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                New Event
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
      <div className="container" style={{ marginTop: '-1.5rem' }}>
        <div className="stats-grid">
          <div data-testid="stat-total-events" className="card-feature" style={{ padding: '1.5rem' }}>
            <p className="caption" style={{ marginBottom: '0.25rem' }}>Total Events</p>
            <p className="h2" style={{ fontSize: '2rem' }}>{events.length}</p>
          </div>
          <div data-testid="stat-upcoming" className="card-feature" style={{ padding: '1.5rem' }}>
            <p className="caption" style={{ marginBottom: '0.25rem' }}>Upcoming</p>
            <p className="h2" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>{upcomingCount}</p>
          </div>
          <div data-testid="stat-total-photos" className="card-feature" style={{ padding: '1.5rem' }}>
            <p className="caption" style={{ marginBottom: '0.25rem' }}>Total Photos</p>
            <p className="h2" style={{ fontSize: '2rem' }}>{totalPhotos}</p>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <h2 className="h3" style={{ marginBottom: '1.5rem' }}>
          All Events
        </h2>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height: '5rem', backgroundColor: 'var(--color-muted)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', border: '1px dashed var(--color-border)', backgroundColor: 'var(--color-background)' }}>
            <Calendar style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', color: 'rgba(100,116,139,0.3)' }} />
            <p className="body" style={{ marginBottom: '1rem' }}>No events yet. Create your first event!</p>
            <Link to="/admin/events/new">
              <button className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center' }}>
                <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                Create Event
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {events.map((event) => {
              const date = parseISO(event.date);
              const past = isPast(date);
              return (
                <div
                  key={event.id}
                  data-testid={`admin-event-${event.id}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    backgroundColor: 'var(--color-background)',
                    borderBottom: '1px solid var(--color-border)',
                    padding: '1.25rem 1rem',
                    transition: 'background-color 0.3s',
                    opacity: past ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => { if (!past) e.currentTarget.style.backgroundColor = 'rgba(243,244,246,0.3)'; }}
                  onMouseLeave={(e) => { if (!past) e.currentTarget.style.backgroundColor = 'var(--color-background)'; }}
                >
                  <style>{`
                    .admin-event-row {
                      display: flex;
                      flex-direction: column;
                      gap: 1rem;
                    }
                    @media (min-width: 768px) {
                      .admin-event-row {
                        flex-direction: row;
                        align-items: center;
                        gap: 1.5rem;
                      }
                    }
                  `}</style>
                  <div className="admin-event-row" style={{ width: '100%' }}>
                    {/* Date */}
                    <div className="badge-date" style={{ width: '3.5rem', height: '3.5rem' }}>
                      <span style={{ fontSize: '0.625rem', letterSpacing: '0.1em' }}>{format(date, 'MMM')}</span>
                      <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-headings)', lineHeight: 1 }}>{format(date, 'dd')}</span>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <h3 className="h3" style={{ fontSize: '1.125rem', margin: 0 }}>{event.title}</h3>
                        <span style={{
                          backgroundColor: 'var(--color-secondary)',
                          color: 'white',
                          fontSize: '0.625rem',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          padding: '0.125rem 0.5rem',
                          borderRadius: '2px',
                        }}>
                          {event.distance_km ? `${event.distance_km} km` : 'TBD'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--color-muted-foreground)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Calendar style={{ width: '0.75rem', height: '0.75rem' }} />
                          {format(date, 'MMM d, yyyy · h:mm a')}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin style={{ width: '0.75rem', height: '0.75rem' }} />
                          {event.location}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Image style={{ width: '0.75rem', height: '0.75rem' }} />
                          {event.photos?.length || 0}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                      <Link to={`/admin/events/${event.id}/edit`} data-testid={`edit-event-${event.id}`}>
                        <button className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Pencil style={{ width: '0.75rem', height: '0.75rem' }} />
                          Edit
                        </button>
                      </Link>
                      <button
                        data-testid={`delete-event-${event.id}`}
                        onClick={() => setDeleteDialog(event)}
                        className="btn-outline"
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.75rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          borderColor: 'rgba(220,38,38,0.3)',
                          color: '#dc2626',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#dc2626';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.borderColor = '#dc2626';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#dc2626';
                          e.currentTarget.style.borderColor = 'rgba(220,38,38,0.3)';
                        }}
                      >
                        <Trash2 style={{ width: '0.75rem', height: '0.75rem' }} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialog && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => setDeleteDialog(null)}
        >
          <div
            className="card-feature"
            style={{ maxWidth: '28rem', width: '90%', padding: '2rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="h3" style={{ marginBottom: '0.5rem' }}>Delete Event</h3>
            <p className="body" style={{ marginBottom: '1.5rem' }}>
              Are you sure you want to delete "{deleteDialog.title}"? This will also remove all associated photos. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                className="btn-outline"
                onClick={() => setDeleteDialog(null)}
                data-testid="delete-cancel-btn"
                style={{ fontSize: '0.75rem' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                data-testid="delete-confirm-btn"
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '2px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  opacity: deleting ? 0.7 : 1,
                }}
              >
                {deleting ? 'Deleting...' : 'Delete Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}