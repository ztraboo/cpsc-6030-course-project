// REFERENCES
// https://dev.to/devtronic/javascript-map-an-array-of-objects-to-a-dictionary-3f42
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries
// https://www.geeksforgeeks.org/how-to-skip-over-an-element-in-map/

import { useEffect, useRef, useState } from "react";
import logo from './logo.svg';
import './App.css';

// Import all of the D3JS library
import * as d3 from "d3";

// Import chart components to render in dashboard
import DonutChartGender from "./components/charts/DonutChartGender";
import ScatterplotChartBloodMeasuresVsBMI from "./components/charts/ScatterplotChartBloodMeasuresVsBMI";
import ScatterplotChartWaistCircumferenceVsBMI from "./components/charts/ScatterplotChartWaistCircumferenceVsBMI";
import StackedBarChartAgeVsExercise from "./components/charts/StackedBarChartAgeVsExercise";

// Import interactions
import { onDonutChartGenderSliceClick } from "./interactions/InteractionsDonutChartGender";
import { onScatterplotChartBloodMeasuresVsBMIClick } from "./interactions/InteractionsScatterplotChartBloodMeasuresVsBMI";
import { onStackedBarChartAgeVsExerciseClick } from "./interactions/InteractionsStackedBarChartAgeVsExercise";

// interface DataItemAgeVsExercise {
//   Age: number;
//   No: number;
//   Vigorous: number;
// }

interface Participant {
  seqnIdentifiers: Set<number>;
  name: string;
  value: number;
  percentage: number;
}

