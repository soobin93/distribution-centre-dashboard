import Badge from '@/components/Badge'
import Spinner from '@/components/Spinner'
import { useMediaUpdates } from '@/api/queries'

const mediaTone = (type: string) => {
  if (type === 'camera_feed') return 'info'
  if (type === 'photo') return 'success'
  return 'neutral'
}

const MediaUpdatesPage = () => {
  const { data: items = [], isLoading: loading, isError } = useMediaUpdates()

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
          <p className="page__subtitle">
            Photo gallery and live camera placeholders across project sites.
          </p>
        </div>
      </div>

      <div className="grid grid--media">
        {items.map((item) => (
          <div className="media-card" key={item.id}>
            <div className="media-card__image">
              <img src={item.media_url} alt={item.title} />
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

export default MediaUpdatesPage
