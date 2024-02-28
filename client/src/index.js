import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

import Layout from "./Pages/Layout";
import ErrorPage from "./Pages/ErrorPage";
import EmployeeList from "./Pages/EmployeeList";
import EmployeeCreator from "./Pages/EmployeeCreator";
import EmployeeUpdater from "./Pages/EmployeeUpdater";

import "./index.css";
import TableTest from "./Pages/TableTest";
import FormTest from "./Pages/FormTest";
import Hello from "./Pages/Hello";
import Superheroes from "./Pages/Superheroes";
import EquipmentForm from "./Components/EquipmentForm";
import EmployeeSearch from "./Pages/EmployeeSearch";
import MissingEmployees from "./Pages/MissingEmployees";
import TopPaid from "./Pages/TopPaid";
import Tools from "./Pages/Tools";
import Kittens from "./Pages/Kittens";
import Boardgames from "./Pages/Boardgames";
import Gameslist from "./Pages/Gameslist";
import GameslistbyID from "./Pages/GameslistbyID";
import ToolsbyID from "./Pages/ToolsbyID";
import EmployeeAddress from "./Pages/EmployeeAddress";
import Divisions from './Pages/Divisions';
import DivisionForm from "./Pages/DivisionForm";
import DivisionCreate from "./Pages/DivisionCreate";
import DivisionDetails from "./Pages/DivisionDetails";
import SearchEmployees from "./Pages/SearchEmployees";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <EmployeeList />,
      },
      {
        path: "/create",
        element: <EmployeeCreator />,
      },
      {
        path: "/update/:id",
        element: <EmployeeUpdater />,
      },
      {
        path: "/table-test",
        element: <TableTest />,
      },
      {
        path: "/form-test",
        element: <FormTest />,
      },
      {
        path: "/hello",
        element: <Hello />
      },
      {
        path: "/employees/superheroes",
        element: <Superheroes />
      },
      {
        path: "/equipment",
        element: <EquipmentForm />
      },
      {
        path: "/employees/:search",
        element: <EmployeeSearch />
      },
      {
        path: '/missing',
        element: <MissingEmployees />
      },
      {
        path: '/top-paid',
        element: <TopPaid />
      },
      {
        path: '/tools',
        element: <Tools />
      },
      {
        path: '/kittens/:employeeId',
        element: <Kittens />
      },
      {
        path: '/games',
        element: <Boardgames />
      },
      {
        path: '/games-list',
        element: <Gameslist />
      },
      {
        path: '/games-list/:id',
        element: <GameslistbyID />
      },
      {
        path: 'tools/:id',
        element: <ToolsbyID />
      },
      {
        path: '/employee/:id/address',
        element: <EmployeeAddress />
      },
      {
        path: '/divisions',
        element: <Divisions />
      },
      {
        path: '/divisions/:id',
        element: <DivisionForm />
      },
      {
        path: '/divisions/create',
        element: <DivisionCreate />
      },
      {
        path: '/divisions/:id/details',
        element: <DivisionDetails />
      },
      {
        path: '/search-employees',
        element: <SearchEmployees />
      }
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
