import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./component/Main";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import LnadingPage from "./component/LnadingPage";
import Index from "./component/Index";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer />
      <DndProvider backend={HTML5Backend}>
        <Router>
          <Routes>
            <Route exact path="/" element={<LnadingPage />}></Route>
            <Route exact path="/staking_options" element={<Index />}></Route>
            <Route exact path="/main" element={<Main />}></Route>
            <Route path="/*" element={<p>You have an error</p>}></Route>
          </Routes>
        </Router>
      </DndProvider>
    </>
  );
}

export default App;
