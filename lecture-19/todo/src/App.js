import React from "react";

function App() {
  const inputRef = React.useRef();
  const [listItems, editList] = React.useState(["Buy milk", "Buy eggs"]);
  const onAdd = React.useCallback(() => {
    const inputElem = inputRef.current;
    editList(listItems.push(inputElem.value));
    inputElem.value = "";
    console.log(listItems);
  }, [listItems]);
  return (
    <div>
      <ul>{listItems.map(item => <li key={item}>{item}</li>)}</ul>
      <input type="text" ref={inputRef}/><button onClick={onAdd}>Add</button>
    </div>
  );
}

export default App;
