import { useEffect, useState } from "react";
import logo from './logo.svg';
import './App.css';

// Import all of the D3JS library
import * as d3 from "d3";
import dataMerged from './data/merged_output.csv';

function App() {

  const [mergedData, setMergedData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Read in the merged dataset.
      await Promise.all([
        d3.csv(dataMerged)
      ]).then((fetchedData) => {
        // Set the state for merged data.
        setMergedData(fetchedData[0]);
      });

      setLoading(false);
    };

    // Todo: Not sure why this is called twice but it's fine because mergedData eventually gets set.
    if (isLoading && mergedData.length === 0) {
      fetchData();
    }
  }, []);

  return (
    <div className="App">
        {isLoading && (
          <>
            <header className="App-header" style={{minHeight: "100vh"}}>
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Merged data has not loaded yet.
              </p>
            </header>
          </>
        )}
        {!isLoading && (
          <>
            <div className="dashboard">
              <div className="wrapper">
                <header className="App-header">
                  <h1>
                    <span className="thin">Lifestyle Habit</span> &nbsp;
                    <span className="bold">Health Indicators</span>
                  </h1>
                  <div className="sub-heading">
                    <p>
                      The following dashboard illustrates the connections between lifestyle habits and health indicators. It reveals that individuals with higher BMIs tend to have elevated glucose and insulin levels, which may suggest an increased risk of diabetes. There is also a noticeable correlation between diabetes and cholesterol issues, emphasizing the need for a more integrated approach to health management. Data was sourced from the &nbsp;
                      <a
                        className="App-link"
                        href="https://wwwn.cdc.gov/nchs/nhanes/continuousnhanes/default.aspx?BeginYear=2013"
                        target="_blank"
                        rel="noopener noreferrer"
                        >NHANES CDC 2013-2014
                      </a>
                      &nbsp; site.
                    </p>
                  </div>
                </header>
                <main className="main">
                  <div className="grid">
                    <div className="card card-participants-container stat-card">
                      <h2>Total Particpants</h2>
                      <span className="stat">{mergedData.length}</span>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </>
        )}
    </div>
  );
}

export default App;
