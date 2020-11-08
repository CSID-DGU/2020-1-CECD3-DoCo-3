const createBtn = document.querySelector('.createButton'); //방 생성 버튼
const roomName = document.querySelector('.createRoom'); //방 제목
const roomList = document.querySelector('.roomList'); //방 리스트


const TORM = "toRoom";
let toRoom = []; //Room 저장하는 변수


//방 생성 시 
createBtn.addEventListener("submit", function(e){

    if(roomName.value === ''){

        alert("방 이름을 입력하시오!");
    }
    else{

        paintRoom();     
      //  roomName.value = ''; 
       // roomName.focus();

    }

    e.preventDefault();
});

//룸 그리기 
function paintRoom(){


    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() { // 요청에 대한 콜백
    if (xhr.readyState === xhr.DONE) { // 요청이 완료되면
    if (xhr.status === 200 || xhr.status === 201) {
      console.log(xhr.responseText);
    } else {
      console.error(xhr.responseText);
    }
  }
    };
    xhr.open('GET', 'https://docoex.page/createRoom'); // 메소드와 주소 설정
    xhr.send(); // 요청 전송 

   
}



//시작 시 방 로드 
function init(){

    

}

init();