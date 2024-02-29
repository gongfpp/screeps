var common = require('common');
var elegant = require('elegant.work');
var struct = require('structure');
var battle = require('battlefield');
var creepManager = require('creepManager');

function func() {
    // console.log(`testFunction is running  :${Game.spawns[common.SPAWN_HOME].room.find(FIND_MY_CREEPS).length}`);
    // mySpawn.createCreep('attacker');

}

module.exports.loop = function () {
    //TODO : 
    // 战斗模组
    // 存特殊礦
    // 佔基地creep
    // 拿下隔壁
    // 災后重建harvester改造
    // 建築自動平衡優化

    func();
    creepManager.generateCreeps();
    creepManager.clearDeadMemory();
    elegant.creepsDo();
    struct.structuresDo();
    battle.battleDo();
    common.periodCheck();

}


