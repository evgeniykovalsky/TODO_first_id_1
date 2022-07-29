'use strict';

class TodoList {
    constructor() {
        this.globalWrapper = document.querySelector('.tasks');
        this.tasksProgress = this.globalWrapper.querySelector('.tasks__progress');
        this.tasksCompleted = this.globalWrapper.querySelector('.tasks__completed');
        this.tasksItem = this.globalWrapper.querySelector('.tasks__item');
        this.allTasksList=[];
        
    }

    createOneWrap() {
       this.tasksProgress.append(this.tasksItem.cloneNode(true));
    }
    getLocalStorage(){
            
        fetch('https://jsonplaceholder.typicode.com/todos')
         .then(response => response.json())
         .then(json =>{
            for(let key in json){

                if(json[key].userId==1){
                this.allTasksList.push(json[key]);
                  }
            }
           
           this.createAllWrap(this.allTasksList);
         })
       

    }
    
    createAllWrap() {

        if(this.allTasksList.length>0){

        for (let key=0;key<this.allTasksList.length;key++){
            let taskItem = this.allTasksList[key].title;
            let status = this.allTasksList[key].completed;
            if (status == false) {
                this.createWrapInProgress(taskItem);
            }  else {
                this.createWrapInCompleted(taskItem);
            }          
        }}
        else{
            this.createOneWrap();
        }
    
    }

    createWrapInProgress(item){
        let wrap = this.tasksItem.cloneNode(true);
            wrap.querySelector('input').value = item;
        this.tasksProgress.append(wrap);
    }

    createWrapInCompleted(item) {
        let wrap = this.tasksItem.cloneNode(true);
            wrap.querySelector('input').value = item;
            wrap.querySelector('.fa-circle-hide').classList.remove('fa-circle-hide');
            wrap.querySelector('.fa-circle-plus').classList.add('fa-circle-minus');
            wrap.querySelector('.fa-circle-plus').classList.remove('fa-circle-plus');
            wrap.querySelector('input').disabled = 'disabled';
        this.tasksCompleted.append(wrap);
    }

   

    setLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.allTasksList));
    }
   
    clearAllWrap() {
        this.tasksProgress.innerHTML ='';
        this.tasksCompleted.innerHTML ='';
    }

    eventClick(e){
        let target = e.target;
        let parent = target.closest('.tasks__item');
        if (target.classList.contains('fa-circle-hide')){
            this.completedTask(parent);
        }
        if(target.classList.contains('fa-circle-plus')){
            this.addNewTask();
        }
        if(target.classList.contains('fa-circle-minus')){
            this.removeTask(parent);
        }
        this.isEmptyProgress();
        this.updateAllTaskList();
        this.setLocalStorage();
    }

    eventInput(e) {
        let target = e.target;
        if(target.localName == 'input') {
            this.updateAllTaskList();
            this.setLocalStorage();
        }
    }
    
    completedTask(elem){
        if(elem.querySelector('input').value !==''){
            elem.querySelector('.fa-circle-hide').classList.remove('fa-circle-hide');
            elem.querySelector('.fa-circle-plus').classList.add('fa-circle-minus');
            elem.querySelector('.fa-circle-plus').classList.remove('fa-circle-plus');
            elem.querySelector('input').disabled = 'disabled';
            this.tasksCompleted.append(elem);
        }
    }
    
    removeTask(elem) {
        elem.remove();
    }
    
    addNewTask(){
        this.createOneWrap();
    }

    updateAllTaskList(){
        this.allTasksList = {};
        let allInput = this.globalWrapper.querySelectorAll('input');
        allInput.forEach(this.callbackAllTasks.bind(this));
    }

    callbackAllTasks(elem,index) {
        this.allTasksList[index] = {};
        this.allTasksList[index].taskItem = elem.value;
        let status = true;
        if (elem.closest('.tasks__progress')){
            status = false;
        }
        this.allTasksList[index].status = status;
    }
    
    isEmptyProgress() {
        let elem = this.tasksProgress.querySelectorAll('.tasks__item').length;
        if(elem == 0){
            this.createOneWrap();            
        }
    }

    init() {
        this.clearAllWrap();
        this.getLocalStorage();
        this.globalWrapper.addEventListener('click', this.eventClick.bind(this));
        this.globalWrapper.addEventListener('input', this.eventInput.bind(this));        
    }
}
