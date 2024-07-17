import { Component } from 'react'

class LogOut extends Component {
    
    // حذف توکن
    componentDidMount(){
        localStorage.removeItem("token")
        window.location = "/album"
      }
      // حذف توکن

    render() { 
        return null;
    }
}
 
export default LogOut;