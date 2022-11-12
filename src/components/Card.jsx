import React, { useState, useId } from 'react';
import { SortableList } from '@thaddeusjiang/react-sortable-list';
import list from './../data/tasks.json';

export default function Card() {
    const id = useId(); //will be used to generate unique id of each tasks
    const [items, setItems] = useState(list.tasks);


    const deleteTask = (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) { 
            let tasks = items.filter(item => item.id !== id);
            setItems(tasks);
        }        
    }

    return(
        <div className="card mx-auto">
          <div className="card-header">
            <div className="card-title text-center">MY TO DO LIST</div>
          </div>
          <div className="card-body">
            <button className="add-btn btn"> ADD TASK ( + ) </button>
            <SortableList
            items={items}
            setItems={setItems}
            itemRender={({ item }) => (
                <div className="card task">
                    <div className="input-item my-2">
                        <input className="form-check-input mt-1" type="checkbox" value="" aria-label="Checkbox for following text input"/>
                        <span className="px-2">{item.name}</span>
                        
                    </div>
                     {/*<input type="text" className="form-control w-75" />*/}
                    <div className="icons">
                        <button className="btn btn-link"><i className="pencil-icon bi bi-pencil-fill"></i></button>
                        <button className="btn btn-link" 
                        onClick={()=>{deleteTask(item.id)}}
                        ><i className="trash-icon bi bi-trash3-fill"></i></button>
                    </div>
                </div>
            )}/> 
            
            
          </div>
        </div>
    );
}