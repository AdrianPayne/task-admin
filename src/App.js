import React, { useState } from 'react';


const user = "Adrian";


function Header(){
  
  return (
    <header>
      <div id="home">
        <img id="imgIcon" src="https://senniors.com/wp-content/uploads/sites/2/2020/07/logo-senniors.svg" alt="Senniors icon"/>
        <h1>Sennior Team</h1>
      </div>
      <div id="profile">
        <img id="profileImg" src="https://media-exp1.licdn.com/dms/image/C4D03AQGnXQ7abV2wzQ/profile-displayphoto-shrink_800_800/0/1609286932254?e=1658361600&v=beta&t=z5Tkw1X9NoraO4w9WnxVqfCqLlEubiAvisGnGb1P1ug" alt="Adrian"/>
        <p>Adrian</p>
      </div>
    </header>
  );
}

// JSON Callback
let dataTasksJson;

var myCallback = function(datos){
  var jsonData = require('./dataExample.json');
  dataTasksJson = jsonData;
};

var rateToStr = function(rate_number){
  // Rate: from number to str
  var rate;
  switch(rate_number) {
   case 1:
     rate = "Basica";
     break;
   case 2:
     rate = "Importante";
     break;
   case 3:
     rate = "Critica";
     break;
   default:
     rate = "-";
 }
 return rate;
}

function Table(){
  const [updateTable, setUpdateTable] = useState(0)
  const [dataTasks, setDataTasks] = useState(dataTasksJson);
  const [filterMenu, setFilterMenu] = useState(false);
  const [filter, setFilter] = useState("");
  const [taskDetailShow, setTaskDetailShow] = useState(false);
  const [taskDetail, setTaskDetail] = useState(0);
  const [finish, setFinish] = useState(false);
  const [cancelDetail, setCancelDetail] = useState(false);
  const [cancel, setCancel] = useState(false);

  const setPendingStatus = (task) => {
    task.RazondeIncidencia = "";
    task.RealizadoPor = "";
    task.Status = "Pendiente";
    setTaskDetailShow(false);
    setUpdateTable(task._Id);
  };

  const setDate = function(e, taskId){
    let task = dataTasks.find(x => x._Id == taskId);
    task.FechaRealizacion = e.currentTarget.textContent;
  }

  const setColor = function(task){
    if (task.Status == "Completada"){
      return "#75AB78";
    };
    if (task.Status == "Cancelada"){
      return "#7C7C7C";
    };
  }

  const dataTaskHtml = dataTasks.map(task => (filter === "" || task.Status === filter) ?
    <tr style={{color: setColor(task)}}>
      <td>{task._Id}</td>
      <td id="nameTask" onClick={() => {setTaskDetailShow(true); setTaskDetail(task)}}>{task.Name}</td>
      <td><p class={"rareTag " + rateToStr(task.Rate) + " " + task.Status}>{rateToStr(task.Rate)}</p></td>
      <td>{task.Destinatario}</td>
      <td onInput={(e) => setDate(e, task._Id)} contentEditable>{task.FechaRealizacion}</td>
      <td>{task.Status}</td>
    </tr>
  :<></>);
  return (
    <div id="taskTable">
      <TableOptions filterMenu={filterMenu} setFilterMenu={setFilterMenu} filter={filter} setFilter={setFilter}/>
      <table>
        <tr>
          <th>#</th>
          <th>Nombre de la tarea</th>
          <th>Prioridad</th>
          <th>Destinatario</th>
          <th>Realización</th>
          <th>Estado</th>
        </tr>
        {dataTaskHtml}
      </table>
      <TaskDetail taskDetailShow={taskDetailShow} setTaskDetailShow={setTaskDetailShow} setFinish={setFinish}
       setCancelDetail={setCancelDetail} setCancel={setCancel} task={taskDetail} setPendingStatus={setPendingStatus}/>
      <Finish finish={finish} setFinish={setFinish} task={taskDetail}/>
      <CancelDetail cancelDetail={cancelDetail} cancel={cancel} setCancelDetail={setCancelDetail} setCancel={setCancel} task={taskDetail}/>
      <AddTask/>
    </div>
  );
}

