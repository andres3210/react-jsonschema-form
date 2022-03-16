import React from "react";

export default class ExtendedHelp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  render() {
    return (
      <div>
        {/** Space for Label or other passed content*/}
        {this.props.children}
        <i
          className="fa fa-question-circle"
          style={{ "margin-left": "3px" }}
          onClick={() => this.setState({ open: !this.state.open })}
        />
        <div className="clearfix" />
        {this.state.open ? (
          <div>
            <div className="alert alert-info">
              <button type="button" className="close" aria-label="Close">
                <span
                  aria-hidden="true"
                  onClick={() => this.setState({ open: false })}>
                  &times;
                </span>
              </button>
              <div dangerouslySetInnerHTML={{ __html: this.props.help }} />
            </div>
          </div>
        ) : (
          undefined
        )}
      </div>
    );
  }
}
