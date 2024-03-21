import React from "react";

export default function App() {
  return <div>
    <ClickTrackingButton />
  </div>;
}

function ClickTrackingButton(){
  const [clicks, clickFunc] = React.useState(0);
  function clicked(){
    clickFunc(clicks + 1);
  }
  return <button onClick={clicked}>{clicks}</button>
}
