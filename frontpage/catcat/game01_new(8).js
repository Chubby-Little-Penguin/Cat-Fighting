var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

var canvas1 = document.getElementById('canvas1')
var ctx1 = canvas1.getContext('2d')
canvas1.style.backgroundColor='red';
var canvas2 = document.getElementById('canvas2')
var ctx2 = canvas2.getContext('2d')
canvas2.style.backgroundColor='red';

var timeInterval = 100;

setInterval(function(){
    generate_object();
    draw();
    time += 0.1;
},timeInterval)

// var img = new Image();
// var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});

// var DOMURL = self.URL || self.webkitURL || self;
// var url = DOMURL.createObjectURL(svg);

// img.src = 'static/cat2left.svg';

// img.onload = function () {
//     ctx.drawImage(img, 0, 0);
// };

//设置玩家1 (右下角出发)
var player1lefto = new Image();
player1lefto.src = 'static/openleft0.png';
var player1righto = new Image();
player1righto.src = 'static/openright0.png';
var player1leftc = new Image();
player1leftc.src = 'static/closeleft0.png';
var player1rightc = new Image();
player1rightc.src = 'static/closeright0.png';
var player1_x = 265;
var player1_y = 120;                                         // 设置了初位置！！！
var player1_HP = 10;
var player1_FC = 20;//玩家1的战斗力
var player1_speed;//玩家1的速度
var dir1 = 0;//玩家1方向 0左 1右
var speed1 = 5;
var mouth1 = 1;//1张0闭

//设置玩家2（左上角出发）
var player2lefto = new Image();
player2lefto.src = 'static/openleft1.png';
var player2righto = new Image();
player2righto.src = 'static/openright1.png';
var player2leftc = new Image();
player2leftc.src = 'static/closeleft1.png';
var player2rightc = new Image();
player2rightc.src = 'static/closeright1.png';
var player2_x = 0;
var player2_y = 0;
var player2_HP = 10;
var player2_FC = 20;//玩家2的战斗力
var player2_speed;//玩家2的速度
var dir2 = 1;//玩家2方向  0左 1右
var speed2 = 5;
var mouth2 = 1;//1张0闭

//设置object
var object1 = new Image();
object1.src = "static/food1.png";
var object2 = new Image();
object2.src = "static/food2.png";
var object3 = new Image();
object3.src = "static/baba.png";

var ob_x = [];
var ob_y = [];
var ob_time = [];
var ob_value = [];


var time = 0;

function generate_object(){
    for (var i = 0; i < 500; i++){
        var tmp_type = Math.random();
        var tmp_posX = Math.random();
        var tmp_posY = Math.random();//the object can be covered by the player once it occurs
        if (tmp_type >= 0.7){
            ob_value.push(2);
            ob_x.push(tmp_posX * 270);
            ob_y.push(tmp_posY * 120);
            ob_time.push(Math.floor(Math.random() * 2) + 3);//the duration is 4-6s(include 4 and 6)
        } 
        else if(tmp_type >= 0.6){
            ob_value.push(5);
            ob_x.push(tmp_posX * 270);
            ob_y.push(tmp_posY * 120);
            ob_time.push(Math.floor(Math.random() * 2) + 2);//1-3 seconds
        }
        else{
            ob_value.push(-3);
            // var player_pos_x = [];
            // var player_pos_y = [];
            // player_pos_x.push(player1_x);
            // player_pos_x.push(player2_x);
            // player_pos_y.push(player1_y);
            // player_pos_y.push(player2_y);
            // var chos = Math.floor(Math.random()*2);
            // ob_x.push((tmp_posX - 0.5) * 120 + player_pos_x[chos]);
            // ob_y.push((tmp_posY - 0.5) * 120 + player_pos_y[chos]);
            ob_x.push(tmp_posX * 270);
            ob_y.push(tmp_posY * 120);
            ob_time.push(Math.floor(Math.random() * 2) + 1);//4-10 seconds
        }
    }
}

