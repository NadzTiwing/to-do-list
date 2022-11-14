import React, { useState, useRef  } from 'react';
import list from './../data/tasks.json';

/**
 * generate unique id for the added tasks
 * @returns { string } id
 */
function generateId() {
    return (Math.random() + 1).toString(36).substring(8); 
}

export default function Card() {
    /** 
     * useState was used to update the value of the variables efficiently
     * useRef was used to get the current item being dragged
    */
    const [items, setItems] = useState(list.tasks); //where I store the data
    const [isEditing, setEditing] = useState(false); //determine if the user is editing an item
    const [editItem, setEditItem] = useState(""); //indicates what item was being edited
    const [totalFinished, setTotalFinished] = useState(0); //count the total number of tasks done
    const [totalTasks, setTotalTasks] = useState(items.length); //count the total number of the tasks

    //variables that will be used to get the item being dragged and dropped
    const dragItem = useRef(); 
    const dragOverItem = useRef();

    /**
     * add a new item and will be inserted in the first index the array
     * increase the total number of tasks
     * call the editTask()
    */
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

    //indicate the user is editing an item and what item is being edited
    const editTask = (id) => {
        setEditing(!isEditing);
        setEditItem(id);
    }

    /**
     * @param { string } value 
     * If the user enter nothing the user will be prompted
     * else once the user saved the item
     * reset the value of editItem and isEditing to indicate that the user is done editing
    */
    const saveTask = (value) => {
        if(!value) {
            alert("Please enter something.");
            return;
        }
        setEditing(!isEditing);
        setEditItem("");
    }

    /**
     * @param { string } id 
     * @param { string } value 
     * update the name of the items being edited
     */
    const handleChange = (id, value) => {
        setItems(items.map(item => {
            if(item.id === id) item.name = value;
            return item;
        }));
    } 


    /**
     * @param { string } id
     * asked the user if s/he's sure in removing the item
     * if confirmed, remove selected item from the list
     * count the total number of tasks and tasks done
     */
    const deleteTask = (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) { 
            let tasks = items.filter(item => item.id !== id);
            setItems(tasks);
            
            let ctr = 0;
            tasks.map(item => {
                if(item.done) ctr++;
            });
            setTotalFinished(ctr);
            setTotalTasks(tasks.length);
        }        
    }

    /**
     * @param { string } id 
     * when user clicks the check box, it will update the status of the item
     * increase the total tasks finished if checked
     */
    const onCheck = (id) => {
        let ctr = 0;
        setItems(items.map(item => {
            if(item.id === id) item.done= !item.done;
            if(item.done) ctr++;
            return item;
        }));
        setTotalFinished(ctr);
    }

    /**
     * @param { number } position 
     * get the current index position of that item being dragged
     */
    const dragStart = (position) => {
        dragItem.current = position;
    };

    /**
     * @param { number } position 
     * get the index position of the replaced item after dropping the dragged item
     */
    const dragEnter = (position) => {
        dragOverItem.current = position;
    };

    /**
     * update the index positions of the rearranged items
     * reset the value of the dragItem and dragOverItem
     */
    const drop = () => {
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
                <p className="progress-txt">{totalFinished == items.length ? "Awesome, you complete all of your tasks!" : `You finished ${totalFinished} out of ${totalTasks} tasks`}</p>
                <button className="add-btn btn" onClick={()=>addItem()}> ADD TASK ( + ) </button>
            </div>
            <div className="items">
                {items.map( (item, index) => (
                    <div className="card task" 
                    key={item.id} 
                    onDragStart={() => dragStart(index)}
                    onDragEnter={() => dragEnter(index)}
                    onDragEnd={()=> drop()}
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