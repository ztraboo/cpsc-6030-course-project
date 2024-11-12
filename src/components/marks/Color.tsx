
import * as d3 from "d3";

export const colorScaleGender = d3
    .scaleOrdinal<string, string>()
    .domain(['Male', 'Female'])
    .range(["#4a58dd", "#bf3caf"]);

export const colorScaleDiabetesDiagnosisStatus = d3
    .scaleOrdinal<string, string>()
    .domain(['Yes', 'No', 'Borderline'])
    .range(["#e31a1c", "#a6cee3", "#1f78b4"]);
