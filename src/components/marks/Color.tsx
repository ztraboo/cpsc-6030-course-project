
import * as d3 from "d3";

export const colorScaleGender = d3
    .scaleOrdinal<string, string>()
    .domain(['Male', 'Female'])
    .range(["#4a58dd", "#bf3caf"]);
