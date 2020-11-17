const createBtn = document.querySelector('.createButton'); //방 생성 버튼
const roomName = document.querySelector('.createRoom'); //방 제목
const roomList = document.querySelector('.roomList'); //방 리스트


let Rnum = 1;
//방 생성 시 
createBtn.addEventListener("submit", function(e){
    paintRoom(); 
});

//룸 그리기 
function paintRoom(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() { // 요청에 대한 콜백
    if (xhr.readyState === xhr.DONE) { // 요청이 완료되면
    if (xhr.status === 200 || xhr.status === 201) {
      const Room = JSON.parse(xhr.responseText);
      location.href = `https://docoex.page/host?roomId=${Room.roomId}`;
    } else {
      console.error(xhr.responseText);
    }
  }
    };
    let stream;
    try {
      stream = navigator.mediaDevices.getUserMedia({ video: true });
    } catch (err) {
      console.error('getUserMedia() failed:', err.message);
      throw err;
    }
    document.querySelector('#local_video').srcObject = stream;
    xhr.open('GET', 'https://docoex.page/createRoom'); // 메소드와 주소 설정
    xhr.send(); // 요청 전송 

}



function loadRoom(){

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() { // 요청에 대한 콜백
  if (xhr.readyState === xhr.DONE) { // 요청이 완료되면
  if (xhr.status === 200 || xhr.status === 201) {
    const RoomList = JSON.parse(xhr.responseText);
    for(let i = 0 ; i < RoomList.length ; i++){

        var li = document.createElement('li');
        li.className = "rlist";
        li.innerHTML = `<a href='https://docoex.page/room?roomId=${RoomList[i]}'>== ${i+1}번 방 ==</a> `;
        roomList.appendChild(li);
      
    }

  } else {
    console.error(xhr.responseText);
  }
}
  };
  xhr.open('GET', 'https://docoex.page/roomList'); // 메소드와 주소 설정
  xhr.send(); // 요청 전송 

}

//시작 시 방 로드 
function init(){
  loadRoom();
}

init();