import { Outlet, Link } from "react-router-dom";

import "./Layout.css";

const Layout = () => (
  <div className="Layout">
    <nav>
      <ul>
        <li className="grow">
          <Link to="http://server:3001/">Employees</Link>
        </li>
        <li>
          <Link to="http://server:3001/create">
            <button type="button">Create Employee</button>
          </Link>

          <Link to="http://server:3001/equipment">
            <button type="button">Manage inventory</button>
          </Link>

          <Link to="http://server:3001/top-paid">
            <button type="button">Top-Paid</button>
          </Link>

          <Link to="http://server:3001/tools">
            <button type="button">Tools</button>
          </Link>

          <Link to='http://server:3001/games'>
            <button type="button">Games</button>
          </Link>

          <Link to='http://server:3001/divisions'>
            <button type="button">Divisions</button>
          </Link>

        </li>
      </ul>
    </nav>
    <Outlet />
  </div>
);

export default Layout;
