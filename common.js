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
    periodCheck: function () {
        if (Game.time % constant.SHORT_PERIROD_TICKS == 0) {
            const room = Game.rooms[constant.TARGET_ROOM_ID];
            if (!room) {
                console.log("目标房间未找到");
                return;
            }

            // 基本信息
            const energyInfo = `能量: ${room.energyAvailable}/${room.energyCapacityAvailable}`;
            const constructionSitesCount = `建筑工地数量: ${room.find(FIND_MY_CONSTRUCTION_SITES).length}`;
            const controllerInfo = `控制器等级: ${room.controller ? room.controller.level : 'N/A'}`;
            const controllerProgress = `控制器升级进度: ${room.controller.progress}/${room.controller.progressTotal}`;

            // Creep 信息
            const creeps = room.find(FIND_MY_CREEPS);
            const creepTypesCount = creeps.reduce((acc, creep) => {
                const role = creep.memory.role;
                acc[role] = (acc[role] || 0) + 1;
                return acc;
            }, {});
            const creepInfo = `Creep 数量: ${creeps.length} : ${JSON.stringify(creepTypesCount)}`;
            const creepTTL = creeps.map(creep => `${creep.name} TTL: ${creep.ticksToLive}`).join(", ");

            // 防御信息
            const towers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
            const towerEnergyInfo = towers.map((tower, index) => `Tower ${index + 1} 能量: ${tower.store[RESOURCE_ENERGY]}/${tower.store.getCapacity(RESOURCE_ENERGY)}`).join(", ");

            // 容器信息
            const containers = room.find(FIND_STRUCTURES, {
                filter: (s) => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK].includes(s.structureType)
            });
            const containerInfo = containers.map((container, index) => {
                const type = container.structureType.charAt(0).toUpperCase() + container.structureType.slice(1);
                return `${type} ${index + 1} : ${container.store[RESOURCE_ENERGY]}/${container.store.getCapacity(RESOURCE_ENERGY)}`;
            }).join(", ");

            // 敌人信息
            const hostiles = room.find(FIND_HOSTILE_CREEPS);
            const enemyInfo = `敌人数量: ${hostiles.length}`;

            // 能量源状态
            const sources = room.find(FIND_SOURCES);
            const sourceInfo = sources.map((source, index) => `能量源 ${index + 1}: 剩余能量 ${source.energy}/${source.energyCapacity}, 再生时间 ${source.ticksToRegeneration}`).join("; ");

            // 整合信息输出
            console.log(`[${constant.TARGET_ROOM_ID}] 信息汇总:
            ${energyInfo}
            ${constructionSitesCount}
            ${controllerInfo}
            ${controllerProgress}
            ${creepInfo}
            Creep 生命时间: ${creepTTL}
            ${towerEnergyInfo ? `防御塔信息: ${towerEnergyInfo}` : ''}
            容器信息: ${containerInfo}
            ${enemyInfo}
            ${sourceInfo}
        `);
        }
    },

    // periodCheck: function () {
    //     if (Game.time % constant.SHORT_PERIROD_TICKS == 0) {
    //         const room = Game.rooms[constant.TARGET_ROOM_ID];
    //         if (!room) {
    //             console.log("目标房间未找到");
    //             return;
    //         }

    //         // 基本信息
    //         const energyInfo = `能量: ${room.energyAvailable}/${room.energyCapacityAvailable}`;
    //         const constructionSitesCount = `建筑工地数量: ${room.find(FIND_MY_CONSTRUCTION_SITES).length}`;
    //         const controllerInfo = `控制器等级: ${room.controller ? room.controller.level : 'N/A'}`;
    //         const controllerProgress = `控制器升级进度: ${room.controller.progress}/${room.controller.progressTotal}`;

    //         // Creep 信息
    //         const creeps = room.find(FIND_MY_CREEPS);
    //         const creepTypesCount = creeps.reduce((acc, creep) => {
    //             const role = creep.memory.role;
    //             acc[role] = (acc[role] || 0) + 1;
    //             return acc;
    //         }, {});
    //         const creepInfo = `Creep 数量: ${creeps.length}, 各类型 Creep 数量: ${JSON.stringify(creepTypesCount)}`;
    //         //各类型creep bodypart消耗能量数量
    //         const creepBodyPartEnergy = creeps.reduce((acc, creep) => {
    //             const bodyParts = creep.body;
    //             bodyParts.forEach((part) => {
    //                 acc[part.type] = (acc[part.type] || 0) + part.cost;
    //             });
    //             return acc;
    //         }, {});

    //         // 防御信息
    //         const towers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
    //         const towerEnergyInfo = towers.map((tower, index) => `Tower ${index + 1} 能量: ${tower.store[RESOURCE_ENERGY]}/${tower.store.getCapacity(RESOURCE_ENERGY)}`).join(", ");

    //         // 敌人信息
    //         const hostiles = room.find(FIND_HOSTILE_CREEPS);
    //         const enemyInfo = `敌人数量: ${hostiles.length}`;

    //         // 墙壁和城墙的平均耐久度
    //         const defenses = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART });
    //         const totalHits = defenses.reduce((sum, s) => sum + s.hits, 0);
    //         const avgDefenseHits = defenses.length > 0 ? Math.round(totalHits / defenses.length) : 0;
    //         const defenseHitsInfo = `墙壁/城墙平均耐久度: ${avgDefenseHits}`;

    //         //房间能量来源状态
    //         const sources = room.find(FIND_SOURCES);
    //         const sourceInfo = sources.map((source, index) => `能量源 ${index + 1}: 剩余能量 ${source.energy}/${source.energyCapacity}, 再生时间 ${source.ticksToRegeneration}`).join("; ");

    //         //constant



    //         // 整合信息输出
    //         console.log(`[${constant.TARGET_ROOM_ID}] 信息汇总:
    //             ${energyInfo}
    //             ${constructionSitesCount}
    //             ${controllerInfo}
    //             ${creepInfo}
    //             ${towerEnergyInfo ? `防御塔信息: ${towerEnergyInfo}` : ''}
    //             ${enemyInfo}
    //             ${defenseHitsInfo}
    //             ${sourceInfo}
    //             ${controllerProgress}
    //         `);
    //     }
    // },
    bodyPartCount: function (creep, bodyPartType) {
        return creep.body.filter(part => part.type === bodyPartType).length;
    },
    countMiningPositions: function (source) {
        // 获取Source周围的地形数据
        let terrain = source.room.lookForAtArea(
            LOOK_TERRAIN,
            source.pos.y - 1,
            source.pos.x - 1,
            source.pos.y + 1,
            source.pos.x + 1,
            true
        );

        // 计算可以用来采矿的位置数量
        let count = 0;
        for (let tile of terrain) {
            if (tile.terrain === 'plain' || tile.terrain === 'swamp') {
                count++;
            }
        }

        // 减去source本身所占的位置
        return count - 1;
    }

};