import { Outlet, Link } from "react-router-dom";

import "./Layout.css";

const Layout = () => (
  <div className="Layout">
    <nav>
      <ul>
        <li className="grow">
          <Link to="http://procecc.env.FRONTEND_URL/">Employees</Link>
        </li>
        <li>
          <Link to="http://procecc.env.FRONTEND_URL/create">
            <button type="button">Create Employee</button>
          </Link>

          <Link to="http://procecc.env.FRONTEND_URL/equipment">
            <button type="button">Manage inventory</button>
          </Link>

          <Link to="http://procecc.env.FRONTEND_URL/top-paid">
            <button type="button">Top-Paid</button>
          </Link>

          <Link to="http://procecc.env.FRONTEND_URL/tools">
            <button type="button">Tools</button>
          </Link>

          <Link to='http://procecc.env.FRONTEND_URL/games'>
            <button type="button">Games</button>
          </Link>

          <Link to='http://procecc.env.FRONTEND_URL/divisions'>
            <button type="button">Divisions</button>
          </Link>

        </li>
      </ul>
    </nav>
    <Outlet />
  </div>
);

export default Layout;
