import { useState } from "react";
import TabOne from "./TabOne";
import TabTwo from "./TabTwo";
import TabThree from "./TabThree";

export default function Tabs() {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <div>
      {/* Tab buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setActiveTab("tab1")}>Tab 1</button>
        <button onClick={() => setActiveTab("tab2")}>Tab 2</button>
        <button onClick={() => setActiveTab("tab3")}>Tab 3</button>
      </div>

      {/* Tab content */}
      <div style={{ marginTop: 16 }}>
        {activeTab === "tab1" && <TabOne />}
        {activeTab === "tab2" && <TabTwo />}
        {activeTab === "tab3" && <TabThree />}
      </div>
    </div>
  );
}
