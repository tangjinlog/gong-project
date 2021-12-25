$(document).ready(()=> {
  // listing();
})

  //데이터 정의
  let circleNumber = 0;
  const circleTypes = {
    small: ['black', 5, 2.5, 3000],
    medium: ['dodgerblue', 15, 7.5, 4000],
    large: ['yellowgreen', 30, 15, 5000]
  }

  let gameOn = false;
  let t = 0;
  let mouseX;
  let mouseY;

  $('body').mousemove(()=> {
    mouseX = event.pageX;
    mouseY = event.pageY;
  })

  function timer() {
    // gameOn = true;
    if(gameOn == true) {
      setTimeout(()=> {
        t += 0.01;
        $('.timer').html(`<div class="center"><h1>${t.toFixed(2)}</h1></div>`);
        timer();
      }, 10)
    }
  }
  // timer();

  //startbutton
  $('.startbutton').click(()=> {
    $('.startbutton').fadeOut(500, ()=> {
      gameOn = true;
      $('.space').mouseenter(()=> {
        endgame();
        console.log('screen벗어남');
      })
      timer();
      createCircle();
    })
  })

  //공 생성
  function createCircle() {
    circleNumber++;
    let randomOneTwoThree = Math.floor(Math.random() * 3) + 1;
    let circleChoice;

    if(randomOneTwoThree == 1) {
      circleChoice = 'small';
    }
    else if(randomOneTwoThree == 2) {
      circleChoice = 'medium';
    }
    else if(randomOneTwoThree == 3) {
      circleChoice = 'large';
    }

    let circleName = 'circle' + circleNumber;

    let circleColor = circleTypes[circleChoice][0]
    let circleSize = circleTypes[circleChoice][1]
    let circleRadius = circleTypes[circleChoice][2]
    let circleSpeed = circleTypes[circleChoice][3]

    //공 움직임 범위
    let moveableWidth = $('body').width() - circleSize;
    let moveableHeight = $('body').height() - circleSize;
    //공 초기 시작좌표
    let circlePositionLeft = (moveableWidth * Math.random()).toFixed();
    let circlePositionTop = (moveableHeight * Math.random()).toFixed();

    //공 형태 생성
    let newCircle = `<div class="circle" id="${circleName}"></div>`;
    $('body').append(newCircle);

    //css
    $(`#${circleName}`).css({
      'background-color' : circleColor,
      'width' : circleSize + 'vmin',
      'height' : circleSize + 'vmin',
      'border-radius' : circleRadius + 'vmin',
      'left' : circlePositionLeft + 'px',
      'top' : circlePositionTop + 'px',
    })

    //공과 마우스와의 거리 계산, 충돌 감지
    function timerCirclePosition(circleTrackId) {
      setTimeout(()=> {
        let currentCirclePosition = $(circleTrackId).position();
        let calculateRadius = parseInt($(circleTrackId).css('width')) * 0.5

        //마우스와 공과의 거리 계산
        let distanceX = mouseX - (currentCirclePosition.left + calculateRadius);
        let distanceY = mouseY - (currentCirclePosition.top + calculateRadius);

        //거리를 바탕으로 범위안에 들어오면 충돌 감지
        if(Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2)) <= calculateRadius) {
          $(circleTrackId).removeClass('circle').addClass('redcircle');
          $(circleTrackId).css('background-color', 'red');
          endgame();
          console.log('게임오버');
        }
        timerCirclePosition(circleTrackId);
      }, 1)
    }
    timerCirclePosition(`#${circleName}`);

    animateCircle(circleName, circleSpeed, circleSize);

    setTimeout(()=> {
      if(gameOn == true) {
        createCircle();
      }
    }, 2200)
  }

  //공의 움직임 구현
  function animateCircle(circleId, speed, circleSize) {
    let moveableWidth = $('body').width() - circleSize;
    let moveableHeight = $('body').height() - circleSize;
    //공이 움직일 수 있는 범위
    let circleMovePositionLeft = (moveableWidth * Math.random()).toFixed();
    let circleMovePositionTop = (moveableHeight * Math.random()).toFixed();

    $(`#${circleId}`).animate({
      left: circleMovePositionLeft,
      top: circleMovePositionTop
    }, speed, ()=> {
      animateCircle(circleId, speed, circleSize);
    })
  }

  //endgame()
  function endgame() {
    if(gameOn == true) {
      gameOn = false;
      $('.circle').remove();
      $('.redcircle').stop();
      updateScores(t);
    }
  }

  //점수판 데이터 정의
  let redScore;

  let highScore1 = 0.00;
  let highScore2 = 0.00;
  let highScore3 = 0.00;
  let highScore4 = 0.00;
  let highScore5 = 0.00;

  //update button
  // const updateBtn = `<input type="button" class="updateBtn">`;
  // const updateCss = {
  //   'background-color' : 'dodgerblue',
  //   'border-radius': '4px',
  //   'border': '2px solid black',
  //   'value': 'emfew',
  //   'display': 'inline-block',
  //   'width': '100px',
  //   'z-index': '11',
  // }

  //resetbutton
  let resetbutton = `<div class="resetbutton center"><h2 style="margin-top: 0; font-weight: bold;">Play Again</h2></div>`;
  const resetCss = {
    "padding": "2vh",
    "background-color": "#57db48",
    "height": "5vh",
    "width": "10vw",
    "border": "2px solid black",
    "border-radius": "10px",
    "margin": "auto",
    "margin-top": "0px",
    "position": "relative",
    "z-index": "10",
    "cursor": "pointer",
  }




  function updateScores(newScore) {

    $.ajax({
      type: 'GET',
      url: '/score',
      data: {},
      success : function (response) {
        if(response['result'] == 'success') {
          let scores = response['scores'];
          // let name = scores['name'];
          let score = scores['score'];

          //score 내림차순
          let score1 = `<div class="score center" id="score1" style="display:inline-block;">${scores[0]['score']}</div>`;
          let score2 = `<div class="score center" id="score2" style="display:inline-block;">${scores[1]['score']}</div>`;
          let score3 = `<div class="score center" id="score3" style="display:inline-block;">${scores[2]['score']}</div>`;
          let score4 = `<div class="score center" id="score4" style="display:inline-block;">${scores[3]['score']}</div>`;
          let score5 = `<div class="score center" id="score5" style="display:inline-block;">${scores[4]['score']}</div>`;

          let name1 = scores[0]['name'];
          let name2 = scores[1]['name'];
          let name3 = scores[2]['name'];
          let name4 = scores[3]['name'];
          let name5 = scores[4]['name'];

          // $(`#inputBox`).remove();
          // let temp_html = `<div class="score center"><h2>${name} ${score}</h2></div>`;
          // $(`#${redScore}`).html(temp_html);

          //점수판 로직을 바탕으로 받아온 점수를 highscores에 append
          //점수공간
          let highScorePlace1 = `<div class="score center" id="score1"><h2>${name1} ${score1}</h2></div>`;
          let highScorePlace2 = `<div class="score center" id="score2"><h2>${name2} ${score2}</h2></div>`;
          let highScorePlace3 = `<div class="score center" id="score3"><h2>${name3} ${score3}</h2></div>`;
          let highScorePlace4 = `<div class="score center" id="score4"><h2>${name4} ${score4}</h2></div>`;
          let highScorePlace5 = `<div class="score center" id="score5"><h2>${name5} ${score5}</h2></div>`;

          let inputBox = `<div id="inputBox" style="display: inline-block; margin-right: 5px;">
                            <input type="text" id="score_name" style="width: 100px;">
                            <input type="button" value="등록" onclick="update();">
                          </div>`


          if(redScore == 'score1' || `${score}` < newScore) {

            $('#highscores').append(
              // `${name}+${score}`,
//              highScorePlace1,
              `${score1}`,
              highScorePlace2,
              highScorePlace3,
              highScorePlace4,
              highScorePlace5,
              // `${name1} ${score1}`,
              resetbutton
            )
            $(`#${redScore}`).before(inputBox);
            $(`#${redScore}`).css('display', 'inline-block');

          }
          else if(redScore == 'score2') {
            $('#highscores').append(
              highScorePlace1,
              highScorePlace2,
              highScorePlace3,
              highScorePlace4,
              highScorePlace5,
              resetbutton
            )
            $(`#${redScore}`).before(inputBox);
            $(`#${redScore}`).css('display', 'inline-block');
          }
          else if(redScore == 'score3') {
            $('#highscores').append(
              highScorePlace1,
              highScorePlace2,
              highScorePlace3,
              highScorePlace4,
              highScorePlace5,
              resetbutton
            )
            $(`#${redScore}`).before(inputBox);
            $(`#${redScore}`).css('display', 'inline-block');
          }
          else if(redScore == 'score4') {
            $('#highscores').append(
              highScorePlace1,
              highScorePlace2,
              highScorePlace3,
              highScorePlace4,
              highScorePlace5,
              resetbutton
            )
            $(`#${redScore}`).before(inputBox);
            $(`#${redScore}`).css('display', 'inline-block');
          }
          else if(redScore == 'score5') {
            $('#highscores').append(
              highScorePlace1,
              highScorePlace2,
              highScorePlace3,
              highScorePlace4,
              highScorePlace5,
              resetbutton
            )
            $(`#${redScore}`).before(inputBox);
            $(`#${redScore}`).css('display', 'inline-block');
          }
          $(`#${redScore}`).css('color', 'red');

          $('.resetbutton').css(resetCss);
          $('.resetbutton').click(()=>{
            gameReset();
          })
          $('#highscores').toggle();
          $(`#${redScore}`).css('color', 'red');
        }
      }
    })

    //ajax 여기다 넣어서 처음 #highscores 나올때 db 리스트 다운
    //점수판 로직 (ajax밖에서 정립)
    if(newScore > highScore1) {
      redScore = 'score1';
      highScore5 = highScore4;
      highScore4 = highScore3;
      highScore3 = highScore2;
      highScore2 = highScore1;
      highScore1 = newScore;

    }
    else if(newScore > highScore2) {
      redScore = 'score2';
      highScore5 = highScore4;
      highScore4 = highScore3;
      highScore3 = highScore2;
      highScore2 = newScore;
    }
    else if(newScore > highScore3) {
      redScore = 'score3';
      highScore5 = highScore4;
      highScore4 = highScore3;
      highScore3 = newScore;
    }
    else if(newScore > highScore4) {
      redScore = 'score4';
      highScore5 = highScore4;
      highScore4 = newScore;
    }
    else if(newScore > highScore5) {
      redScore = 'score5';
      highScore5 = newScore;
    }


    // //점수공간
    // let highScorePlace1 = `<div class="score center" id="score1"><h2>${highScore1.toFixed(2)}</h2></div>`;
    // let highScorePlace2 = `<div class="score center" id="score2"><h2>${highScore2.toFixed(2)}</h2></div>`;
    // let highScorePlace3 = `<div class="score center" id="score3"><h2>${highScore3.toFixed(2)}</h2></div>`;
    // let highScorePlace4 = `<div class="score center" id="score4"><h2>${highScore4.toFixed(2)}</h2></div>`;
    // let highScorePlace5 = `<div class="score center" id="score5"><h2>${highScore5.toFixed(2)}</h2></div>`;

    // let inputBox = `<div id="inputBox" style="display: inline-block; margin-right: 5px;">
    //                   <input type="text" id="score_name" style="width: 100px;">
    //                   <input type="button" value="등록" onclick="update();">
    //                 </div>`


    // if(redScore == 'score1') {
    //   $('#highscores').append(
    //     highScorePlace1,
    //     highScorePlace2,
    //     highScorePlace3,
    //     highScorePlace4,
    //     highScorePlace5,
    //     resetbutton
    //   )
    //   $(`#${redScore}`).before(inputBox);
    //   $(`#${redScore}`).css('display', 'inline-block');

    // }
    // else if(redScore == 'score2') {
    //   $('#highscores').append(
    //     highScorePlace1,
    //     highScorePlace2,
    //     highScorePlace3,
    //     highScorePlace4,
    //     highScorePlace5,
    //     resetbutton
    //   )
    //   $(`#${redScore}`).before(inputBox);
    //   $(`#${redScore}`).css('display', 'inline-block');
    // }
    // else if(redScore == 'score3') {
    //   $('#highscores').append(
    //     highScorePlace1,
    //     highScorePlace2,
    //     highScorePlace3,
    //     highScorePlace4,
    //     highScorePlace5,
    //     resetbutton
    //   )
    //   $(`#${redScore}`).before(inputBox);
    //   $(`#${redScore}`).css('display', 'inline-block');
    // }
    // else if(redScore == 'score4') {
    //   $('#highscores').append(
    //     highScorePlace1,
    //     highScorePlace2,
    //     highScorePlace3,
    //     highScorePlace4,
    //     highScorePlace5,
    //     resetbutton
    //   )
    //   $(`#${redScore}`).before(inputBox);
    //   $(`#${redScore}`).css('display', 'inline-block');
    // }
    // else if(redScore == 'score5') {
    //   $('#highscores').append(
    //     highScorePlace1,
    //     highScorePlace2,
    //     highScorePlace3,
    //     highScorePlace4,
    //     highScorePlace5,
    //     resetbutton
    //   )
    //   $(`#${redScore}`).before(inputBox);
    //   $(`#${redScore}`).css('display', 'inline-block');
    // }

    // $('.resetbutton').css(resetCss);
    // $('.resetbutton').click(()=>{
    //   gameReset();
    // })
    // $('#highscores').toggle();
    // $(`#${redScore}`).css('color', 'red');
  }
  //gameReset()
  function gameReset() {
    $('#highscores').fadeOut(100, ()=> {
      $('.startbutton').toggle();
      t = 0;
      $('.timer').html(`<div class="center"><h1>${t.toFixed(2)}</h1></div>`);
      $('.redcircle').remove();
      $('.score').remove();
      $('.resetbutton').remove();
      $('.box').remove();
      $('#inputBox').remove();
    })
  }

//비동기 function update()
//ajax
function update() {
  let scoreName = $(`#score_name`).val();
  let score = $(`#${redScore}`).text();

  $.ajax({
    type: 'POST',
    url: '/score',
    data: { name_give: scoreName, score_give: score },
    success: function(response){
        if (response['result'] == 'success'){
            // alert(response['msg']);
            // window.location.reload();
        }

    }
  })

  $.ajax({
    type: 'GET',
    url: '/score',
    data: {},
    success : function (response) {
      if(response['result'] == 'success') {
        let scores = response['scores'];
        let name = scores[scores.length -1]['name'];
        let score = scores[scores.length -1]['score'];

        $(`#inputBox`).remove();
        let temp_html = `<div class="score center"><h2>${name} ${score}</h2></div>`;
        $(`#${redScore}`).html(temp_html);
      }
    }
  })
}


//목록 보여주기
function listing() {

}

/*
highScore 붙인다 조건에 맞춰서.


maxScore < newScore
maxScore = newScore


*/