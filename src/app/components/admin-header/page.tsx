
import LogOut from "../../logout/page";
import "./page.css";

const AdminHeader = () => {

  return (
    <header className="admin-header">
      <div className="navbar">
        <nav>
          <ul className="menu">
            <li className="li-1">
              <a className="courses" href="#">Kurzusok</a>
              <a className="email" href="#">Email</a>
            </li>
            <li className="logout">
              <LogOut />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;
