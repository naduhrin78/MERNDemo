import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

function TextFieldGroup({
  type,
  value,
  placeholder,
  name,
  onChange,
  errors,
  info,
  site
}) {
  let socialType = "fab fa-" + site;
  let formClass = site ? "input-group mb-3" : "form-group";

  return (
    <div className={formClass}>
      {site && (
        <div className="input-group-prepend">
          <span className="input-group-text">
            <i className={socialType} />
          </span>
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={classnames("form-control form-control-lg", {
          "is-invalid": errors
        })}
        placeholder={placeholder}
        name={name}
      />

      {errors && <div className="invalid-feedback">{errors}</div>}
      {info && <small className="form-text text-muted">{info}</small>}
    </div>
  );
}

TextFieldGroup.proptypes = {
  type: PropTypes.string.isRequired,
  site: PropTypes.string,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.string,
  info: PropTypes.string,
  placeholder: PropTypes.string
};

TextFieldGroup.defaultProps = {
  type: "text"
};

export default TextFieldGroup;
