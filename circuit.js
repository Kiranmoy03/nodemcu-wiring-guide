/* One model drives the drawing and the exact connection map. */
(function (root) {
  const left = ['A0','G-L1','VV','S3','S2','S1','SC','S0','SK','G-L2','3V-L','EN','RST','G-L3','VIN'];
  const right = ['D0','D1','D2','D3','D4','3V-R1','G-R1','D5','D6','D7','D8','RX','TX','G-R2','3V-R2'];
  const pins = [...left.map((id,i)=>({id,side:'left',x:90,y:190+i*24})),...right.map((id,i)=>({id,side:'right',x:310,y:190+i*24}))];
  const holes=(col,row)=>({x:540+'abcde'.indexOf(col)*22,y:167+(row-1)*15,id:col+row});
  const wires = [
    {id:'w1',number:1,color:'#db4c49',name:'Power to the knob',pin:'3V-R2',hole:'e5',component:'pot',purpose:'The bottom-right 3V pin supplies 3.3 volts to one outer leg. Connect this only after confirming that your board’s A0 accepts the full 0–3.3 V range.',from:'NodeMCU · bottom-right 3V',to:'Breadboard · e5',linked:'Potentiometer outer leg 1 · a5',detail:'e5 and a5 share a five-hole strip. Never use VIN or VV here. This full-range example needs a verified 3.3 V-compatible A0 input.',route:'right-power'},
    {id:'w2',number:2,color:'#8058ca',name:'Read the knob',pin:'A0',hole:'e7',component:'pot',purpose:'A0 reads the changing voltage from the middle leg (the wiper). A0 is the top-left pin in the shown orientation.',from:'NodeMCU · A0',to:'Breadboard · e7',linked:'Potentiometer middle leg 2 · a7',detail:'e7 and a7 share a strip. The bare ESP8266 analog input is limited to 1 V; some development boards add a divider. This drawing does not verify your board’s 0–3.3 V input range. Verify your exact board before powering this example.',route:'left-top'},
    {id:'w3',number:3,color:'#40525c',name:'Knob ground',pin:'G-R1',hole:'e9',component:'pot',purpose:'G means ground: the shared return connection. This wire uses the right-side G between 3V and D5.',from:'NodeMCU · right G above D5',to:'Breadboard · e9',linked:'Potentiometer outer leg 3 · a9',detail:'e9 and a9 share a strip. Swapping only the two outer legs reverses which turning direction increases the reading.',route:'right-ground'},
    {id:'w4',number:4,color:'#e18a2f',name:'LED signal',pin:'D5',hole:'e18',component:'led',purpose:'D5 (GPIO14) drives the LED through the 220 Ω resistor. The resistor limits the current.',from:'NodeMCU · D5 / GPIO14',to:'Breadboard · e18',linked:'Resistor: b18 → b23 · LED long leg: a23',detail:'e18 connects to resistor leg b18. Its other leg at b23 shares a strip with the LED’s long leg at a23. Keep the resistor in series.',route:'right-led'},
    {id:'w5',number:5,color:'#40525c',name:'LED ground',pin:'G-L3',hole:'e25',component:'led',purpose:'The LED’s short leg returns to G, completing the circuit. Use the left-side G directly above VIN.',from:'NodeMCU · left G above VIN',to:'Breadboard · e25',linked:'LED short leg (cathode) · a25',detail:'e25 and a25 share a strip. The short leg, usually beside the LED’s flat edge, goes to ground. The LED’s legs must be in separate strips.',route:'left-ground'}
  ];
  const components=[{id:'board',icon:'▦',title:'NodeMCU V3',sub:'ESP8266 · soldered pins',wires:['w1','w2','w3','w4','w5']},{id:'pot',icon:'◉',title:'Potentiometer',sub:'10 kΩ · three legs',wires:['w1','w2','w3']},{id:'led',icon:'♧',title:'5 mm LED',sub:'Long leg + · short leg −',wires:['w4','w5']},{id:'resistor',icon:'⌁',title:'Resistor',sub:'220 Ω · limits current',wires:['w4','w5']},{id:'breadboard',icon:'▤',title:'Breadboard',sub:'Holes joined in groups of five',wires:['w1','w2','w3','w4','w5']}];
  const pinLabel=id=>id.startsWith('G-')?'G':id.startsWith('3V-')?'3V':id;
  const pinById=id=>pins.find(p=>p.id===id);
  function holeById(id){const m=/^([a-e])(\d+)$/.exec(id);return m?holes(m[1],Number(m[2])):null;}
  function jumperType(header){return header==='female'?'mm':header==='male'?'mf':null;}
  function compatibility(s){
    if(s.board!=='esp8266')return {level:'blocked',title:'This guide uses the shown NodeMCU V3 layout.',message:'Another board, including an ESP32, needs a different pin map. Do not copy these physical positions onto it.'};
    if(s.header==='bare')return {level:'blocked',title:'Headers must be soldered first.',message:'Bare holes are not sockets. If metal pins are already soldered in place, select the male-header option instead.'};
    if(s.pot==='tabs')return {level:'blocked',title:'Check the potentiometer mounting.',message:'Flat lugs need suitable soldered leads or an adapter. Modules can have a different pin order. Do not force them into this example’s holes.'};
    const needed=jumperType(s.header);
    if(needed&&s.jumper!=='unknown'&&s.jumper!=='mixed'&&s.jumper!==needed)return {level:'blocked',title:'These jumper ends do not fit the shown layout.',message:needed==='mf'?'The board sits beside the breadboard here. Use five male–female jumpers: socket on each board pin, metal tip in each breadboard hole. Male–male jumpers cannot fit onto male board pins.':'Soldered female board sockets need male–male jumpers for this beside-the-breadboard layout.'};
    if(s.adc==='range1')return {level:'blocked',title:'This A0 range needs a revised circuit.',message:'Do not power the potentiometer as drawn. An input limited to 1 V or less than 3.3 V needs a correctly designed divider or a different supply arrangement.'};
    if(s.adc!=='range33')return {level:'pending',title:'Confirm the A0 voltage range before power.',message:'Check the exact board’s documentation or ask your instructor to verify that its A0 pin accepts 0–3.3 V. The bare ESP8266 input accepts only 0–1 V.'};
    if(!s.labels||!needed||s.jumper==='unknown'||s.pot==='unknown')return {level:'pending',title:'Check the remaining hardware details.',message:'Confirm the printed labels, header shape, jumper ends and potentiometer lead spacing. The drawing is a placement example until they match.'};
    return {level:'ready',title:'Your confirmed setup fits this example.',message:`Use five ${needed==='mf'?'male–female':'male–male'} jumpers. Keep USB unplugged while wiring.`};
  }
  const digital={D0:16,D1:5,D2:4,D3:0,D4:2,D5:14,D6:12,D7:13,D8:15};
  function pinInfo(id){
    if(id==='A0')return 'A0 reads the potentiometer’s middle leg. Verify the board-level input voltage range first: this example can reach 3.3 V, while the bare ESP8266 ADC accepts only 1 V.';
    if(id==='D5')return 'D5 is GPIO14. A matching ESP8266 program uses PWM here to vary the LED brightness. Connect it through the 220 Ω resistor.';
    if(id.startsWith('G-'))return 'G is ground, the shared return. These G pins connect inside the board. The example uses two different G pins so each jumper has its own connection.';
    if(id.startsWith('3V-'))return '3V is the board’s regulated 3.3 V supply, not a signal pin. The example uses the bottom-right one for the potentiometer, conditional on A0 being verified for 0–3.3 V.';
    if(['VIN','VV'].includes(id))return 'This is a board power connection and is unused here. Do not send VIN / 5 V to A0 or the potentiometer in this circuit.';
    if(['S3','S2','S1','SC','S0','SK'].includes(id))return 'This pin belongs to the flash-memory connections. Leave it unconnected in this exercise.';
    if(['EN','RST'].includes(id))return 'This controls chip enable or reset. It is unused in this circuit; leave it unconnected.';
    if(['RX','TX'].includes(id))return 'This is used for serial communication and programming. Leave it unconnected in this exercise.';
    return `${id} is GPIO${digital[id]}. It is unused in this exercise.`+(['D3','D4','D8'].includes(id)?' Its voltage can affect boot startup; leave it unconnected.':' Leave it unconnected.');
  }
  const model={pins,wires,components,pinLabel,pinById,holeById,jumperType,compatibility,pinInfo};
  root.Circuit=model;if(typeof module!=='undefined')module.exports=model;
})(typeof window!=='undefined'?window:globalThis);
