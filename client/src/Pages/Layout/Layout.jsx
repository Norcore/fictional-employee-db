import { Outlet, Link } from "react-router-dom";

import "./Layout.css";

const Layout = () => (
  <div className="Layout">
    <nav>
      <ul>
        <li className="grow">
          <Link to="http://localhost:3000/">Employees</Link>
        </li>
        <li>
          <Link to="http://localhost:3000/create">
            <button type="button">Create Employee</button>
          </Link>

          <Link to="http://localhost:3000/equipment">
            <button type="button">Manage inventory</button>
          </Link>

          <Link to="http://localhost:3000/top-paid">
            <button type="button">Top-Paid</button>
          </Link>

          <Link to="http://localhost:3000/tools">
            <button type="button">Tools</button>
          </Link>

          <Link to='http://localhost:3000/games'>
            <button type="button">Games</button>
          </Link>

          <Link to='http://localhost:3000/divisions'>
            <button type="button">Divisions</button>
          </Link>

        </li>
      </ul>
    </nav>
    <Outlet />
  </div>
);

export default Layout;
