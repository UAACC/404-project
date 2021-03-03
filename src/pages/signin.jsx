import React from 'react';
import SignInForm from "../components/signin/signin-form";

class SignInPage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
           
        }
    }

    render(){
        return (
            <div>
               <SignInForm />
            </div>
        )
    }
}
export default SignInPage;