function TableOptions(props){
  const filterMenuShow = function (filterMenu) {
    if (filterMenu === true){
      return (false);
    };
    return (true);
  }
  return (
    <div id="tableOptions">
      <ResetFilter filter= {props.filter} setFilter={props.setFilter}/>
      <Filter filterMenu={props.filterMenu} setFilterMenu={props.setFilterMenu} setFilter={props.setFilter}/>
      <button id="filter" onClick={() => {props.setFilterMenu(filterMenuShow(props.filterMenu))}}><i class="fa fa-bars"></i>Filtrar</button>
      <button id="sort">Ordenar por fecha</button>
    </div>
  );
}

function Filter(props){
  if (!props.filterMenu) {
    return <></>
  }
  return (
    <div>
      <button class="filterOption" onClick={() => {props.setFilter("Completada"); props.setFilterMenu(false)}}>Completadas</button>
      <button class="filterOption" onClick={() => {props.setFilter("Cancelada"); props.setFilterMenu(false)}}>Canceladas</button>
    </div>
  );
}

function ResetFilter(props){
  if (props.filter === "") {
    return (<></>);
  }
  return (
    <button id="buttonResetFilter" onClick={() => {props.setFilter("")}}>{props.filter}</button>
  );
}

function AddTask(){
  return (
    <div class="add_task">
      <button id="newElement">+ Añadir tarea</button>
    </div> 
  );
}

function TaskDetailOptions(props){
  if (props.task.Status != "Pendiente"){
    return (
      <div id="taskDetailButtons">
        <button id="buttonUndo" onClick={() => props.setPendingStatus(props.task)}>Deshacer</button>
      </div>
    );
  }else{
    return (
      <div id="taskDetailButtons">
        <button id="buttonFinish" onClick={() => props.setFinish(true)}>Completar</button>
        <button id="buttonCancel" onClick={() => props.setCancelDetail(true)}>Cancelar</button>
      </div>
    );
  };
}

function TaskDetail(props){
  let task = props.task;
  if (task._Id === 0 || !props.taskDetailShow) {
    return (<div></div>);
  }
  let infoTaskFinished = "";
  if (task.RazondeIncidencia != "") {
    infoTaskFinished = 
    <>
      <p>Razon de la incidencia: </p>
      <p>{task.RazondeIncidencia}</p>
    </>
  }
  if (task.RealizadoPor != "") {
    infoTaskFinished = 
    <>
      <p>Resuelto por: </p>
      <p>{task.RealizadoPor}</p>
    </>
  }
  


  return (
  <div>
    <div id="taskDetailBackground" onClick={() => props.setTaskDetailShow(false)}></div>
    <div id="taskDetail">
      <div >
        <h2>{task._Id} {task.Name}</h2>
        <div id="taskDetailTexto">
          <div>{task.FechaRealizacion}</div>
          
          <div class={"rareTag " + rateToStr(task.Rate)}>{rateToStr(task.Rate)}</div>
          <div>{task.Destinatario}</div>
        </div>
        <div id="taskDetailImg">
          <img id="imgTask" src={task.ImgUrl}/>
        </div>
        <div class={task.Status}>{task.Status}</div>
        <div>{infoTaskFinished}</div>
      </div>
      <TaskDetailOptions task={task} setFinish={props.setFinish} setCancelDetail={props.setCancelDetail} setPendingStatus={props.setPendingStatus}/>
    </div>
  </div>
  );
}

function CancelDetail(props){
  if (!props.cancelDetail){
    return <div></div>
  }

  const cancelHandler = function(e){
    console.log(props.cancelDetail);
    props.task.Status = "Cancelada";
    props.task.RazondeIncidencia = e.currentTarget.elements.razondeIncidencia.value;
    props.setCancelDetail(false);
  }
  return (
    <div>
      <div id="cancelDetailBackground" onClick={() => props.setCancelDetail(false)}></div>
      <div id="cancelDetail">
        <h3>Cancelar task</h3>
        <p>¿Cual es el motivo de la incidencia?</p>
        <form onSubmit={cancelHandler}>
          <input type="text" name="razondeIncidencia"/>
          <input type="submit" id="buttonCancel"/>
        </form>
      </div>
    </div>
  );
}

function Finish(props){
  if (!props.finish){
    return <div></div>
  }
  props.task.Status = "Completada";
  props.task.RealizadoPor = user;
  props.setFinish(false);
  return (
    <p>Tarea finalizada</p>
  );
}


function App() {
  myCallback();
  return (
    <div>
      <Header/> 
      <Table/> 
    </div>
  );
}

export default App;
