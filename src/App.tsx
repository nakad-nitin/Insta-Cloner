/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import reactLogo from "./assets/react.svg";
import "./App.css";
import next from "./InstaScraper";
import { useEffect, useState } from "react";
import main from "./Listener.ts";

main();

function App() {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [payload, setPayload] = useState({ constantPayload: {}, variablePayload: {} });
  const [active, setActive] = useState(false);

  const onClick = async () => {
    const [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript<any[], void>(
      {
        target: { tabId: tab.id! },
        files: ["./background.js"],
      },
      () =>
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id! },
            args: [startIndex, endIndex],
            func: next, // Executes your inline function
          },
          () => {}
        )
    );
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(async (message: Message, _sender, _sendResponse) => {
      console.log("Received message from tab:", message);
      if (message.type === "FROM_TAB") {
        setActive(true);
      }
      if (message.payloadType === "constant") {
        setPayload((prev) => ({ ...prev, constantPayload: message.payload }));
      }
      if (message.payloadType === "variable") {
        setPayload((prev) => ({ ...prev, variablePayload: message.payload }));
      }
      if (message.payloadType === "signal") {
        setActive(false);
      }
    });
  }, []);

  return (
    <>
      <div style={{ display: "flex", flexFlow: "column", justifyContent: "center", alignItems: "center" }}>
        <h3>{active ? "loading..." : ""}</h3>
        <a href="" target="_blank">
          <img src={reactLogo} className={`logo react ${active ? "active" : ""}`} alt="React logo" />
        </a>
      </div>
      <h2>Insta Scrapper</h2>

      <h3 style={{ color: "red" }}>Kindly, do not close this popup!</h3>
      <div className="card">
        <label htmlFor="start">Start Index:</label>
        <input
          name="start"
          type="number"
          placeholder="start index"
          value={startIndex}
          onChange={(e) => setStartIndex(Number(e.target.value))}
        />
        <p />
        <label htmlFor="end">End Index: </label>
        <input
          name="end"
          type="number"
          placeholder="end index"
          value={endIndex}
          min={0}
          onChange={(e) => setEndIndex(Number(e.target.value))}
        />
        <p />
        <div>
          <button onClick={onClick}>Run Next!</button>
        </div>
        <p>
          <code>
            <textarea
              style={{ maxHeight: 200, width: 400, overflow: "auto" }}
              value={JSON.stringify(payload.constantPayload, null, 2)}
            ></textarea>
          </code>
          <code>
            <textarea
              style={{ maxHeight: 200, width: 400, overflow: "auto" }}
              value={JSON.stringify(payload.variablePayload, null, 2)}
            ></textarea>
          </code>
        </p>
      </div>
      <p className="read-the-docs">Good Luck!</p>
    </>
  );
}

export default App;
