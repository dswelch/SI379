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


  const [workTimerGoing, setWorkTimerGoing] = React.useState(false);
  const [breakTimerGoing, setBreakTimerGoing] = React.useState(false);
  let startedTime;
  let interval;
  const [workTime, setWorkTime] = React.useState(25);
  const [breakTime, setBreakTime] = React.useState(5);
  const timerRef = React.useRef();


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
    // get rid of task in tasks
    const newTasks = tasks.filter((_, taskIdx) => taskIdx !== idx)
    setTasks(newTasks);
    const newTaskRefs = taskDescRefs;
    // get rid of the reference
    newTaskRefs.splice(idx, idx);
    setTaskDescRefs(newTaskRefs);
    // store the new state
    storeState(newTasks);
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
    const newTimerVal = (value/1000).toFixed(0);
    timer.value = newTimerVal;
  }

  function startWorkTimer(idx){
    setWorkTimerGoing(true);
    startedTime = Date.now();

    interval = setInterval(() => {
      updateWorkTimer(idx);
    }, 100);
    updateWorkTimer(idx);
  }

  function startBreakTimer(idx){
    setBreakTimerGoing(true);
    startedTime = Date.now();

    interval = setInterval(() => {
      updateBreakTimer(idx);
    }, 100);
    updateBreakTimer(idx);
  }

  function updateWorkTimer(idx){
    let currentRunTime = (workTime*1000) - (Date.now() - startedTime);
    if ((currentRunTime/1000).toFixed(0) === '0'){
      stopWorkTimer();
      // addLemon(idx);
      startBreakTimer(idx);
      return;
    }
    updateDisplay(currentRunTime);
  }

  function updateBreakTimer(idx){
    let currentRunTime = (breakTime*1000) - (Date.now() - startedTime);
    if ((currentRunTime/1000).toFixed(0) === '0'){
      stopBreakTimer();
      startWorkTimer(idx);
      return;
    }
    updateDisplay(currentRunTime);
  }

  function stopWorkTimer(){
    setWorkTimerGoing(false);
    clearInterval(interval);
  }

  function stopBreakTimer(){
    setBreakTimerGoing(false);
    clearInterval(interval);
  }

  function stopAllTimers(){
    setWorkTimerGoing(false);
    setBreakTimerGoing(false);
    clearInterval(interval);
  }

  const timerGoing = workTimerGoing || breakTimerGoing;

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
          {!timerGoing && <button onClick={() => startWorkTimer(idx)}>Start Work</button>}
        </li>) }
      </ul>
      {!timerGoing && <div><label>Work Time </label>
      <input ref={workTimeRef} min="1" max="120" type="number" id="workTimeInput" onChange={changeWorkTime} value={workTime}></input>
      <label>Break Time </label>
      <input ref={breakTimeRef} min="1" max="120" type="number" id="breakTimeInput" onChange={changeBreakTime} value={breakTime}></input></div>}
      {workTimerGoing && <h2>Work Timer:</h2>}&nbsp;
      {breakTimerGoing && <h2>Break Timer:</h2>}&nbsp;
      <output ref={timerRef}></output>
      {timerGoing && <button onClick={stopAllTimers}>Cancel</button>}
    </div>
  );
}

export default App;
