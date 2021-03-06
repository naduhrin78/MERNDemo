import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import TextFieldGroup from "./../common/TextFieldGroup";

import { loginUser } from "./../../actions/authActions";

class Login extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password1: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) this.props.history.push("/dashboard");
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password1: this.state.password1,
      errors: this.state.errors
    };

    this.props.loginUser(userData);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      if (nextProps.errors) {
        this.setState({ errors: nextProps.errors });
      }
      if (nextProps.auth.isAuthenticated) {
        this.props.history.push("/dashboard");
      }
    }
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">
                Sign in to your DevConnector account
              </p>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  type="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  errors={errors.email}
                  placeholder="Email Address"
                  name="email"
                />
                <TextFieldGroup
                  type="password"
                  value={this.state.password1}
                  onChange={this.onChange}
                  errors={errors.password1}
                  placeholder="password"
                  name="password1"
                />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