function draw(){
    ctx.clearRect(0, 0, 300, 150);
    //drawHPandFC();
    for (var i = 0; i < 500; i++){
        if (time >= i && time <= 3 * i + ob_time[i]){
            if (ob_value[i] == 2){
                ctx.drawImage(object1, ob_x[i], ob_y[i], 10, 10);
            }
            else if (ob_value[i] == 5){
                ctx.drawImage(object2, ob_x[i], ob_y[i], 10, 10);
            }
            else if (ob_value[i] == -3){
                ctx.drawImage(object3, ob_x[i], ob_y[i], 10, 10);
            }
        }
    }
    //ctx.drawImage(player1, 0, 0, 35,30);
    //画出玩家1
    //console.log("画出玩家");
    if(dir1==1 && mouth1==1){
        ctx.drawImage(player1righto, player1_x, player1_y, 35,30);
    }
    else if(dir1==1 && mouth1==0){
        ctx.drawImage(player1rightc, player1_x, player1_y, 35,30);
    }
    else if(dir1==0 && mouth1==1){
        ctx.drawImage(player1lefto, player1_x, player1_y, 35,30);
    }
    else{
        ctx.drawImage(player1leftc, player1_x, player1_y, 35,30);
    }
    //画出玩家2
    if(dir2==1 && mouth2==1){
        ctx.drawImage(player2righto, player2_x, player2_y, 35,30);
    }
    else if(dir2==1 && mouth2==0){
        ctx.drawImage(player2rightc, player2_x, player2_y, 35,30);
    }
    else if(dir2==0 && mouth2==1){
        ctx.drawImage(player2lefto, player2_x, player2_y, 35,30);
    }
    else{
        ctx.drawImage(player2leftc, player2_x, player2_y, 35,30);
    }
    check_collision();
}


function check_collision(){
    //这个函数的作用是检测两个物体是否碰到，可以检测object和玩家操控的猫猫，也可以是猫猫和猫猫

    //检测玩家与玩家，撞到了扣血
    console.log("HP1: " + player1_HP);
    console.log("HP2: " + player2_HP);
    if (player1_x < player2_x + 35 && player1_x + 35 > player2_x && player1_y < player2_y + 30 && player1_y + 30 > player2_y){
        if (player1_FC > player2_FC){
            player2_HP -= Math.floor((player1_FC-player2_FC)/10) + 2;
            var redWidth = canvas2.width * player2_HP / 10;
            var redHeight = canvas2.height;
            // 绘制红色矩形
            ctx2.fillStyle = 'red';
            ctx2.fillRect(0, 0, redWidth, redHeight);
            // 绘制白色矩形
            ctx2.fillStyle = 'white';
            ctx2.fillRect(redWidth, 0, canvas.width - redWidth, redHeight);

            // 归位
            player1_x = 265;
            player1_y = 120;
            player2_x = 0;
            player2_y = 0;
        }
        if (player1_FC < player2_FC){
            player1_HP -= Math.floor((player2_FC-player1_FC)/10) + 2;
            var redWidth = canvas1.width * player1_HP / 10;
            var redHeight = canvas1.height;
            // 绘制红色矩形
            ctx1.fillStyle = 'red';
            ctx1.fillRect(0, 0, redWidth, redHeight);
            // 绘制白色矩形
            ctx1.fillStyle = 'white';
            ctx1.fillRect(redWidth, 0, canvas.width - redWidth, redHeight);

            // 归位
            player1_x = 265;
            player1_y = 120;
            player2_x = 0;
            player2_y = 0;
        }
        
    }
    if (flag){
        if (player1_HP <= 0 || player1_FC <= 0){
            console.log('player2 win');
            ctx1.clearRect(0, 0, 40, 7);
            document.getElementById('player1FCValue').innerText = 'Player1_FC:' + player1_FC;
            document.getElementById('player2FCValue').innerText = 'Player2_FC:' + player2_FC;
            alert("player2 win");
            flag = false;
            reset();
        }
        if (player2_HP <= 0 || player2_FC <= 0){
            console.log('player1 win');
            ctx2.clearRect(0, 0, 40, 7);
            document.getElementById('player1FCValue').innerText = 'Player1_FC:' + player1_FC;
            document.getElementById('player2FCValue').innerText = 'Player2_FC:' + player2_FC;
            alert("player2 win");
            alert("player1 win")
            flag = false;
            reset();
        }
    }    
    
    //检测玩家与物体,需要用循环遍历,撞到好的加攻击，不好的减攻击
    //玩家1
    for (var i = 0; i < 500; i++){
        if (mouth1==1){
            if (player1_x < ob_x[i] + 10 && player1_x + 35 > ob_x[i] && player1_y < ob_y[i] + 10 && player1_y + 30 > ob_y[i]){
                if (time >= i && time <= 3 * i + ob_time[i]){
                    player1_FC += ob_value[i];
                    ob_time[i] = 0;
                    ob_value[i] = 0;}
            }
        }
        document.getElementById('player1FCValue').innerText = 'Player1_FC:' + player1_FC;
    }
    //玩家2
    for (var i = 0; i < 500; i++){
        if (mouth2==1){
            if (player2_x < ob_x[i] + 10 && player2_x + 35 > ob_x[i] && player2_y < ob_y[i] + 10 && player2_y + 30 > ob_y[i]){
                if (time >= i && time <= 3 * i + ob_time[i]) {
                    player2_FC += ob_value[i];
                    ob_time[i] = 0;
                    ob_value[i] = 0;
                }
            }
        }
        document.getElementById('player2FCValue').innerText = 'Player2_FC:' + player2_FC;
    }
}

