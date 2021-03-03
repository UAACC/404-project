import React from 'react';
// redux
import { connect } from "react-redux";

class MainPage extends React.Component {
    componentDidMount = () => {
        // extract user
        const user = this.props.currentUser;
    }
}

// redux
const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(MainPage);
