import { Link } from "react-router-dom";
import "./NavBar.css";
import CreatePost from "./CreatePost";

const NavBar = () => {
    return(
        <nav>
            <Link className='home' to='/'>
                My Blog
            </Link>
            <CreatePost />
        </nav>
    )
}

export default NavBar;