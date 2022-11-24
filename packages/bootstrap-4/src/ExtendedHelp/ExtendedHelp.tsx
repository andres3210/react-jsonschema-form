import React, {useState} from "react"

const ExtendedHelp = ({help, children}: any) => {
  const [open, setOpen] = useState(false)

  return (
    <div> 
      {children}
      <i
        className="fa fa-question-circle"
        style={{ marginLeft: "3px", fontSize: '0.9rem' }}
        onClick={() => setOpen(!open)}
      />
      <div className="clearfix" />
      { open ? 
        <div className="alert alert-info">
          <button type="button" className="close" aria-label="Close">
            <span
              aria-hidden="true"
              style={{ fontSize: '0.95rem', verticalAlign: 'top'}}
              onClick={() => setOpen(false)}>
              &times;
            </span>
          </button>
          <div dangerouslySetInnerHTML={{ __html: help }} />
        </div> : null
      }
    </div>
  )
}

export default ExtendedHelp

