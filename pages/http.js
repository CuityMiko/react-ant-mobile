import React, { Component } from 'react'
import { Button, InputItem, WingBlank, Toast } from 'antd-mobile'
import { bindActionCreators } from 'redux'
import * as httpAction from '../actions/http'
import Layout from '../components/Layout'
import MenuBar from '../components/MenuBar'
import { ReduxIni } from '../decorators'

function mapStateToProps(state) {
  return {
    user: state.http.user,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    login: bindActionCreators(httpAction.login, dispatch),
  }
}

@ReduxIni(mapStateToProps, mapDispatchToProps)
export default class Http extends Component {
  static getInitialProps({ req, isServer }) {
    const language = req ? req.headers['accept-language'] : navigator.language
    return { language, isServer }
  }
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      password: '',
      loading: false,
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.user && this.state.loading) {
      if (nextProps.user.success) {
        Toast.success('loginSuccessfully');
        this.props.getTimeList();
      } else {
        Toast.fail(nextProps.user.errmsg);
      }
      this.setState({ loading: false });
    }
  }
  login = () => {
    const { name, password } = this.state;
    if (name && password) {
      this.setState({ loading: true });
      this.props.login(name, password);
    }
  }

  upDate(e, type) {
    if (type == 'name') {
      this.setState({ name: e });
    } else if (type == 'password') {
      this.setState({ password: e });
    }
  }
  render() {
    const { language, url: { pathname } } = this.props
    const { name, password, loading } = this.state;
    return (
      <Layout language={language}>
        <MenuBar
          pathname={pathname}
        >
          <div >
            <WingBlank style={{ margin: '15px' }}>
              <div style={{ display: 'inline-block', width: '30%' }}>userName:</div>
              <div style={{ display: 'inline-block', width: '70%' }} ><InputItem type="text" value={name} onChange={(e) => this.upDate(e, 'name')} /></div>
            </WingBlank>

            <WingBlank>
              <div style={{ display: 'inline-block', width: '30%' }}>passWord:</div>
              <div style={{ display: 'inline-block', width: '70%' }} ><InputItem type="password" value={password} onChange={(e) => this.upDate(e, 'password')} /></div>
            </WingBlank>
            <Button style={{ margin: '20px' }} type="primary" size="small" loading={loading} onClick={this.login}>login</Button></div>
        </MenuBar>
      </Layout>
    )
  }
}