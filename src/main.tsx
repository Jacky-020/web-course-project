// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import "./index.css";
// import App from "./App/App.tsx";
// import SideNavbar from'./frontend/components/SideNavbar'
// import LocationTable from'./frontend/components/LocationTable'
// import MapView from './frontend/components/MapView'

// const routes = [
//     {
//         path: "/",
//         element: <App />,
//     },
//     {
//         path: "/locationTable",
//         element: <LocationTable/>,
//     },
//     {
//         path: "/MapView",
//         element: <MapView/>
//     },
//     {
//         path: "/*",
//         element: <h1>404 Not Found</h1>,
//     },
// ];

// createRoot(document.getElementById("root")!).render(
//     <StrictMode>
//             <div className='d-flex'>
//                 <div className="sidebar">
//                     <SideNavbar />
//                 </div>
//                 <div className="main-content">
//                     <BrowserRouter>
//                         <Routes>
//                             {routes.map((route) => (
//                                 <Route key={route.path} path={route.path} element={route.element} />
//                             ))}
//                         </Routes>
//                     </BrowserRouter>
//                 </div>
//             </div>
//     </StrictMode>
// );
