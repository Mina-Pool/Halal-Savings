export const STAKING_ABI = [
{ name:"stake", type:"function", stateMutability:"nonpayable", inputs:[{name:"amt",type:"uint256"}], outputs:[] },
{ name:"withdraw", type:"function", stateMutability:"nonpayable", inputs:[{name:"amt",type:"uint256"}], outputs:[] },
{ name:"getReward", type:"function", stateMutability:"nonpayable", inputs:[], outputs:[] },
{ name:"balanceOf", type:"function", stateMutability:"view", inputs:[{name:"a",type:"address"}], outputs:[{type:"uint256"}] },
{ name:"earned", type:"function", stateMutability:"view", inputs:[{name:"a",type:"address"}], outputs:[{type:"uint256"}] },
];