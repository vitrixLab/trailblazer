import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getEvent, createEvent, updateEvent, addPhoto, deletePhoto } from '@/lib/api';
import { toast } from 'sonner';
import { ArrowLeft, Save, Upload, Trash2 } from 'lucide-react';
import Lightbox from '@/components/Lightbox';

export default function AdminEventFormPage() {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    distance_km: '',
    elevation_gain_m: '',
  });
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!admin) {
      navigate('/login');
      return;
    }
    if (isEditing) {
      fetchEvent();
    }
  }, [admin, navigate, isEditing, id]);

  const fetchEvent = async () => {
    try {
      const { data } = await getEvent(id);
      setFormData({
        title: data.title || '',
        description: data.description || '',
        date: data.date ? data.date.slice(0, 16) : '',
        location: data.location || '',
        distance_km: data.distance_km || '',
        elevation_gain_m: data.elevation_gain_m || '',
      });
      setPhotos(data.photos || []);
    } catch (err) {
      toast.error('Failed to load event');
      navigate('/admin');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        distance_km: formData.distance_km ? parseFloat(formData.distance_km) : null,
        elevation_gain_m: formData.elevation_gain_m ? parseInt(formData.elevation_gain_m) : null,
      };
      if (isEditing) {
        await updateEvent(id, payload);
        toast.success('Event updated');
      } else {
        const { data } = await createEvent(payload);
        navigate(`/admin/events/${data.id}/edit`);
        toast.success('Event created – now add photos');
      }
    } catch (err) {
      toast.error(isEditing ? 'Failed to update event' : 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        await addPhoto(id, file, '');
      }
      toast.success(`${files.length} photo(s) uploaded`);
      const { data } = await getEvent(id);
      setPhotos(data.photos || []);
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
    e.target.value = '';
  };

  const handleDeletePhoto = async (publicId) => {
    if (!confirm('Delete this photo?')) return;
    try {
      await deletePhoto(id, publicId);
      setPhotos(prev => prev.filter(p => p.public_id !== publicId));
      toast.success('Photo deleted');
    } catch (err) {
      toast.error('Failed to delete photo');
    }
  };

  if (!admin) return null;

  return (
    <div data-testid="admin-event-form" style={{ paddingTop: '4rem', minHeight: '100vh', backgroundColor: 'rgba(243,244,246,0.2)' }}>
      <div className="container" style={{ maxWidth: '56rem', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <button
          onClick={() => navigate('/admin')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '1.5rem',
            transition: 'color 0.3s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
        >
          <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
          Back to Dashboard
        </button>

        <div className="card-feature" style={{ padding: '2.5rem 2rem' }}>
          <h1 className="h2" style={{ marginBottom: '2rem' }}>
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label htmlFor="title" className="caption" style={{ display: 'block', marginBottom: '0.25rem' }}>
                Title *
              </label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label htmlFor="description" className="caption" style={{ display: 'block', marginBottom: '0.25rem' }}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                style={{ width: '100%', fontFamily: 'var(--font-body)' }}
              />
            </div>

            <style>{`
              .form-row {
                display: grid;
                grid-template-columns: 1fr;
                gap: 1.5rem;
              }
              @media (min-width: 768px) {
                .form-row {
                  grid-template-columns: 1fr 1fr;
                }
              }
            `}</style>
            <div className="form-row">
              <div>
                <label htmlFor="date" className="caption" style={{ display: 'block', marginBottom: '0.25rem' }}>
                  Date & Time *
                </label>
                <input
                  id="date"
                  name="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label htmlFor="location" className="caption" style={{ display: 'block', marginBottom: '0.25rem' }}>
                  Location *
                </label>
                <input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label htmlFor="distance_km" className="caption" style={{ display: 'block', marginBottom: '0.25rem' }}>
                  Distance (km)
                </label>
                <input
                  id="distance_km"
                  name="distance_km"
                  type="number"
                  step="0.1"
                  value={formData.distance_km}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label htmlFor="elevation_gain_m" className="caption" style={{ display: 'block', marginBottom: '0.25rem' }}>
                  Elevation Gain (m)
                </label>
                <input
                  id="elevation_gain_m"
                  name="elevation_gain_m"
                  type="number"
                  value={formData.elevation_gain_m}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem' }}>
              <button
                type="button"
                className="btn-outline"
                onClick={() => navigate('/admin')}
                style={{ fontSize: '0.75rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.75rem' }}
              >
                <Save style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                {loading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>

          {/* Photo Management */}
          {isEditing && (
            <div style={{ marginTop: '3rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
              <h2 className="h3" style={{ marginBottom: '1rem' }}>Photos</h2>

              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="photo-upload" className="caption" style={{ display: 'block', marginBottom: '0.25rem' }}>
                  Upload New Photos
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  disabled={uploading}
                  style={{ width: '100%' }}
                />
                {uploading && <p className="caption" style={{ marginTop: '0.5rem' }}>Uploading...</p>}
              </div>

              {photos.length === 0 ? (
                <p className="body">No photos yet.</p>
              ) : (
                <style>{`
                  .photo-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.75rem;
                  }
                  @media (min-width: 768px) {
                    .photo-grid {
                      grid-template-columns: repeat(4, 1fr);
                    }
                  }
                `}</style>
              )}
              <div className="photo-grid">
                {photos.map((photo, idx) => (
                  <div key={photo.public_id} style={{ position: 'relative', aspectRatio: '1/1', backgroundColor: 'var(--color-muted)' }}>
                    <img
                      src={photo.url}
                      alt="Event"
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => setLightboxIndex(idx)}
                    />
                    <button
                      onClick={() => handleDeletePhoto(photo.public_id)}
                      style={{
                        position: 'absolute',
                        top: '0.25rem',
                        right: '0.25rem',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '0.25rem',
                        borderRadius: '2px',
                        border: 'none',
                        cursor: 'pointer',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                    >
                      <Trash2 style={{ width: '1rem', height: '1rem' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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