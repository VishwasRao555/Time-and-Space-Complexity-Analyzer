import SignalsPanel from "./SignalsPanel";
import GrowthChart from "./GrowthChart";
import RationalePanel from "./RationalePanel";
import LimeCard from "./LimeCard";
import "./RightStack.css";

export default function RightStack({ result }) {
  return (
    <div className="right-stack scroll-thin">
      <SignalsPanel result={result} />
      <GrowthChart result={result} />
      <RationalePanel result={result} />
      <LimeCard />
    </div>
  );
}
