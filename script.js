let subnetStates=[];
let subnetBits=[];
let timer=null;
let playing=false;

/* ---------------- utils ---------------- */

function ipToInt(ip){
  return ip.split('.').reduce((a,b)=>(a<<8)+ +b,0);
}

function intToIp(int){
  return [(int>>>24)&255,(int>>>16)&255,(int>>>8)&255,int&255].join('.');
}

function toBinary32(n){
  return n.toString(2).padStart(32,'0');
}

function bitsForSubnets(n){ return Math.ceil(Math.log2(n)); }
function bitsForHosts(n){ return Math.ceil(Math.log2(n+2)); }

/* ---------------- start ---------------- */

function start(){

  stopAnimation();

  const ip=document.getElementById("ip").value;
  const base=parseInt(document.getElementById("baseCidr").value);
  const mode=document.querySelector("input[name=mode]:checked").value;

  let borrow;

  if(mode==="subnets"){
    borrow=bitsForSubnets(parseInt(document.getElementById("subnetCount").value));
  }else{
    borrow=(32-base)-bitsForHosts(parseInt(document.getElementById("hostCount").value));
  }

  const cidr=base+borrow;
  const ipInt=ipToInt(ip);

  document.getElementById("info").innerText=`Νέο CIDR: /${cidr} | Borrowed bits: ${borrow}`;

  buildBinaryAnimated(ipInt,base,borrow);
  calculateSubnets(ipInt,cidr);
}

/* ---------------- animated build ---------------- */

function buildBinaryAnimated(ipInt,base,borrow){

  const div=document.getElementById("bits");
  div.innerHTML="";
  subnetBits=[];

  const bin=toBinary32(ipInt);

  let i=0;

  const interval=setInterval(()=>{

    if(i>=32){ clearInterval(interval); return; }

    const s=document.createElement("span");
    s.textContent=bin[i];
    s.className="bit";

    if(i<base) s.classList.add("network");
    else if(i<base+borrow){
      s.classList.add("subnet");
      subnetBits.push(s);
    }
    else s.classList.add("host");

    div.appendChild(s);

    if((i+1)%8===0 && i!==31){
      const dot=document.createElement("span");
      dot.textContent=".";
      dot.className="dot";
      div.appendChild(dot);
    }

    i++;

  },40); // speed build
}

/* ---------------- subnets calc ---------------- */

function calculateSubnets(ipInt,cidr){

  subnetStates=[];

  const tbody=document.querySelector("#table tbody");
  tbody.innerHTML="";

  const hostBits=32-cidr;
  const block=2**hostBits;

  let index=0;

  for(let net=ipInt; net<ipInt+block*(2**(cidr-ipToCidrBase(ipInt))); net+=block){

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

function ipToCidrBase(){ return 24 } // απλό για classroom use

/* ---------------- animation ---------------- */

function animate(){

  if(!subnetStates.length) return;

  playing=!playing;

  document.getElementById("animateBtn").innerText =
    playing ? "⏸ Pause" : "▶ Play Animation";

  if(!playing){
    clearInterval(timer);
    return;
  }

  let i=0;

  timer=setInterval(()=>{

    const state=subnetStates[i];

    subnetBits.forEach((el,idx)=>{

      const pos=32-subnetBits.length+idx;

      el.style.transform="scale(1.4)";

      setTimeout(()=>{
        el.textContent=state[pos];
        el.style.transform="scale(1)";
      },120);

    });

    i=(i+1)%subnetStates.length;

  },900);
}

function stopAnimation(){
  clearInterval(timer);
  playing=false;
  document.getElementById("animateBtn").innerText="▶ Play Animation";
}

/* ---------------- events ---------------- */

document.getElementById("startBtn").addEventListener("click",start);
document.getElementById("animateBtn").addEventListener("click",animate);

start();
