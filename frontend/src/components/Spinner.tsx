import './Spinner.css'

type SpinnerProps = {
  label?: string
}

const Spinner = ({ label }: SpinnerProps) => {
  return (
    <div className="spinner">
      <div className="spinner__ring" />
      {label ? <span className="spinner__label">{label}</span> : null}
    </div>
  )
}

export default Spinner
