import React, { useState, useRef  } from 'react';
import list from './../data/tasks.json';

/**
 * will be used to generate unique id for the added tasks
 * @returns id
 */
function generateId() {
    return (Math.random() + 1).toString(36).substring(8); 
}

export default function Card() {
    const [items, setItems] = useState(list.tasks);
    const [isEditing, setEditing] = useState(false);
    const [editItem, setEditItem] = useState("");
    const [totalFinished, setTotalFinished] = useState(0);
    const [totalTasks, setTotalTasks] = useState(items.length);
    const dragItem = useRef();
    const dragOverItem = useRef();

    const addItem = () => {
        let id = generateId();
        let newItem = {
            id: id,
            name: "",
            done: false
        };
        items.unshift(newItem);
        setItems(items => [...items]);
        setTotalTasks(items.length);

        editTask(id);
    }

    const editTask = (id) => {
        setEditing(!isEditing);
        setEditItem(id);
    }

    const saveTask = (value) => {
        if(!value) {
            alert("Please enter something.");
            return;
        }
        setEditing(!isEditing);
        setEditItem("");
    }

    const handleChange = (id, value) => {
        setItems(items.map(item => {
            if(item.id === id) item.name = value;
            return item;
        }));
    } 

    const deleteTask = (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) { 
            let tasks = items.filter(item => item.id !== id);
            setItems(tasks);
            setTotalTasks(tasks.length);
        }        
    }

    const onCheck = (id) => {
        let ctr = 0;
        setItems(items.map(item => {
            if(item.id === id) item.done= !item.done;
            if(item.done) ctr++;
            return item;
        }));

        setTotalFinished(ctr);
    }

    const dragStart = (e, position) => {
        dragItem.current = position;
        console.log(e.target.innerHTML);
    };

    const dragEnter = (e, position) => {
        dragOverItem.current = position;
        console.log(e.target.innerHTML);
    };

    const drop = (e) => {
        const copyListItems = [...items];
        const dragItemContent = copyListItems[dragItem.current];
        copyListItems.splice(dragItem.current, 1);
        copyListItems.splice(dragOverItem.current, 0, dragItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setItems(copyListItems);
    };

    return(
        <div className="card mx-auto">
          <div className="card-header">
            <div className="card-title text-center">MY TO DO LIST</div>
          </div>
          <div className="card-body">
            <div className="others">
                <p className="progress-txt">{totalFinished==items.length ? "Awesome, you complete all of your tasks!" : `You finished ${totalFinished} out of ${totalTasks} tasks`}</p>
                <button className="add-btn btn" onClick={()=>addItem()}> ADD TASK ( + ) </button>
            </div>
            <div className="items">
                {items.map( (item, index) => (
                    <div className="card task" 
                    key={item.id} 
                    onDragStart={(evt) => dragStart(evt, index)}
                    onDragEnter={(e) => dragEnter(e, index)}
                    onDragEnd={drop}
                    draggable>
                        {editItem!==item.id &&
                        <div className="input-item my-2">
                            <input className="form-check-input mt-1" type="checkbox" 
                            value={item.done} 
                            aria-label="Checkbox for following text input" 
                            disabled={isEditing} 
                            checked={item.done} 
                            onChange={()=>onCheck(item.id)}/>
                            <span className="px-2">{item.done ? <strike className="strike">{item.name}</strike>: item.name }</span>
                        </div>
                        }
                        
                        <input type="text" className={editItem===item.id ? `form-control w-75` : `hide`} value={item.name} onChange={(evt)=>handleChange(item.id, evt.target.value)}/>
                        <div className="icons">
                            <button className={editItem===item.id ? `btn btn-sm save-btn` : `hide`} onClick={()=>saveTask(item.name)}>SAVE</button>
                            <button className={isEditing ? `hide` : `btn btn-link`} onClick={()=>editTask(item.id)}><i className="pen-icon bi bi-pencil-fill"></i></button>
                            <button className={isEditing ? `hide` : `btn btn-link`} onClick={()=>deleteTask(item.id)}><i className="trash-icon bi bi-x-lg"></i></button>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>
    );
}