/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('common');
 * mod.thing == 'a thing'; // true
 */
var constant = require('constant');

module.exports = {
    
    // nowSpawn : Game.spawns[this.SPAWN_HOME],
    commonCheck : function(){
        
        //Fight If Enemy Come
        if(Game.spawns[constant.SPAWN_HOME].room.find(FIND_HOSTILE_CREEPS).length > 0){
            constant.IsUnderAttack++;
            this.createAttacker('attacker');
            console.log(`[commonCheck create attacker] constant.IsUnderAttack: ${constant.IsUnderAttack}`);
        }else{
            constant.IsUnderAttack = 0;
        }
        
        
        //Activate Safe Mode if Cant Win
        if(Game.spawns[constant.SPAWN_HOME].hits < Game.spawns[constant.SPAWN_HOME].hitsMax/2
        || constant.IsUnderAttack > 500
        || Game.spawns[constant.SPAWN_HOME].room.find(FIND_MY_CREEPS).length < 2
        || Game.spawns[constant.SPAWN_HOME].room.controller.hits < Game.spawns[constant.SPAWN_HOME].room.controller.hitsMax/2){
            Game.spawns[constant.SPAWN_HOME].room.controller.activateSafeMode();
            console.log(`[SafeMode Activated] TICK:${Game.time}`);
        }
        
        
    },
    generateCreeps:function(){
        //maybe the whole economy is destroyed , create base worker to rebuild
        if(Game.spawns[constant.SPAWN_HOME].room.find(FIND_MY_CREEPS).length < 2){
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE]
                ,'harvester'+Game.time
                ,{memory: {role: 'harvester', targetRoomId:'E54N51'}});
            return true;
        }
        
        const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        const supporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'supporter');
        const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        const builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        const repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
        const xiangzis = _.filter(Game.creeps, (creep) => creep.memory.role == 'xiangzi');
        // const 
        
        if(harvesters.length < constant.HAVERSTER_MAX_NUM ){
            this.createHarvesterCreep();
            return true;
            // console.log(`[common] harvesters num : ${harvesters.length}`);
        }
        
        if(supporters.length < constant.SUPPORTER_MAX_NUM){
           this.createGeneralWorker('supporter');
        //   console.log(`[common] supporters num : ${supporters.length}`);
            return true;   
        }
        
        if(upgraders.length < constant.UPGRADER_MAX_NUM){
            this.createGeneralWorker('upgrader');
            return true;
        }
        
        if(builders.length < constant.BUILDER_MAX_NUM){
            this.createGeneralWorker('builder');
            return true;
        }
        if(xiangzis.length < constant.XIANGZI_MAX_NUM){
            this.createGeneralWorker('xiangzi');
            return true;
        }
        

        
    },
    createGeneralWorker:function(roleName){
        Game.spawns[constant.SPAWN_HOME].spawnCreep([
             WORK,CARRY,MOVE,
             WORK,CARRY,MOVE,
             WORK,CARRY,MOVE,
             WORK,CARRY,MOVE
             ]
                , roleName+Game.time
                ,{memory: {role: roleName, targetRoomId: constant.TARGET_ROOM_ID}});
    },
    createAttacker:function(){
        Game.spawns['Spawn1'].spawnCreep([
          TOUGH,TOUGH,TOUGH,
          ATTACK,ATTACK,ATTACK,
          MOVE,MOVE,MOVE
          ]
            ,'attacker'+Game.time
            ,{memory: {
                role: 'attacker'
        }});  
    },
    createHarvesterCreep : function(){
        let harvestersPerSource={};
        let sources = Game.spawns[constant.SPAWN_HOME].room.find(FIND_SOURCES);
        for(let s of sources) {
            harvestersPerSource[s.id] = _.filter(Game.creeps, (c) =>{
                c.memory.targetSourceId == s.id   
            }).length;
        }
        
        let targetSourceId = sources[0].id;
        let minSourceWorkerNum = Infinity;
        
        for(let sourceId in harvestersPerSource){
            if(harvestersPerSource[sourceId] < minSourceWorkerNum){
                minSourceWorkerNum = harvestersPerSource[sourceId];
                targetSourceId = sourceId;
            }
        }
        let ret = Game.spawns[constant.SPAWN_HOME].spawnCreep(
                [WORK,CARRY,MOVE, //200 for each row
                 WORK,CARRY,MOVE,
                 WORK,CARRY,MOVE,
                 WORK,CARRY,MOVE
                 
                 ]
                ,'harvester'+Game.time
                ,{memory: {
                    role: 'harvester', 
                    targetRoomId:constant.TARGET_ROOM_ID,
                    targetSourceId : targetSourceId
            }});
            
        if(OK == ret){
            console.log('[generateHarvest]:harvester source target:' , targetSourceId);
        }
    },
    clearDeadMemory:function(){
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },
    periodCheck:function(){
        //TODO : source worker dynamic balance
        if(Game.time % constant.MID_PERIROD_TICKS == 0) {
            const room = Game.rooms[constant.TARGET_ROOM_ID];
            if (!room) {
                console.log("目标房间未找到");
                return;
            }
    
            // 基本信息
            const energyInfo = `能量: ${room.energyAvailable}/${room.energyCapacityAvailable}`;
            const constructionSitesCount = `建筑工地数量: ${room.find(FIND_MY_CONSTRUCTION_SITES).length}`;
            const controllerInfo = `控制器等级: ${room.controller ? room.controller.level : 'N/A'}`;
        
            // Creep 信息
            const creeps = room.find(FIND_MY_CREEPS);
            const creepTypesCount = creeps.reduce((acc, creep) => {
                const role = creep.memory.role;
                acc[role] = (acc[role] || 0) + 1;
                return acc;
            }, {});
            const creepInfo = `Creep 数量: ${creeps.length}, 各类型 Creep 数量: ${JSON.stringify(creepTypesCount)}`;
        
            // 防御信息
            const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            const towerEnergyInfo = towers.map((tower, index) => `Tower ${index + 1} 能量: ${tower.store[RESOURCE_ENERGY]}/${tower.store.getCapacity(RESOURCE_ENERGY)}`).join(", ");
        
            // 敌人信息
            const hostiles = room.find(FIND_HOSTILE_CREEPS);
            const enemyInfo = `敌人数量: ${hostiles.length}`;
        
            // 墙壁和城墙的平均耐久度
            const defenses = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART});
            const totalHits = defenses.reduce((sum, s) => sum + s.hits, 0);
            const avgDefenseHits = defenses.length > 0 ? Math.round(totalHits / defenses.length) : 0;
            const defenseHitsInfo = `墙壁/城墙平均耐久度: ${avgDefenseHits}`;
            
            //房间能量来源状态
            const sources = room.find(FIND_SOURCES);
            const sourceInfo = sources.map((source, index) => `能量源 ${index + 1}: 剩余能量 ${source.energy}/${source.energyCapacity}, 再生时间 ${source.ticksToRegeneration}`).join("; ");


            // 整合信息输出
            console.log(`[${constant.TARGET_ROOM_ID}] 信息汇总:
                ${energyInfo}
                ${constructionSitesCount}
                ${controllerInfo}
                ${creepInfo}
                ${towerEnergyInfo ? `防御塔信息: ${towerEnergyInfo}` : ''}
                ${enemyInfo}
                ${defenseHitsInfo}
                ${sourceInfo}
            `);
        }
        // if(Game.time%constant.LONG_PERIROD_TICKS == 0 ){
        //     console.log(`[Long Period Check] `);
        // }
    }
};