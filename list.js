<<<<<<< HEAD
=======

>>>>>>> 0e088dedcfdb50d5e19eb1c59fa0b291752d3ba6
const createBtn = document.querySelector('.createButton'); //방 생성 버튼
const roomName = document.querySelector('.createRoom'); //방 제목
const roomList = document.querySelector('.roomList'); //방 리스트

<<<<<<< HEAD


=======
>>>>>>> 0e088dedcfdb50d5e19eb1c59fa0b291752d3ba6
const TORM = "toRoom";
let toRoom = []; //Room 저장하는 변수


//방 생성 시 
createBtn.addEventListener("submit", function(e){

    if(roomName.value === ''){

        alert("방 이름을 입력하시오!");
    }
    else{

        sessionStorage.setItem('id',`host-${roomName.value}`);
        paintRoom(roomName.value);     
        roomName.value = '';
        roomName.focus();

    }

    e.preventDefault();
});

//룸 그리기 
function paintRoom(text){

    var list = document.createElement('li');
<<<<<<< HEAD
    list.innerHTML = `<a href='index.html?${text}'>${text}</a>`;
=======
    list.innerHTML = `<a href='index.html/${text}'>${text}</a>`;
>>>>>>> 0e088dedcfdb50d5e19eb1c59fa0b291752d3ba6
    roomList.appendChild(list);

    const RoomObj = {

        name : text 
    };

    toRoom.push(RoomObj);
    saveRoom();

}

//룸저장하기
function saveRoom(){ //save localstorage 

    localStorage.setItem(TORM, JSON.stringify(toRoom)); //js object를 string으로 변환 
}


//방 로딩
function loadRoom(){

    const loadedRoom = localStorage.getItem(TORM);

    if(loadedRoom !== null){

        const parseToRoom = JSON.parse(loadedRoom); //string -> object [{}, {}, {}]
        parseToRoom.forEach(function(toDo){
            paintRoom(toDo.name);
        });


    } else {


    }
}


//시작 시 방 로드 
function init(){

    loadRoom();

}

init();