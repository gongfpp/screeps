var common = require('common');
var elegant = require('elegant.work');
var struct = require('structure');
var battle = require('battlefield');


function func() {
    // console.log(`testFunction is running  :${Game.spawns[common.SPAWN_HOME].room.find(FIND_MY_CREEPS).length}`);
    // mySpawn.createCreep('attacker');

}

module.exports.loop = function () {
    //TODO : 
    // 战斗模组
    // 存特殊礦
    // 

    func();
    common.commonCheck();
    common.periodCheck();
    common.generateCreeps();
    common.clearDeadMemory();
    elegant.creepsDo();
    struct.structuresDo();
    battle.battleDo();

}


