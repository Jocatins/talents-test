import "./index.css";
import Dashboard from "./Dashboard";
import {  BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateKnowledgeEntry from "./pages/CreateEntry";
import EditEntry from "./pages/EditEntry";


function App() {
  return (
    <>
   <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateKnowledgeEntry />} />
          <Route path="/edit/:id" element={<EditEntry />} />
        </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;
