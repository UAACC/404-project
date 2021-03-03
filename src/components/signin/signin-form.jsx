import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { setCurrentUser } from "../../redux/user/useractions";

class SignInForm extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            username: '',
            password: ''
        }
    }

    handleLogin = async () => {
        const { username, password } = this.state;
        const doc = await axios.post('/auth/', {username, password});
        // save token into redux.
        const token = doc.data;
        // using token to get user information
        // const doc2 = await axios.get('/api/users/', {token: })
        // add {authoried: Token {token}}
        // save user informaiton into redux
        // this.props.setCurrentUser(doc2.data);
    }

    render(){
        return (
            <div>
                <input />
                <input />
                <button onClick={this.handleLogin}>Login</button>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    setCurrentUser: (user) => dispatch(setCurrentUser(user)),
  });
  
  export default connect(null, mapDispatchToProps)(SignInForm);