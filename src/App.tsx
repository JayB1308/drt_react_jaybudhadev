import { Routes, Route } from "react-router";
import Home from "@views/home";
import SelectedItems from "@views/selected-items";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/selected-items" element={<SelectedItems />} />
      </Routes>
    </>
  );
}

export default App;
