import React from "react";

function App() {
  let startingTasks;
  try {
    startingTasks = JSON.parse(localStorage.getItem("tasks") || '[]');
  }
  catch (e){
    console.log(e);
    startingTasks = [];
  }

  // timer variables
  let timerGoing = false;
  let startedTime;
  const [workTime, setWorkTime] = React.useState(25);
  const [breakTime, setBreakTime] = React.useState(5);
  const timerRef = React.useRef();

  // task variables
  const [tasks, setTasks] = React.useState(startingTasks);
  const taskInputRef = React.useRef();
  const workTimeRef = React.useRef();
  const breakTimeRef = React.useRef();
  const startingTaskDescRefs = [];
  for (let i = 0; i < startingTasks.length; i++){
    startingTaskDescRefs.push(React.createRef());
  }
  const [taskDescRefs, setTaskDescRefs] = React.useState(startingTaskDescRefs);


  function storeState(newTasks){
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  }

  function addTask (){
    const taskInput = taskInputRef.current;
    if (taskInput.value !== ""){
      const newTasks = tasks.concat(taskInput.value);
      setTasks(newTasks);
      taskInput.value = "";
      const newTaskRefs = taskDescRefs;
      newTaskRefs.push(React.createRef());
      setTaskDescRefs(newTaskRefs);
      storeState(newTasks);
    }
  }

  function changeWorkTime(){
    const workTimeInput = workTimeRef.current;
    setWorkTime(workTimeInput.value);
  }

  function changeBreakTime(){
    const breakTimeInput = breakTimeRef.current;
    setBreakTime(breakTimeInput.value);
  }
  
  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      addTask();
    }
  }

  function editTaskName(idx, newTaskName){
    const newTasks = [...tasks];
    newTasks[idx] = newTaskName;
    setTasks(newTasks);
    storeState(newTasks);
  }

  function handleFinish(idx){
    setTasks(tasks.filter((_, taskIdx) => taskIdx !== idx));
  }

  function handleEdit(idx){
    const input = taskDescRefs[idx].current;
    if (input.value !== ""){
      editTaskName(idx, input.value);
      input.value = "";
    }
  }

  function updateDisplay(value) {
    const timer = timerRef.current;
    console.log(timer);
    timer.value = (value/1000).toFixed(0);
  }

  function startWorkTimer(idx){
    console.log(timerGoing);
    timerGoing = true;
    console.log(timerGoing);
    startedTime = Date.now();
    setInterval(updateTimer, 100);
  }

  function updateTimer(){
    let currentRunTime = (workTime*1000) - (Date.now() - startedTime);
    console.log(workTime);
    console.log(Date.now());
    console.log(startedTime);
    updateDisplay(currentRunTime);
  }

  return (
    <div className="App">
      <h1>  What do you want to do? </h1>
      <input ref={taskInputRef} placeholder="Task description here" type="text" onKeyDown={handleKeyDown} id="taskDescription"></input>
      <button id="addTaskButton" onClick={addTask}>Add Task</button>
      <ul> { tasks.map((task, idx) => <li key={idx}>
          {task}
          <button onClick={() => handleFinish(idx)}>Finish</button>
          <input ref={taskDescRefs[idx]} placeholder="New task description here" type="text"></input>
          <button onClick={() => handleEdit(idx)}>Edit Task</button> 
        </li>) }
      </ul>
      <label>Work Time</label>
      <input ref={workTimeRef} min="1" max="120" type="number" id="workTimeInput" onChange={changeWorkTime} value={workTime}></input>
      <label>Break Time</label>
      <input ref={breakTimeRef} min="1" max="120" type="number" id="breakTimeInput" onChange={changeBreakTime} value={breakTime}></input>
      <button onClick={startWorkTimer}>Start Timer</button>
      <output ref={timerRef}></output>
    </div>
  );
}

export default App;
