let subnetStates=[];
let subnetBitsElements=[];
let timer=null;
let currentIndex=0;
let newCidr=0;
let borrowedBits=0;

/* ---------- utils ---------- */

// ασφαλής μετατροπή decimal IP σε binary (ανά byte)
function ipToBinary(ip){
  return ip.split('.')
    .map(octet => parseInt(octet).toString(2).padStart(8,'0'))
    .join('');
}

function ipToInt(ip){
  return ip.split('.').reduce((a,b)=>(a<<8)+ +b,0) >>>0;
}

function intToIp(int){
  return [(int>>>24)&255,(int>>>16)&255,(int>>>8)&255,int&255].join('.');
}

function intToBinary(ipInt){
  return [
    (ipInt>>>24)&255,
    (ipInt>>>16)&255,
    (ipInt>>>8)&255,
    ipInt&255
  ].map(o=>o.toString(2).padStart(8,'0')).join('');
}

/* ---------- start ---------- */

function start(){

  clearInterval(timer);
  currentIndex=0;

  const ip=document.getElementById("ip").value;
  const base=parseInt(document.getElementById("baseCidr").value);
  const mode=document.querySelector("input[name=mode]:checked").value;

  if(mode==="subnets"){
    const count=parseInt(document.getElementById("subnetCount").value);
    borrowedBits=Math.ceil(Math.log2(count));
    newCidr=base+borrowedBits;
  }else{
    const hosts=parseInt(document.getElementById("hostCount").value);
    const needed=Math.ceil(Math.log2(hosts+2));
    newCidr=32-needed;
    borrowedBits=newCidr-base;
  }

  document.getElementById("info").innerText=
  `Νέο CIDR: /${newCidr} | Borrowed bits: ${borrowedBits}`;

  buildBinary(ip,base);
  generateSubnets(ipToInt(ip),base);
}

/* ---------- build binary ---------- */

function buildBinary(ip,base){

  const div=document.getElementById("bits");
  div.innerHTML="";
  subnetBitsElements=[];

  const bin=ipToBinary(ip);

  for(let i=0;i<32;i++){

    const span=document.createElement("span");
    span.textContent=bin[i];
    span.className="bit";

    if(i<base) span.classList.add("network");
    else if(i<base+borrowedBits){
      span.classList.add("subnet");
      subnetBitsElements.push(span);
    }
    else span.classList.add("host");

    div.appendChild(span);

    if((i+1)%8===0 && i!==31){
      const dot=document.createElement("span");
      dot.textContent=".";
      dot.className="dot";
      div.appendChild(dot);
    }
  }
}

/* ---------- generate subnets ---------- */

function generateSubnets(ipInt,base){

  subnetStates=[];
  const tbody=document.querySelector("#table tbody");
  tbody.innerHTML="";

  const hostBits=32-newCidr;
  const block=2**hostBits;
  const total=2**borrowedBits;

  for(let i=0;i<total;i++){

    const net=ipInt + i*block;
    subnetStates.push(intToBinary(net));

    tbody.innerHTML+=`
    <tr>
      <td>${i}</td>
      <td>${intToIp(net)}</td>
      <td>${intToIp(net+1)}</td>
      <td>${intToIp(net+block-2)}</td>
      <td>${intToIp(net+block-1)}</td>
    </tr>`;
  }
}

/* ---------- highlight ---------- */

function highlightRow(index){
  const rows=document.querySelectorAll("#table tbody tr");
  rows.forEach(r=>r.classList.remove("activeRow"));
  if(rows[index]) rows[index].classList.add("activeRow");
}

/* ---------- step animation (σωστό binary counter) ---------- */

function stepSubnet(){

  if(!subnetStates.length) return;

  const state=subnetStates[currentIndex];
  const base=parseInt(document.getElementById("baseCidr").value);

  // LSB first (δεξιά → αριστερά)
  for(let i=subnetBitsElements.length-1;i>=0;i--){

    const el=subnetBitsElements[i];
    const pos=base+i;

    setTimeout(()=>{

      el.classList.add("flip");
      el.textContent=state[pos];

      setTimeout(()=>{
        el.classList.remove("flip");
      },150);

    }, (subnetBitsElements.length-1-i)*120);
  }

  highlightRow(currentIndex);

  currentIndex++;
  if(currentIndex>=subnetStates.length)
    currentIndex=0;
}

/* ---------- controls ---------- */

function play(){
  if(timer) return;
  timer=setInterval(stepSubnet,900);
}

function pause(){
  clearInterval(timer);
  timer=null;
}

function reset(){
  pause();
  currentIndex=0;
  highlightRow(-1);
  start();
}

/* ---------- events ---------- */

document.getElementById("startBtn").addEventListener("click",start);
document.getElementById("playBtn").addEventListener("click",play);
document.getElementById("pauseBtn").addEventListener("click",pause);
document.getElementById("nextBtn").addEventListener("click",stepSubnet);
document.getElementById("resetBtn").addEventListener("click",reset);

start();
