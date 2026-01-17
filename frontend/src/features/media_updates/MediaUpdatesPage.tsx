import Badge from '../../components/Badge'
import { mediaUpdates } from './mock'

const mediaTone = (type: string) => {
  if (type === 'camera_feed') return 'info'
  if (type === 'photo') return 'success'
  return 'neutral'
}

const MediaUpdatesPage = () => {
  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1>Media Updates</h1>
          <p className="page__subtitle">
            Photo gallery and live camera placeholders across project sites.
          </p>
        </div>
      </div>

      <div className="grid grid--media">
        {mediaUpdates.map((item) => (
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