function App() {

  const [participantCount, setParticipantCount] = useState(0);

  const [mergedData, setMergedData] = useState<d3.DSVRowArray<string>>();
  const [
    barChartDataAgeVsExerciseLevel, setBarChartDataAgeVsExerciseLevel
  ] = useState([] as any[]); // as DataItemAgeVsExercise[]);
  const [
    donutChartDataGender, setDonutChartDataGender
  ] = useState([] as Participant[]);

  const [hoveredGroupDataDataBloodMeasuresVsBMI, setHoveredGroupDataDataBloodMeasuresVsBMI] = useState<string | null>(null);
  const [
    scatterplotChartDataBloodMeasuresVsBMI, setScatterplotChartDataBloodMeasuresVsBMI
  ] = useState([]);

  const [hoveredGroupDataWaistCircumferenceVsBMIByGender, setHoveredGroupDataWaistCircumferenceVsBMIByGender] = useState<string | null>(null);
  const [
    scatterplotChartDataWaistCircumferenceVsBMI, setScatterplotChartDataWaistCircumferenceVsBMI
  ] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Read in the merged dataset.
      await Promise.all([
        d3.csv(window.location.pathname + "/data/merged_output.csv")
      ]).then((fetchedData: any[]) => {
        let data = fetchedData[0];

        // Add calculated fields
        // data = data
        // .map((d: any) => {
        //   d["calcFieldGender"] = (d["RIAGENDR"] === "1" ? "Male" : "Female");
        //   return d;
        // })
        // console.log(data);

        // Set the state for merged data.
        setMergedData(data);

        // ---------------------------------------------------------------------------
        // Participant Count
        setParticipantCount(data !== undefined ? data.length : 0);

        // ---------------------------------------------------------------------------
        // Get bar chart `Age vs. Vigorous Exercise` data.
        // Prepare data: Group by Age and Exercise Level
        // const dataBar: Array<object> = 
        // const dataBarAgeVsExercise: Array<DataItemAgeVsExercise> = data.map((element:any) => {
        //     element.age = +element['Age'];
        //     element.exercise = element['Paq605 ( Vigorous Exercise)'];
        // });
        const dataBarAgeVsExercise: Array<any> = data
        .map((participant: any) => {            
          return Object.fromEntries(
            [ 
              [ "seqn", parseInt(participant["Seqn"]) ],
              [ "age", parseFloat(participant["Age"]) ],
              [ "exercise", participant["Paq605 ( Vigorous Exercise)"] ],
              [ "gender", participant["Gender"] ]
            ]
          ) 
        })

        // console.log(dataBarAgeVsExercise);

        // Function to categorize age into groups
        function getAgeGroup(age: number) {
            if (age <= 17) return "≤17";
            if (age >= 18 && age <= 34) return "18-34";
            if (age >= 35 && age <= 59) return "35-59";
            if (age >= 60) return "60 and older";
        }
        
        // Aggregate data by age and exercise level
        const ageGroupExerciseCounts: any = d3.rollup(
          dataBarAgeVsExercise,
            (v) => v.length, // Count participants
            (d) => getAgeGroup(d.age), // Group by Age Group
            (d) => d.exercise, // Group by Exercise Level
            (d) => d.gender
        );

        // console.log(ageGroupExerciseCounts);

        // Convert the data into an array of objects for easy stacking
        const formattedData = Array.from(ageGroupExerciseCounts, ([ageGroup, exerciseMap, genderMap]) => {
            const entry = { 
              AgeGroup: ageGroup,
              No: 0,
              Vigorous: 0
            };
            exerciseMap.forEach((count: any, exercise: any) => {
                if (exercise === "No") entry["No"] = count;
                else if (exercise === "Vigorous") entry["Vigorous"] = count;
            });
            return entry;
        });
        // console.log(formattedData);

        setBarChartDataAgeVsExerciseLevel(
          formattedData
          .map((entry: any) => {    
            let noCount = 0;
            entry["No"].forEach((currentValue: number) => noCount += currentValue);
            let vigorousCount = 0;
            entry["Vigorous"].forEach((currentValue: number) => vigorousCount += currentValue);
            return Object.fromEntries(
              [ 
                [ "ageGroup", entry["AgeGroup"] ],
                [ "groupExerciseLevelNo", noCount ],
                [ "groupExerciseLevelNoMale", entry["No"].get("Male") ],
                [ "groupExerciseLevelNoFemale", entry["No"].get("Female") ],
                [ "groupExerciseLevelVigorous", vigorousCount ],
                [ "groupExerciseLevelVigorousMale", entry["Vigorous"].get("Male") ],
                [ "groupExerciseLevelVigorousFemale", entry["Vigorous"].get("Female") ],
              ]
            ) 
          })
        );

        // ---------------------------------------------------------------------------
        // Get donut `Gender` data.
        // Reference: https://www.geeksforgeeks.org/count-distinct-elements-in-an-array/
        let uniqueGenders = new Set<string>();
        let uniqueParticipantsFemale = new Set<number>();
        let uniqueParticipantsMale = new Set<number>();
        data
        .map((participant: any) => {
          return Object.fromEntries(
            [ 
              [ "seqnIdentifiers", 
                (participant["Gender"] === "Male") ? 
                  uniqueParticipantsMale : 
                  uniqueParticipantsFemale
              ],
              // [ "name", uniqueGenders.add(participant["calcFieldGender"]) ],
              [ "name", uniqueGenders.add(participant["Gender"]) ],
              [ "value", 
                // (participant["calcFieldGender"] === "Male") ? 
                (participant["Gender"] === "Male") ? 
                  uniqueParticipantsMale.add(participant["Seqn"]) : 
                  uniqueParticipantsFemale.add(participant["Seqn"])
              ]
            ]
          ) 
        });

        let donutData: Participant[] = [];
        uniqueGenders.forEach((gender) => {
          donutData.push(
            {
              seqnIdentifiers: 
                (gender === "Male") ? 
                uniqueParticipantsMale:
                uniqueParticipantsFemale,
              name: gender as string,
              value: 
                (gender === "Male") ? 
                uniqueParticipantsMale.size :
                uniqueParticipantsFemale.size,
              percentage:
                (gender === "Male") ? 
                (uniqueParticipantsMale.size / (uniqueParticipantsMale.size + uniqueParticipantsFemale.size)) * 100 :
                (uniqueParticipantsFemale.size / (uniqueParticipantsMale.size + uniqueParticipantsFemale.size)) * 100,
            }
          );
        });

        setDonutChartDataGender(donutData);
        
        // ---------------------------------------------------------------------------
        // Get scatterplot `Blood Measures vs. BMI` data.
        setScatterplotChartDataBloodMeasuresVsBMI(
            data
            .filter((participant: any) => 
              isNaN(parseFloat(participant["Bmxbmi"])) === false || 
              isNaN(parseFloat(participant["Insulin"])) === false ||
              isNaN(parseFloat(participant["Lbxglt(Glucose after 2 hr)"])) === false ||
              isNaN(parseFloat(participant["Lbxglu(Glucose fasting)"])) === false ||
              isNaN(parseFloat(participant["Diabetes Diagnosis Status"])) === false
            )
            .map((participant: any) => {            
              return Object.fromEntries(
                [ 
                  [ "seqn", participant["Seqn"] ],
                  [ "bodyMassIndex", parseFloat(participant["Bmxbmi"]) ],
                  [ "insulin", parseFloat(participant["Insulin"]) ],
                  [ "glucoseAfter2Hour", parseFloat(participant["Lbxglt(Glucose after 2 hr)"]) ],
                  [ "glucoseFasting", parseFloat(participant["Lbxglu(Glucose fasting)"]) ],
                  [ "markColorField", participant["Diabetes Diagnosis Status"] ],
                  [ "ageGroup", getAgeGroup(participant["Age"]) ],
                  [ "exerciseLevel", participant["Paq605 ( Vigorous Exercise)"] ]
                ]
              ) 
            })
        );
              
        // ---------------------------------------------------------------------------
        // Get scatterplot `Waist Circumference (cm) vs. BMI` data.
        setScatterplotChartDataWaistCircumferenceVsBMI(
            data
            .filter((participant: any) => 
              isNaN(parseFloat(participant["Waist Circumference (cm)"])) === false &&
              isNaN(parseFloat(participant["Bmxbmi"])) === false
            )
            .map((participant: any) => {            
              return Object.fromEntries(
                [ 
                  [ "seqn", participant["Seqn"] ],
                  [ "waistCircumference", parseFloat(participant["Waist Circumference (cm)"])],
                  [ "bodyMassIndex", parseFloat(participant["Bmxbmi"]) ],
                  [ "markColorField", participant["Gender"] ],
                  [ "filterGender", participant["Gender"] ],
                  [ "ageGroup", getAgeGroup(participant["Age"]) ],
                  [ "exerciseLevel", participant["Paq605 ( Vigorous Exercise)"] ]
                ]
              ) 
            })
        );
      });

      setLoading(false);
    };

    // Todo: Not sure why this is called twice but it's fine because mergedData eventually gets set.
    if (isLoading && (mergedData === undefined)) {
      fetchData();
    }
  }, []);


  const chartBloodMeasuresVsBMI: any = useRef();

  // Update Blood Measures vs. BMI when Physical Workout vs. Age exerciseLevel bar or age group is selected.
  const filterPointsBloodMeasureVsBMI = (toggledExerciseLevelBar: boolean, group: any, subgroup: any) => {
    if (chartBloodMeasuresVsBMI.current !== undefined) {
      let exerciseBarLevel: string = subgroup.key;
      let ageGroup: string = group.data.x;
      chartBloodMeasuresVsBMI.current.onStackedBarExerciseBarClick(toggledExerciseLevelBar, ageGroup, exerciseBarLevel);
    } 
  };

  const chartRefAgeVsExercise: any = useRef();

  // Update Physical Workout vs. Age tooltip when Donut Gender chart slice is selected.
  const updateTooltipForPhysicalWorkoutVsAge = (toggledSlice: boolean, selectedSeqnIdentifiers: Set<number>, sliceName: string) => {
    if (chartRefAgeVsExercise.current !== undefined) {
      chartRefAgeVsExercise.current.onDonutChartGenderSliceClick(toggledSlice, sliceName);
    } 
  };

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
            <div className="dashboard">
              <div className="wrapper">
                <main className="main">
                  <div className="grid">

                    <div className="left-pane">
                      {/* Scatterplot Chart - Blood Measures vs. BMI */}
                      {scatterplotChartDataBloodMeasuresVsBMI !== undefined && (
                          <div className="card scatterplot-chart-container scatterplot-chart-blood-measures-vs-bmi">
                              <h2 className="App-chart-title">Blood Measures vs. BMI</h2>
                              <ScatterplotChartBloodMeasuresVsBMI
                                height={260}
                                data={scatterplotChartDataBloodMeasuresVsBMI}
                                hoveredGroup={hoveredGroupDataDataBloodMeasuresVsBMI}
                                setHoveredGroup={setHoveredGroupDataDataBloodMeasuresVsBMI}
                                onPointClick={[onScatterplotChartBloodMeasuresVsBMIClick]}
                                ref={chartBloodMeasuresVsBMI}
                              />
                          </div>
                      )}
                    </div>
                    
                    <div className="right-pane">

                      {/* Total Metrics - Participants */}
                      <div className="card card-participants-container stat-card">
                        <h2>Participants</h2>
                        <span className="stat">
                          {participantCount}
                        </span>
                      </div>

                      {/* Donut Chart - Gender */}
                      {donutChartDataGender !== undefined && (
                        <div className="card donut-chart-container donut-chart-gender">
                            <h2 className="App-chart-title">Gender</h2>
                            <DonutChartGender
                              width={570}
                              height={278}
                              data={donutChartDataGender}
                              onUpdateParticipantCount={setParticipantCount}
                              onFilterByGender={setHoveredGroupDataWaistCircumferenceVsBMIByGender}
                              onSliceClick={[
                                onDonutChartGenderSliceClick,
                                updateTooltipForPhysicalWorkoutVsAge
                              ]}
                            />
                        </div>
                      )}

                      {/* Stack Bar Chart - Age vs. Exercise Level */}
                      {barChartDataAgeVsExerciseLevel && (
                          <div className="card bar-chart-container bar-chart-age-vs-exercise-level">
                              <h2 className="App-chart-title">Physical Workout vs. Age</h2>
                              <StackedBarChartAgeVsExercise
                                height={328}
                                data={barChartDataAgeVsExerciseLevel}
                                onExerciseLevelClick={[
                                  onStackedBarChartAgeVsExerciseClick,
                                  filterPointsBloodMeasureVsBMI
                                ]}
                                onAgeGroupClick={[() => {}]}
                                ref={chartRefAgeVsExercise}
                              />
                          </div>
                      )}
                    </div>

                    {/* Scatterplot Chart - Waist Circumference vs. BMI */}
                    {scatterplotChartDataWaistCircumferenceVsBMI !== undefined && (
                        <div className="card scatterplot-chart-container scatterplot-chart-waist-cirumference-vs-bmi">
                            <h2 className="App-chart-title">Waist Circumference vs. BMI</h2>
                            <ScatterplotChartWaistCircumferenceVsBMI
                              height={300}
                              data={scatterplotChartDataWaistCircumferenceVsBMI}
                              hoveredGroup={hoveredGroupDataWaistCircumferenceVsBMIByGender}
                              setHoveredGroup={setHoveredGroupDataWaistCircumferenceVsBMIByGender}
                              onPointClick={[]}
                            />
                        </div>
                    )}

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
