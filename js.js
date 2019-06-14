//var c = doc//ument.getElementById('canvas');
//var ctx = c.getContext("2d");

point = [0, 0];
let table = document.getElementById("myTable");
let n = 5;
let tableWidth = 1000;
table.parentElement.style.height = tableWidth + "px"
table.parentElement.style.width = tableWidth + "px"

table.style.height = tableWidth + "px"
table.style.width = tableWidth + "px"

for(var i = 0; i < n; i++){
    let tr = document.createElement('tr');
    tr.style.height = ((100/n)+"%")
    // tr.style.width = "100%" ;
    for(var j = 0; j < n; j++){
        let td = document.createElement('td');
        let cvs = document.createElement('canvas');
        // cvs.style.width = (100/n)+"%";
        // cvs.style.height= "100%";
        td.appendChild(cvs);
        tr.appendChild(td)
    }
    table.appendChild(tr);
}


class Ring { 
    constructor(canvas, speed, index, leaders){ 
        this.ctx = canvas.getContext('2d');
        this.trail = [];
        this.trailLength = 50;
        this.speed = speed;
        this.index = index;
        this.ct = 0;

        this.x = 0;
        this.y = 0;

        this.lead = false;
    }


    update(delta){
        this.ctx.clearRect(0,0,200 , 200);
        let point = [0,0]

        if(this.lead){

            this.x = (this.leaders[0].x+this.leaders[1].x)/2;
            this.y = (this.leaders[0].y+this.leaders[1].y)/2;


        } else {

            this.ct += (delta/1000)*this.speed;

            this.x = Math.sin(this.ct)  * 40;
            this.y = Math.cos(this.ct)  * 40;

            
        }

        point = [
            this.x,
            this.y 
        ];

        this.trail.unshift([point[0], point[1]]);
        
        if(this.trail.length >= this.trailLength){
            this.trail = this.trail.slice(0,this.trailLength)
        }

        for (let ti = 0; ti < this.trail.length; ti++) {
            
            const tail = this.trail[ti];
            this.ctx.fillStyle = `rgba(255, 165, 0, ${(1/ti)/1})`;
            this.ctx.beginPath();
            this.ctx.arc(50+tail[0], 50+tail[1], ( 3/ti  )/2, 0, 2*Math.PI);
            this.ctx.stroke();

        }
        this.ctx.fillStyle = 'rgba(255, 165, 0, 1)';
        this.ctx.beginPath();
        this.ctx.arc(50+point[0], 50+point[1], 1, 0, 2*Math.PI);
        this.ctx.stroke();
    }

}

var cvses = document.getElementsByTagName('canvas')

//let rings = Object.keys(cvses).map(x=>{return new Ring(cvses[x]);});
let rings = []
//
let unfinished = [];

let baseSpeed = 0.5;

for (let i = 0; i < Object.keys(cvses).length; i++) {
    
    if(i==0){
        continue;
    }
    
    
    
    var id = getIndex(i, 4*4);
    console.log(i + " -> " +id);
    
    if(id[0] === 0){

        rings.push(
            new Ring(
                cvses[Object.keys(cvses)[i]],
                -(baseSpeed+id[1]),
                id
            )
        )

    } else if (id[1] === 0){

        rings.push(
            new Ring(
                cvses[Object.keys(cvses)[i]],
                (baseSpeed+id[0]),
                id
            )
        )
    }  else { 
        unfinished.push(
            new Ring(
                cvses[Object.keys(cvses)[i]],
                -(baseSpeed+id[1]),
                id
            )
        )
    }

}

for (let i = 0; i < unfinished.length; i++) {
    const element = unfinished[i];
    element.leaders = [];

    let xleader = rings.filter(x=>{
        return (x.index[0] === element.index[0]) && (x.index[1] === 0);
    })[0];
    let yleader = rings.filter(x=>{
        return (x.index[0] === 0) && (x.index[1] === element.index[1]);
    })[0];

    element.leaders = [
        xleader,
        yleader
    ]//tihs is x 

    element.lead = true;
    rings.push(element);
}



function getIndex(i,length){
    let wh = Math.sqrt(length);
    if(i == 0){ return [0,0]}
    
    let fp = i % wh;
    let lp = Math.floor(i / wh);

    return [fp, lp];
}

(function loop(lf){
    ctime = Date.now();
    delta = ctime - lf;

    try{
        rings.forEach(x=>{x.update(delta)})
    } catch(e){
        console.log(e);
    }

    requestAnimationFrame(loop.bind(null, ctime))

})(Date.now())
// ctx.beginPath();
// ctx.arc(95, 50, 40, 0, 2 * Math.PI);
// ctx.stroke();