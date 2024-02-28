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
    commonCheck: function () {

        //Fight If Enemy Come
        if (Game.spawns[constant.SPAWN_HOME].room.find(FIND_HOSTILE_CREEPS).length > 0) {
            constant.IsUnderAttack++;
            console.log(`[commonCheck create attacker] constant.IsUnderAttack: ${constant.IsUnderAttack}`);
        } else {
            constant.IsUnderAttack = 0;
        }


        if (constant.IsUnderAttack > 30 && !Game.rooms[constant.TARGET_ROOM_ID].controller.safeMode) {
            constant.IS_HOME_PEACE = false;

            const defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
            if (defenders.length < constant.DEFENDER_MAX_NUM) {
                this.createBattler('defender');

            }
        }

        //Activate Safe Mode if Cant Win
        if (Game.spawns[constant.SPAWN_HOME].hits < Game.spawns[constant.SPAWN_HOME].hitsMax / 2
            || constant.IsUnderAttack > 500
            || Game.spawns[constant.SPAWN_HOME].room.find(FIND_MY_CREEPS).length < 2
            || Game.spawns[constant.SPAWN_HOME].room.controller.hits < Game.spawns[constant.SPAWN_HOME].room.controller.hitsMax / 2) {
            Game.spawns[constant.SPAWN_HOME].room.controller.activateSafeMode();
            constant.IS_HOME_PEACE = false;
            console.log(`[SafeMode Activated] TICK:${Game.time}`);
        }


    },
    generateCreeps: function () {
        //用于灾后重建的harvester
        if (!constant.IS_HOME_PEACE && _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length < 4) {
            this.createHarvesterCreep([WORK, WORK, CARRY, MOVE]);
            return true;
        }

        //creeps by type
        const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        const supporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'supporter');
        const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        const builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        const repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
        const xiangzis = _.filter(Game.creeps, (creep) => creep.memory.role == 'xiangzi');
        const constructionSites = Game.rooms[constant.TARGET_ROOM_ID].find(FIND_MY_CONSTRUCTION_SITES);


        if (harvesters.length < constant.HAVERSTER_MAX_NUM) {
            this.createHarvesterCreep([
                WORK, WORK, WORK, WORK, WORK, WORK,
                CARRY,
                MOVE, MOVE, MOVE
                //cost 800
            ]);
            return true;
        }
        if (xiangzis.length < constant.XIANGZI_MAX_NUM && constant.IS_HOME_PEACE) {
            this.createLittleWorker('xiangzi');
            return true;
        }
        if (supporters.length < constant.SUPPORTER_MAX_NUM) {
            this.createGeneralCarryer('supporter');
            return true;
        }

        if (upgraders.length < constant.UPGRADER_MAX_NUM) {
            this.createStandWorker('upgrader');
            return true;
        }

        if (constructionSites.length > 0 && builders.length < constant.BUILDER_MAX_NUM) {
            this.createGeneralCarryer('builder');
            return true;
        }

        if (constant.IsUnderAttack == 0) {
            constant.IS_HOME_PEACE = true;
        }
    },
    createLittleWorker: function (roleName) {
        Game.spawns[constant.SPAWN_HOME].spawnCreep([
            WORK, CARRY, MOVE,
            WORK, CARRY, MOVE
            //sum = 400
        ]
            , roleName + Game.time
            , { memory: { role: roleName, targetRoomId: constant.TARGET_ROOM_ID } });
    },
    createStandWorker: function (roleName) {
        Game.spawns[constant.SPAWN_HOME].spawnCreep([
            WORK, WORK, CARRY, MOVE,
            WORK, WORK, CARRY, MOVE,
            WORK, WORK, CARRY, MOVE,
            WORK, WORK, CARRY, MOVE
            //cost :1200
        ]
            , roleName + Game.time
            , { memory: { role: roleName, targetRoomId: constant.TARGET_ROOM_ID } });
    },
    createGeneralCarryer: function (roleName) {
        Game.spawns[constant.SPAWN_HOME].spawnCreep([
            WORK, CARRY, MOVE,
            WORK, CARRY, MOVE,
            WORK, CARRY, MOVE,
            WORK, CARRY, MOVE
            //cost : 800
        ]
            , roleName + Game.time
            , { memory: { role: roleName, targetRoomId: constant.TARGET_ROOM_ID } });
    },
    // 通用单位
    createGeneralWorker: function (roleName) {
        Game.spawns[constant.SPAWN_HOME].spawnCreep([
            WORK, WORK, WORK, WORK, WORK,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE
            //cost 1000
        ]
            , roleName + Game.time
            , { memory: { role: roleName, targetRoomId: constant.TARGET_ROOM_ID } });
    },
    createBattler: function (roleName) {
        //cost 420
        Game.spawns['Spawn1'].spawnCreep([
            TOUGH, ATTACK, MOVE,
            TOUGH, ATTACK, MOVE,
            TOUGH, ATTACK, MOVE
        ]
            , roleName + Game.time
            , {
                memory: {
                    role: roleName
                }
            });
    },
    createAttacker: function () {
        //cost 420
        Game.spawns['Spawn1'].spawnCreep([
            TOUGH, ATTACK, MOVE,
            TOUGH, ATTACK, MOVE,
            TOUGH, ATTACK, MOVE
        ]
            , 'attacker' + Game.time
            , {
                memory: {
                    role: 'attacker'
                }
            });
    },
    createHarvesterCreep: function (bodyParts) {
        if (!bodyParts) {
            bodyParts = [
                WORK, WORK, WORK, WORK, WORK, WORK,
                CARRY,
                MOVE, MOVE, MOVE
                //cost 800
            ];
        }
        let harvestersPerSource = {};
        let sources = Game.spawns[constant.SPAWN_HOME].room.find(FIND_SOURCES);
        for (let s of sources) {
            harvestersPerSource[s.id] = _.filter(Game.creeps, (c) => {
                return c.memory.targetSourceId == s.id
            }).length;
        }
        let targetSourceId = sources[0].id;
        let targetSourceWorkerNum = Infinity;

        for (let sourceId in harvestersPerSource) {
            if (harvestersPerSource[sourceId] < targetSourceWorkerNum) {
                targetSourceWorkerNum = harvestersPerSource[sourceId];
                targetSourceId = sourceId;
            }
        }
        let ret = Game.spawns[constant.SPAWN_HOME].spawnCreep(bodyParts
            , 'harvester' + Game.time
            , { memory: { role: 'harvester', targetRoomId: constant.TARGET_ROOM_ID, targetSourceId: targetSourceId } });

        if (OK == ret) {
            console.log('[generateHarvest]:harvester source target:', targetSourceId);
        }
    },
    clearDeadMemory: function () {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },
    periodCheck: function () {
        if (Game.time % constant.MID_PERIROD_TICKS == 0) {
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
            //各类型creep bodypart消耗能量数量
            const creepBodyPartEnergy = creeps.reduce((acc, creep) => {
                const bodyParts = creep.body;
                bodyParts.forEach((part) => {
                    acc[part.type] = (acc[part.type] || 0) + part.cost;
                });
                return acc;
            }, {});

            // 防御信息
            const towers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
            const towerEnergyInfo = towers.map((tower, index) => `Tower ${index + 1} 能量: ${tower.store[RESOURCE_ENERGY]}/${tower.store.getCapacity(RESOURCE_ENERGY)}`).join(", ");

            // 敌人信息
            const hostiles = room.find(FIND_HOSTILE_CREEPS);
            const enemyInfo = `敌人数量: ${hostiles.length}`;

            // 墙壁和城墙的平均耐久度
            const defenses = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART });
            const totalHits = defenses.reduce((sum, s) => sum + s.hits, 0);
            const avgDefenseHits = defenses.length > 0 ? Math.round(totalHits / defenses.length) : 0;
            const defenseHitsInfo = `墙壁/城墙平均耐久度: ${avgDefenseHits}`;

            //房间能量来源状态
            const sources = room.find(FIND_SOURCES);
            const sourceInfo = sources.map((source, index) => `能量源 ${index + 1}: 剩余能量 ${source.energy}/${source.energyCapacity}, 再生时间 ${source.ticksToRegeneration}`).join("; ");

            //constant



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