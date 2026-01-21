import Badge from '@/features/ui/badge/Badge.component'
import Spinner from '@/features/ui/spinner/Spinner.component'
import { useMediaItems } from '@/api/queries'

const mediaTone = (type: string) => {
  if (type === 'camera_feed') return 'info'
  if (type === 'photo') return 'success'
  return 'neutral'
}

const MediaLibrary = () => {
  const { data: items = [], isLoading: loading, isError } = useMediaItems()

  if (loading) {
    return (
      <section className="page">
        <div className="page__header">
          <div>
            <h1>Media Library</h1>
            <p className="page__subtitle">Loading media library.</p>
          </div>
        </div>
        <Spinner label="Loading media" />
      </section>
    )
  }

  if (isError) {
    return (
      <section className="page">
        <div className="page__header">
          <div>
            <h1>Media Library</h1>
            <p className="page__subtitle">Media library data could not be loaded.</p>
          </div>
        </div>
        <div className="notice">Please try again shortly.</div>
      </section>
    )
  }

  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1>Media Library</h1>
          <p className="page__subtitle">Centralized media items across project sites.</p>
        </div>
      </div>

      <div className="grid grid--media">
        {items.map((item) => (
          <div className="media-card" key={item.id}>
            <div className="media-card__image">
              <img
                src={item.media_url}
                alt={item.title}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
            </div>
            <div className="media-card__body">
              <div className="media-card__header">
                <h3>{item.title}</h3>
                <Badge label={item.media_type.replace('_', ' ')} tone={mediaTone(item.media_type)} />
              </div>
              <p className="subtle">{item.description}</p>
              <div className="media-card__meta">
                <span>{item.captured_at.split('T')[0]}</span>
                <span>Uploaded by {item.uploaded_by}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MediaLibrary
