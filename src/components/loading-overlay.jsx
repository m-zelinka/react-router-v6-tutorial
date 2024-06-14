import PropTypes from "prop-types";
import { useNavigation } from "react-router-dom";
import { useSpinDelay } from "spin-delay";

export default function LoadingOverlay({ children }) {
  const navigation = useNavigation();
  const searching = new URLSearchParams(navigation.location?.search).has("q");
  const loading = navigation.state === "loading";
  const showOverlay = useSpinDelay(loading && !searching);

  if (showOverlay) {
    return <div className="loading">{children}</div>;
  }

  return children;
}
LoadingOverlay.propTypes = {
  children: PropTypes.node,
};
