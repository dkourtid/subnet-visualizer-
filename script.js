let subnetStates=[];
let subnetBits=[];
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

/* start */

function start(){

  clearInterval(timer);

  const ip=document.getElementById("ip").value;
  const cidr=parseInt(document.getElementById("baseCidr").value);

  const ipInt=ipToInt(ip);

  document.getElementById("info").innerText=`CIDR: /${cidr}`;

  createBinary(ipInt,cidr);
  calculateSubnets(ipInt,cidr);
}

/* -------- Binary with BYTE GROUPS -------- */

function createBinary(ipInt,cidr){

  const div=document.getElementById("bits");
  div.innerHTML="";
  subnetBits=[];

  const bin=toBinary32(ipInt);

  for(let b=0;b<4;b++){

    const byte=document.createElement("div");
    byte.className="byte";

    for(let i=0;i<8;i++){

      const pos=b*8+i;

      const s=document.createElement("span");
      s.textContent=bin[pos];
      s.className="bit";

      if(pos<cidr) s.classList.add("network");
      else s.classList.add("host");

      byte.appendChild(s);
    }

    div.appendChild(byte);
  }
}

/* -------- subnet calc -------- */

function calculateSubnets(ipInt,cidr){

  subnetStates=[];

  const tbody=document.querySelector("#table tbody");
  tbody.innerHTML="";

  const hostBits=32-cidr;
  const block=2**hostBits;

  let index=0;

  for(let net=ipInt; net<ipInt+block*8; net+=block){

    subnetStates.push(toBinary32(net));

    const first=net+1;
    const last=net+block-2;
    const bc=net+block-1;

    tbody.innerHTML+=`
    <tr>
      <td>${index}</td>
      <td>${intToIp(net)}</td>
      <td>${intToIp(first)}</td>
      <td>${intToIp(last)}</td>
      <td>${intToIp(bc)}</td>
    </tr>`;

    index++;
  }
}

/* -------- animation -------- */

function animate(){

  if(!subnetStates.length) return;

  let i=0;

  clearInterval(timer);

  timer=setInterval(()=>{

    const state=subnetStates[i];

    const spans=document.querySelectorAll(".bit");

    spans.forEach((el,idx)=>{
      el.textContent=state[idx];
    });

    i=(i+1)%subnetStates.length;

  },700);
}

/* events */

document.getElementById("startBtn").onclick=start;
document.getElementById("animateBtn").onclick=animate;

start();
