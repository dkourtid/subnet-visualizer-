let subnetStates=[];
let timer=null;

/* helpers */

function ipToInt(ip){
  return ip.split('.').reduce((a,b)=>(a<<8)+ +b,0);
}

function intToIp(int){
  return [(int>>>24)&255,(int>>>16)&255,(int>>>8)&255,int&255].join('.');
}

function toBinary32(n){
  return n.toString(2).padStart(32,'0');
}

/* ---------------- start ---------------- */

function start(){

  clearInterval(timer);

  const ip=document.getElementById("ip").value;
  const cidr=parseInt(document.getElementById("cidr").value);

  const ipInt=ipToInt(ip);

  document.getElementById("info").innerText="CIDR: /"+cidr;

  createBinary(ipInt,cidr);
  calculateSubnets(ipInt,cidr);
}

/* ---------------- binary view ---------------- */

function createBinary(ipInt,cidr){

  const container=document.getElementById("bits");
  container.innerHTML="";

  const bin=toBinary32(ipInt);

  for(let b=0;b<4;b++){

    const byte=document.createElement("span");
    byte.className="byte";

    for(let i=0;i<8;i++){

      const pos=b*8+i;

      const bit=document.createElement("span");
      bit.textContent=bin[pos];
      bit.className="bit";

      if(pos<cidr) bit.classList.add("network");
      else bit.classList.add("host");

      byte.appendChild(bit);
    }

    container.appendChild(byte);
  }
}

/* ---------------- subnet calc ---------------- */

function calculateSubnets(ipInt,cidr){

  subnetStates=[];

  const tbody=document.querySelector("#table tbody");
  tbody.innerHTML="";

  const hostBits=32-cidr;
  const block=2**hostBits;

  let i=0;

  for(let net=ipInt; i<8; net+=block){

    subnetStates.push(toBinary32(net));

    tbody.innerHTML+=`
      <tr>
        <td>${i}</td>
        <td>${intToIp(net)}</td>
        <td>${intToIp(net+1)}</td>
        <td>${intToIp(net+block-2)}</td>
        <td>${intToIp(net+block-1)}</td>
      </tr>`;

    i++;
  }
}

/* ---------------- animation ---------------- */

function play(){

  if(!subnetStates.length) return;

  let i=0;

  clearInterval(timer);

  timer=setInterval(()=>{

    const state=subnetStates[i];

    const bits=document.querySelectorAll(".bit");

    bits.forEach((el,idx)=>{
      el.textContent=state[idx];
    });

    i=(i+1)%subnetStates.length;

  },800);
}

/* events */

document.getElementById("startBtn").onclick=start;
document.getElementById("playBtn").onclick=play;

start();
