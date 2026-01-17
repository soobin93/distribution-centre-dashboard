import Badge from '../../components/Badge'
import { rfis } from './mock'

const statusTone = (status: string) => {
  if (status === 'answered') return 'success'
  if (status === 'open') return 'warning'
  return 'neutral'
}

const RfisPage = () => {
  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1>RFI Tracking</h1>
          <p className="page__subtitle">
            Requests for Information status, due dates, and responses.
          </p>
        </div>
      </div>

      <div className="table">
        <div className="table__header">
          <span>RFI</span>
          <span>Question</span>
          <span>Raised By</span>
          <span>Due</span>
          <span>Status</span>
          <span>Response</span>
        </div>
        {rfis.map((rfi) => (
          <div className="table__row" key={rfi.id}>
            <div>
              <strong>{rfi.rfi_number}</strong>
              <div className="subtle">{rfi.title}</div>
            </div>
            <span>{rfi.question}</span>
            <span>{rfi.raised_by}</span>
            <span>{rfi.due_date}</span>
            <Badge label={rfi.status} tone={statusTone(rfi.status)} />
            <span className="subtle">{rfi.response_summary}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RfisPage
