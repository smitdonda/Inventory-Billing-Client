import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import Main from "./Components/pages";

export const BillBook = React.createContext();

function App() {
  // customers selected object data and after saveData all details in this variable
  let [custdata, setCustData] = React.useState([]);

  //set

  return (
    <BrowserRouter>
      <BillBook.Provider value={{ custdata, setCustData }}>
        <Main />
      </BillBook.Provider>
    </BrowserRouter>
  );
}
export default App;
