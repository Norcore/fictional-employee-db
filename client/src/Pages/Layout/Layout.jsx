import { Outlet, Link } from "react-router-dom";

import "./Layout.css";

const Layout = () => (
  <div className="Layout">
    <nav>
      <ul>
        <li className="grow">
          <Link to="/">Employees</Link>
        </li>
        <li>
          <Link to="/create">
            <button type="button">Create Employee</button>
          </Link>

          <Link to="/equipment">
            <button type="button">Manage inventory</button>
          </Link>

          <Link to="/top-paid">
            <button type="button">Top-Paid</button>
          </Link>

          <Link to="/tools">
            <button type="button">Tools</button>
          </Link>

          <Link to='/games'>
            <button type="button">Games</button>
          </Link>

          <Link to='/divisions'>
            <button type="button">Divisions</button>
          </Link>

        </li>
      </ul>
    </nav>
    <Outlet />
  </div>
);

export default Layout;
