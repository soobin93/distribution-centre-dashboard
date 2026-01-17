import Badge from '../../components/Badge'
import { documents } from './mock'

const statusTone = (status: string) => {
  if (status === 'approved') return 'success'
  if (status === 'draft') return 'warning'
  return 'neutral'
}

const DocumentsPage = () => {
  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1>Documents Library</h1>
          <p className="page__subtitle">
            Central repository for plans, approvals, and project documentation.
          </p>
        </div>
      </div>

      <div className="table table--five">
        <div className="table__header">
          <span>Document</span>
          <span>Type</span>
          <span>Version</span>
          <span>Status</span>
          <span>Uploaded</span>
        </div>
        {documents.map((doc) => (
          <div className="table__row" key={doc.id}>
            <div>
              <strong>{doc.title}</strong>
              <div className="subtle">{doc.description}</div>
            </div>
            <span className="caps">{doc.doc_type}</span>
            <span>{doc.version}</span>
            <Badge label={doc.status} tone={statusTone(doc.status)} />
            <span>{doc.uploaded_at.split('T')[0]}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default DocumentsPage
