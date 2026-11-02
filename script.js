
* {
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background: #f3f3f3;
  padding: 20px;
  margin: 0;
}

h1 {
  text-align: center;
}

.controls {
  background: white;
  padding: 18px;
  border-radius: 10px;
  margin-bottom: 20px;
}

input {
  padding: 7px;
  margin: 5px;
  max-width: 150px;
}

button {
  padding: 10px 14px;
  margin: 4px;
  border: none;
  border-radius: 6px;
  background: #1976d2;
  color: white;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background: #125ca5;
}

button:active {
  transform: scale(0.95);
}

#bits {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  font-family: monospace;
  font-size: 22px;
  margin: 15px 0;
  align-items: center;
}

.bit {
  width: 20px;
  text-align: center;
  border-radius: 4px;
  padding: 3px 0;
  transition: transform 0.25s;
}

.network {
  background: #4caf50;
  color: white;
}

.subnet {
  background: #ff9800;
  color: white;
}

.host {
  background: #e0e0e0;
  color: #333;
}

.dot {
  font-weight: bold;
  margin: 0 5px;
  color: #222;
}

.legend {
  margin-bottom: 25px;
}

.legend span {
  display: inline-block;
  padding: 6px 10px;
  margin-right: 8px;
  border-radius: 6px;
  color: white;
  font-size: 14px;
}

.flip {
  transform: scale(1.5);
  box-shadow: 0 0 8px #ff9800;
}

/* SUBNET DETAILS */

.subnet-details {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin: 20px 0;
  box-shadow: 0 2px 8px #00000012;
}

.subnet-details h2 {
  text-align: center;
}

.counter-box {
  background: #263238;
  color: white;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 15px;
  font-size: 18px;
}

#subnetCounter {
  color: #ffca28;
  font-family: monospace;
  font-size: 28px;
  margin: 0 12px;
}

#subnetProgress {
  display: block;
  font-size: 13px;
  margin-top: 6px;
  color: #ddd;
}

.address-box {
  padding: 18px;
  border-radius: 9px;
  margin: 12px 0;
  text-align: center;
  transition: all 0.3s;
}

.address-box h3 {
  margin-top: 0;
  font-size: 16px;
}

.address-box div {
  font-family: monospace;
  font-size: 24px;
  font-weight: bold;
  overflow-wrap: anywhere;
}

.network-address {
  background: #e8f5e9;
  border-left: 6px solid #4caf50;
  color: #1b5e20;
}

.broadcast-address {
  background: #ffebee;
  border-left: 6px solid #e53935;
  color: #b71c1c;
}

/* TABLE */

.table-container {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  min-width: 650px;
}

th, td {
  border: 1px solid #ccc;
  padding: 9px;
  text-align: center;
}

th {
  background: #333;
  color: white;
}

.activeRow {
  background: #ffe082 !important;
  font-weight: bold;
  outline: 2px solid #ff9800;
}

/* MOBILE */

@media(max-width:600px) {

  body {
    padding: 10px;
  }

  h1 {
    font-size: 23px;
  }

  .controls {
    padding: 12px;
  }

  button {
    width: 100%;
    margin: 5px 0;
  }

  #bits {
    gap: 2px;
    font-size: 18px;
  }

  .bit {
    width: 17px;
  }

  .address-box div {
    font-size: 19px;
  }

}
