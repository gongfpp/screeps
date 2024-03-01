var common = require('common');
var elegant = require('elegant.work');
var struct = require('structure');
var battle = require('battlefield');
var creepManager = require('creepManager');

const CONTAINER_FROM_GROUP = ['65e0c8369cf7c4914b5873e0', '65e0dea3decfd588a3da0a64'];


function func() {
    // const fromContainers = CONTAINER_FROM_GROUP.map(id => Game.getObjectById(id))
    //     .filter(container => container && container.store.getUsedCapacity(RESOURCE_ENERGY) > 0);
    // // const fromContainer = creep.pos.findClosestByPath(fromContainers);
    // console.log(JSON.stringify(fromContainers));
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
    created = creepManager.generateCreeps();
    if(created){
        console.log('created :'+created);
    }
    creepManager.clearDeadMemory();
    elegant.creepsDo();
    struct.structuresDo();
    battle.battleDo();
    common.periodCheck();

}


