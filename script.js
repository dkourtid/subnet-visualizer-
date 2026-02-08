body {
  font-family: Arial;
  background:#f2f2f2;
  padding:20px;
  margin:0;
}

h1{
  font-size:1.8em;
  text-align:center;
}

.controls{
  background:white;
  padding:15px;
  border-radius:10px;
  margin-bottom:20px;
}

.controls label{
  font-weight:bold;
}

.controls input[type="number"], .controls input[type="text"]{
  width: 100%;
  max-width:200px;
  padding:5px;
  margin:5px 0;
  font-size:1em;
}

button{
  padding:10px 15px;
  font-size:1em;
  margin-right:10px;
  border:none;
  border-radius:5px;
  background:#2196F3;
  color:white;
}

button:active{
  background:#1976D2;
}

#bits{
  font-family: monospace;
  font-size:24px;
  letter-spacing:4px;
  margin:15px 0;
  word-wrap: break-word;
}

.bit{
  padding:4px;
  border-radius:4px;
}

.network{ background:#4CAF50; color:white; }
.subnet{ background:#FF9800; color:white; }
.host{ background:#ddd; }

table{
  width:100%;
  border-collapse:collapse;
  background:white;
  font-size:0.9em;
}

th,td{
  border:1px solid #ccc;
  padding:6px;
  text-align:center;
}

th{
  background:#333;
  color:white;
}

@media screen and (max-width:600px){
  #bits{
    font-size:18px;
    letter-spacing:2px;
  }
  button{
    width:48%;
    margin-bottom:10px;
  }
}
