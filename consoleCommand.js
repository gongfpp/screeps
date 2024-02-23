/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('consoleCommand');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    // create Attacker 
    Game.spawns['Spawn1'].spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE] ,'attacker'+Game.time,{memory: {role: 'attacker', targetRoomId:'E54N51'}}),
    // create Worker 
    Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE]
                ,'worker'+Game.time
                ,{memory: {role: 'worker', targetRoomId:'E54N51'}}),
                
    //supporter   
    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,WORK,CARRY,MOVE,MOVE,MOVE]
                ,'supporter'+Game.time
                ,{memory: {role: 'supporter', targetRoomId:'E54N51'}}),
};