function initCondition() {
    //随机个数生成物品，并将玩家放置在应有的位置
    generate_object();
    draw();
    
}

function reset(){
    if (!flag){
        console.log("reset");
        time = 0;
        ob_x = [];
        ob_y = [];
        ob_time = [];
        ob_value = [];

        player2_x = 0;
        player2_y = 0;
        player2_HP = 10;
        player2_FC = 20;//玩家2的战斗力
        player2_speed;//玩家2的速度
        dir2 = 1;//玩家2方向  0左 1右

        player1_x = 265;
        player1_y = 120;                                         // 设置了初位置！！！
        player1_HP = 10;
        player1_FC = 20;//玩家1的战斗力
        player1_speed;//玩家1的速度
        dir1 = 0;//玩家1方向 0左 1右

        ctx1.fillStyle = 'red';
        ctx1.fillRect(0, 0, canvas1.width, canvas1.height);
        document.getElementById('player1FCValue').innerText = 'Player1_FC:' + player1_FC;

        ctx2.fillStyle = 'red';
        ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
        document.getElementById('player2FCValue').innerText = 'Player2_FC:' + player2_FC;

        flag = true;

        initCondition();
        
    }
}

var flag = true;

function initialize(){
    initCondition();
    setInterval(draw,30);
    //玩家1通过↑↓←→移动
    document.addEventListener('keydown',function(pressButton){
        if(pressButton.code == 'ArrowRight'){
            if (player1_x + 35 < canvas.width){
                player1_x += speed1;
                dir1 = 1;
            }
            else{
                dir1 = 0;
            }
        }
    
        if(pressButton.code == 'ArrowLeft'){
            if (player1_x > 0){
                player1_x -= speed1;
                dir1 = 0;
            }
            else{
                dir1 = 1;
            }
        }
        if(pressButton.code == 'ArrowUp'){
            if(player1_y >0 && player1_y + 30<=150){
                player1_y -= speed1;
                dir1 = 0;
            }
        }
        if(pressButton.code == 'ArrowDown'){
            if(player1_y >=0 && player1_y + 30 <150){
                player1_y += speed1;
                dir1 = 0;
            }
        }
        if(pressButton.code == 'Space'){
            if (mouth1==0) mouth1=1;
            else mouth1=0;
        }
    });
    //玩家2通过WASD移动
    document.addEventListener('keydown',function(pressButton){
        console.log(pressButton.key);
        if(pressButton.key == 'd'){
            if (player2_x + 35 < canvas.width){
                player2_x += speed2;
                dir2 = 1;
            }
            else{
                dir2 = 0;
            }
        }
    
        if(pressButton.key == 'a'){
            if (player2_x > 0){
                player2_x -= speed2;
                dir2 = 0;
            }
            else{
                dir2 = 1;
            }
        }
        if(pressButton.key == 'w'){
            if(player2_y >0 && player2_y + 30<=150){
                player2_y -= speed2;
                dir2 = 0;
            }
        }
        if(pressButton.key == 's'){
            if(player2_y >=0 && player2_y + 30 <150){
                player2_y += speed2;
                dir2 = 0;
            }
        }
        if(pressButton.key == 'q'){
            if (mouth2==0) mouth2=1;
            else mouth2=0;
        }
    });

}



