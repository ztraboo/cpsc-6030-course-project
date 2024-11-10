import * as d3 from "d3";
import styles from "./tooltip.module.css"

// Information needed to build the tooltip
export type InteractionData = {
  xPos: number;
  yPos: number;
  markColorScale: d3.ScaleOrdinal<any, any>;
  markColorFieldLegendName: string;
  markColorField: string;
  xAxisLabel: string;
  yAxisLabel: string;
  xAxisValue: number;
  yAxisValue: number;
};

type TooltipProps = {
  interactionData: InteractionData | null;
};

export const Tooltip = ({ interactionData }: TooltipProps) => {
  if (!interactionData) {
    return null;
  }

  const { xPos, yPos, markColorScale, markColorFieldLegendName, markColorField, xAxisLabel, xAxisValue, yAxisLabel, yAxisValue } = interactionData;

  let topHalfStyle: React.CSSProperties = (typeof markColorScale(markColorField) === undefined) ? { borderColor: "#cccccc" } : { borderColor: markColorScale(markColorField) };

  return (
    <div
      className={styles.tooltip}
      style={{
        left: interactionData.xPos,
        top: interactionData.yPos,
      }}
    >

      <b className={styles.title}>Stats</b>

      <div className={styles.topHalfContainer} style={topHalfStyle}>
      <div className={styles.row}>
          <span>{markColorFieldLegendName}</span>
          <b>{markColorField}</b>
        </div>
        <div className={styles.row}>
          <span>{xAxisLabel}</span>
          <b>{xAxisValue}</b>
        </div>
        <div className={styles.row}>
          <span>{yAxisLabel}</span>
          <b>{yAxisValue}</b>
        </div>
      </div>

    </div>
  );
};
