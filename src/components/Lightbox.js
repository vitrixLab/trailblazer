import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Lightbox = ({ photos, currentIndex, onClose, onNext, onPrev }) => {
  if (currentIndex === null || currentIndex === undefined) return null;

  const photo = photos[currentIndex];
  if (!photo) return null;

  return (
    <div
      data-testid="lightbox"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        data-testid="lightbox-close"
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          zIndex: 10,
          color: 'rgba(255,255,255,0.7)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
        onClick={onClose}
      >
        <X style={{ width: '2rem', height: '2rem' }} />
      </button>

      {/* Previous */}
      {currentIndex > 0 && (
        <button
          data-testid="lightbox-prev"
          style={{
            position: 'absolute',
            left: '1rem',
            zIndex: 10,
            color: 'rgba(255,255,255,0.7)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
        >
          <ChevronLeft style={{ width: '2.5rem', height: '2.5rem' }} />
        </button>
      )}

      {/* Image */}
      <img
        data-testid="lightbox-image"
        src={photo.url}
        alt="Event photo"
        style={{
          maxHeight: '85vh',
          maxWidth: '90vw',
          objectFit: 'contain',
        }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next */}
      {currentIndex < photos.length - 1 && (
        <button
          data-testid="lightbox-next"
          style={{
            position: 'absolute',
            right: '1rem',
            zIndex: 10,
            color: 'rgba(255,255,255,0.7)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
          onClick={(e) => { e.stopPropagation(); onNext(); }}
        >
          <ChevronRight style={{ width: '2.5rem', height: '2.5rem' }} />
        </button>
      )}

      {/* Counter */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.6)',
          fontSize: '0.875rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  );
};

export default Lightbox;