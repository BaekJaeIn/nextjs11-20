import { Component } from "react";
import classes from "./User.module.css";

// 클래스 컴포넌트
class User extends Component {
  componentWillUnmount() {
    console.log("User will unmount");
  }

  render() {
    return <li className={classes.user}>{this.props.name}</li>;
  }
}

// 함수형 컴포넌트
// const User = (props) => {
//   return <li className={classes.user}>{props.name}</li>;
// };

export default User;
