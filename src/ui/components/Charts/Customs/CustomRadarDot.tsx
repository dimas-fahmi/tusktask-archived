// Define the shape of the data object
interface SubjectData {
  angle: number;
  cx: number;
  cy: number;
  payload: {
    fill: string;
  };
  radius: 0;
  value: number;
  x: number;
  y: number;
  name: string;
}

interface CustomDotProps {
  cx?: number;
  cy?: number;
  stroke?: string;
  fill?: string;
  payload?: SubjectData;
  value?: number;
  onClick?: (e: CustomDotProps) => void;
  activeFilter?: string;
}

export const CustomRadarDot = (props: CustomDotProps) => {
  const { cx, cy, payload, onClick, activeFilter } = props;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={activeFilter === payload?.name ? 6 : 4}
      fill={payload?.payload?.fill}
      stroke="#fff"
      strokeWidth={2}
      onClick={() => {
        onClick?.(props);
      }}
      style={{ cursor: "pointer" }}
    />
  );
};
