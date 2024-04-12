import React from "react";
import checkmark from './checkmark.webp'

function App() {
  let startingTasks;
  try {
    startingTasks = JSON.parse(localStorage.getItem("tasks") || '[]');
  }
  catch (e){
    console.log(e);
    startingTasks = [];
  }
  let startingLemons;
  try {
    startingLemons = JSON.parse(localStorage.getItem("lemons") || '[]');
  }
  catch (e){
    console.log(e);
    startingLemons = [];
  }

  const [workTimerGoing, setWorkTimerGoing] = React.useState(false);
  const [breakTimerGoing, setBreakTimerGoing] = React.useState(false);
  let startedTime;
  const intervalRef = React.useRef();
  const [workTime, setWorkTime] = React.useState(25);
  const [breakTime, setBreakTime] = React.useState(5);
  const timerRef = React.useRef();

  const [tasks, setTasks] = React.useState(startingTasks);
  const [lemons, setLemons] = React.useState(startingLemons);
  const taskInputRef = React.useRef();
  const workTimeRef = React.useRef();
  const breakTimeRef = React.useRef();
  const startingTaskDescRefs = [];

  for (let i = 0; i < startingTasks.length; i++){
    startingTaskDescRefs.push(React.createRef());
  }
  const [taskDescRefs, setTaskDescRefs] = React.useState(startingTaskDescRefs);

  function storeTasks(newTasks){
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  }

  function storeLemons(newLemons){
    localStorage.setItem("lemons", JSON.stringify(newLemons));
  }

  function addTask (){
    const taskInput = taskInputRef.current;
    if (taskInput.value !== ""){
      const newTasks = tasks.concat(taskInput.value);
      const newLemons = lemons.concat([[]]);
      setTasks(newTasks);
      setLemons(newLemons);
      taskInput.value = "";
      const newTaskRefs = taskDescRefs;
      newTaskRefs.push(React.createRef());
      setTaskDescRefs(newTaskRefs);
      storeTasks(newTasks);
      storeLemons(newLemons);
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
    storeTasks(newTasks);
  }

  function handleFinish(idx){
    // get rid of task in tasks
    const newTasks = tasks.filter((_, taskIdx) => taskIdx !== idx);
    const newLemons = lemons.filter((_, lemonIdx) => lemonIdx !== idx);
    setTasks(newTasks);
    setLemons(newLemons);
    const newTaskRefs = taskDescRefs;
    // get rid of the reference
    newTaskRefs.splice(idx, idx);
    setTaskDescRefs(newTaskRefs);
    // store the new state
    storeTasks(newTasks);
    storeLemons(newLemons);
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
    const minutes = Math.floor(value / 60000);
    const seconds = ((value % 60000) / 1000).toFixed(0);
    timer.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  function startWorkTimer(idx){
    setWorkTimerGoing(true);
    startedTime = Date.now();
    intervalRef.current = setInterval(() => {
      updateWorkTimer(idx);
    }, 100);
    updateWorkTimer(idx);
  }

  function startBreakTimer(idx){
    setBreakTimerGoing(true);
    startedTime = Date.now();

    intervalRef.current = setInterval(() => {
      updateBreakTimer(idx);
    }, 100);
    updateBreakTimer(idx);
  }

  function updateWorkTimer(idx){
    let currentRunTime = (workTime*60000) - (Date.now() - startedTime);
    // if done
    if (currentRunTime <= 0){
      // stop the timer
      stopWorkTimer();
      // add a lemon
      const newLemons = lemons;
      newLemons[idx].push("lemon");
      setLemons(newLemons);
      storeLemons(newLemons);
      // start the break
      startBreakTimer(idx);
      return;
    }
    updateDisplay(currentRunTime);
  }

  function updateBreakTimer(idx){
    let currentRunTime = (breakTime*60000) - (Date.now() - startedTime);
    if (currentRunTime <= 0){
      stopBreakTimer();
      startWorkTimer(idx);
      return;
    }
    updateDisplay(currentRunTime);
  }

  function stopWorkTimer(){
    setWorkTimerGoing(false);
    clearInterval(intervalRef.current);
  }

  function stopBreakTimer(){
    setBreakTimerGoing(false);
    clearInterval(intervalRef.current);
  }

  function stopAllTimers(){
    setWorkTimerGoing(false);
    setBreakTimerGoing(false);
    clearInterval(intervalRef.current);
    timerRef.current.innerText = '';
  }

  const timerGoing = workTimerGoing || breakTimerGoing;
  const tasksExist = tasks.length;

  return (
    <div className="App">
      <h1>  What do you want to do? </h1>
      <input ref={taskInputRef} placeholder="Task description here" type="text" onKeyDown={handleKeyDown} id="taskDescription"></input>
      <button id="addTaskButton" onClick={addTask}>Add Task</button>
      <ul> { tasks.map((task, idx) => <li key={idx}>
          {task}
          {!timerGoing && <button onClick={() => handleFinish(idx)}>Finish</button>}
          <input ref={taskDescRefs[idx]} placeholder="New task description here" type="text"></input>
          <button onClick={() => handleEdit(idx)}>Edit Task</button> 
          {!timerGoing && <button onClick={() => startWorkTimer(idx)}>Start Work</button>}
          { tasksExist && lemons[idx].map((_, lemonIdx) => <img key={lemonIdx} src={checkmark} width="20px" height="20px" />)}
        </li>) }
      </ul>
      {!timerGoing && <div><label>Work Time </label>
      <input ref={workTimeRef} min="1" max="120" type="number" id="workTimeInput" onChange={changeWorkTime} value={workTime}></input>
      <label>Break Time </label>
      <input ref={breakTimeRef} min="1" max="120" type="number" id="breakTimeInput" onChange={changeBreakTime} value={breakTime}></input></div>}
      {workTimerGoing && <h2>Work Timer:</h2>}
      {breakTimerGoing && <h2>Break Timer:</h2>}
      <div ref={timerRef}></div>
      {timerGoing && <button onClick={stopAllTimers}>Cancel</button>}
    </div>
  );
}

export default App;
