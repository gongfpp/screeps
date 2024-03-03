/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('elegant.work');
 * mod.thing == 'a thing'; // true
 */

//use this module to work with singing(saying) target and drawing the path line
//find way then moveTo itself !  with dynamic balance between work places ,no need to handle moveTo()

var constant = require('constant');
const common = require('./common');
const creepManager = require('./creepManager');
const CONTAINER_FROM_GROUP_IDs = ['65e0c8369cf7c4914b5873e0', '65e343696f0cfab7c352b9c3', '65e3edf1c3a96b31add8dd13'];
const CONTAINER_TO_GROUP_IDs = ['65e0bc96713cf61f6156028b', '65e1e578372635ea22c045c0'];


module.exports = {
    creepsDo: function () {
        var did;
        //creeps do
        for (const idx in Game.creeps) {
            const creep = Game.creeps[idx];
            // common prebehavior
            if (this.pickupByChance(creep)) {
                return 'pickupByChance';
            }


            //specific by role 
            if (creep.memory.role == 'harvester') {
                did = this.harvesterDo(creep);
            } else if (creep.memory.role == 'supporter') {
                did = this.supporterDo(creep);
            } else if (creep.memory.role == 'upgrader') {
                this.upgraderDo(creep);
            } else if (creep.memory.role == 'builder') {
                this.builderDo(creep);
            } else if (creep.memory.role == 'xiangzi') {
                did = this.xiangziDo(creep);
                // console.log(`${creep.name} do ${did}`);
            } else if (creep.memory.role == 'attacker') {
                this.attackerDo(creep);
            } else if (creep.memory.role == 'defender') {
                this.attackerDo(creep);
            } else if (creep.memory.role == 'baseHarvester') {
                this.baseHarvesterDo(creep);
            } else if (creep.memory.role == 'baseSupporter') {
                this.supporterDo(creep);
            } else if (creep.memory.role == 'baseBuilder') {
                this.builderDo(creep);
            }

            //common suffixbehavior
            // console.log(`${creep.name} do ${did}`);


        }
    },
    baseHarvesterDo: function (creep) {

        if (this.goHarvest(creep)) {
            return 'goHarvest';
        }
        if (this.goStoreAny(creep, 3)) {
            return 'goStoreImportant';
        }

        // if (this.goRepairRanged(creep, 2)) {
        //     return 'goRepairRanged';
        // }
        // if (this.goBuild(creep, 5)) {
        //     return 'goBuild';
        // }
        // if (this.upgraderDo(creep)) {
        //     return 'supporterDo';
        // }

        this.iAmLazyDog(creep);
        return false;
    },
    harvesterDo: function (creep) {
        if (this.goHarvest(creep)) {
            return 'goHarvest';
        }
        if (!constant.IS_HOME_PEACE && this.goStoreImportant(creep, 3)) {
            return 'goStoreImportant';
        }
        if (this.goStoreAny(creep, 3)) {
            return 'goStoreContainers';
        }
        if (this.goUpgrade(creep)) {
            return 'goUpgrade';
        }

        this.iAmLazyDog(creep);
        return false;
    },
    supporterDo: function (creep) {
        if (this.goStoreImportant(creep, 10)) {
            return 'goStoreExtensions';
        }
        if (this.goRepairRanged(creep, 3)) {
            return 'goRepairRanged';
        }
        if (this.goBuild(creep, 5)) {
            return 'goBuild';
        }
        if (this.goRepairBelowRate(creep,0.8)) {
            return 'goRepair';
        }
        if (this.goUpgrade(creep)) {
            return 'goUpgrade';
        }
        if (this.goTakeResource(creep, 20)) {
            return 'goTakeResource';
        }
        if (this.goWithdrawEnergy(creep)) {
            return 'goWithdrawEnergy';
        }
        this.iAmLazyDog(creep);
        return false;
    },
    upgraderDo: function (creep) {
        if (this.goStoreImportant(creep, 2)) {
            return 'goStoreExtensions';
        }
        if (this.goRepairRanged(creep, 3)) {
            return 'goRepairRanged';
        }
        if (this.goUpgrade(creep)) {
            return 'goUpgrade';
        }
        if (this.goWithdrawEnergy(creep)) {
            return 'goWithdrawEnergy';
        }

        this.iAmLazyDog(creep);
        return false;
    },
    builderDo: function (creep) {
        if (this.goWithdrawEnergy(creep)) {
            return 'goWithdrawEnergy';
        }
        if (this.goFlagRally(creep, 'build')) {
            return 'goFlagRally';
        }
        if (this.goBuild(creep)) {
            return 'goBuild';
        }
        return this.supporterDo(creep);
    },
    xiangziDo: function (creep) {
        if (this.goTakeResource(creep, 2)) {
            return 'goTakeResource';
        }
        if (this.goFillLink(creep)) {
            return 'goFillLink';
        }
        if (this.goStoreImportant(creep, 6)) {
            return 'goStoreExtensions';
        }
        if (this.goRepairRanged(creep, 3)) {
            return 'goRepairRanged';
        }
        if (this.goBuild(creep, 6)) {
            return 'goBuild';
        }
        if (this.goHaulContainers(creep, CONTAINER_FROM_GROUP_IDs, CONTAINER_TO_GROUP_IDs)) {
            return 'goHaulContainers';
        }
        if (this.goWithdrawFromContainer(creep, 4)) {
            return 'goWithdrawFromContainer';
        }
        // if (this.goStoreStorage(creep, 3)) {
        //     return 'goStoreStorage';
        // }
        if (this.goWithdrawFromStorage(creep)) {
            return 'goWithdrawFromStorage';
        }
        if (this.goFlagRally(creep, 'xiangzi')) {
            return 'goFlagRally';
        }

        this.iAmLazyDog(creep);
        // return this.upgraderDo(creep);

    },
    attackerDo: function (creep) {
        const targets = creep.room.find(FIND_HOSTILE_CREEPS);
        if (targets.length) {
            if (creep.attack(targets[0]) == ERR_NOT_IN_RANGE || creep.rangedAttack(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ff0000' } });
                creep.say('⚔️' + 'KILL!');
            }

            return true;
        }

        //attack tower if exist
        this.goFlagRally(creep, 'attack');

        //patrol if no target to fight
        this.iAmLazyDog(creep);
        return false;
    },
    goFlagRally: function (creep, flagName) {
        const flag = Game.flags[flagName];
        if (!flag) {
            return false;
        }
        if (creep.pos.isEqualTo(flag.pos)) {
            return false;
        }
        creep.moveTo(flag, { visualizePathStyle: { stroke: '#00ff00' } });
        creep.say('Go:' + flagName);
        return true;
    },
    goFillLink: function (creep) {
        const sourceLink = Game.getObjectById(constant.SOURCE_LINK);
        if (creep.store[RESOURCE_ENERGY] < 1) {
            return false;
        }
        if (!sourceLink || sourceLink.store[RESOURCE_ENERGY] == sourceLink.store.getCapacity(RESOURCE_ENERGY)) {
            return false;
        }

        if (creep.transfer(sourceLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sourceLink, { visualizePathStyle: { stroke: '#d174a8' } });
            creep.say('Link!');
            return true;
        }

        // creep.say('Link but '+)
        return true;
        // return 'transfer failed :'+creep.transfer(sourceLink, RESOURCE_ENERGY);
    },
    // goWithdrawFromTargetLink: function (creep) {
    //     // 检查 Creep 的能量状态   TODO put it swap goHarvest();
    //     if (creep.store[RESOURCE_ENERGY] == 0) {
    //         const source = Game.getObjectById(constant.TARGET_LINK);
    //         if (source && source.store[RESOURCE_ENERGY] > 0) {
    //             // 从容器或存储中提取能量
    //             if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    //                 creep.moveTo(source, { visualizePathStyle: { stroke: '#ff5100' } });
    //                 creep.say('Get E');

    //             }
    //             return true;
    //         }
    //         creep.say('No E');

    //         return true;
    //     }

    //     //有能量，不需要去提取能量
    //     return false;
    // },
    goTempHarvest: function (creep, range) {
        const sources = creep.pos.findInRange(FIND_SOURCES, range);
        const source = creep.pos.findClosestByPath(sources);
        if (!source) {
            return false;
        }
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
            creep.say('⛏️Temp');
        }
    },
    goHarvest: function (creep) {

        //收集资源满了
        if (creep.memory.isHarvesting && creep.store.getFreeCapacity() < common.bodyPartCount(creep, WORK) * 2) {
            creep.memory.isHarvesting = false;
            creep.memory.finishedWork = true;
        } else if (!creep.memory.isHarvesting && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            //收集资源空了
            creep.memory.isHarvesting = true;
        }

        if (!creep.memory.isHarvesting) {
            // creep.memory.finishedWork = false;
            return false;
        }
        let target = Game.getObjectById(creep.memory.targetSourceId);
        // if(creep.memory.role == 'baseHarvester'){
        //     target = creep.pos.findClosestByPath(FIND_SOURCES);
        // }

        if (!target || target.energy == 0) {
            creep.say('NO⛏️！');

            // 挖空了就先存一下 倒乾净口袋準備下一波
            this.goStoreAny(creep, 1);

            return true;
        }
        if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } })
            // let path = creep.pos.findPathTo(target);
            // creep.move(path[0].direction,{visualizePathStyle:{stroke:'#ffaa00'}});
            creep.say('⛏️S');
            return true;
        }

        return true;
    },
    goWithdrawFromContainer: function (creep, range) {
        if (typeof range === 'undefined') {
            range = 3;
        }
        if (creep.store[RESOURCE_ENERGY] > 8) {
            //有能量，不需要去提取能量
            return false;
        }
        const sources = creep.pos.findInRange(FIND_STRUCTURES, range, {
            filter: (structure) => {
                return (
                    structure.structureType == STRUCTURE_CONTAINER
                    && structure.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity(RESOURCE_ENERGY)) * 0.8;
            }
        });
        if (sources.length < 1) {
            return false;
        }

        // 从容器或存储中提取能量
        if (creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ff5100' } });
            creep.say('Get E');
        }
        return true;
    },
    goWithdrawFromStorage: function (creep) {
        if (creep.store[RESOURCE_ENERGY] > 0) {
            //有能量，不需要去提取能量
            return false;
        }
        const source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.structureType == STRUCTURE_STORAGE
                    && structure.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity(RESOURCE_ENERGY)) * 0.8;
            }
        });
        if (source) {
            // 从容器或存储中提取能量
            if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ff5100' } });
                creep.say('Get E');

            }
            return true;
        }
        return false;
    },
    goHaulContainers: function (creep, containerFromGroupIDs, containerToGroupIDs) {
        if (creep.memory.isHaulWithdraw && creep.store.getFreeCapacity() < common.bodyPartCount(creep, WORK) * 4) {
            //有能量，不需要去提取能量
            creep.memory.isHaulWithdraw = false;
        } else if (!creep.memory.isHaulWithdraw && creep.store.getUsedCapacity() < common.bodyPartCount(creep, WORK) * 4) {
            creep.memory.isHaulWithdraw = true;
        }


        if (creep.memory.isHaulWithdraw) {
            const fromContainers = containerFromGroupIDs.map(id => Game.getObjectById(id))
                .filter(container => (container && container.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity()
                    && container.store.getUsedCapacity() > container.store.getFreeCapacity()
                    || container && container.structureType == STRUCTURE_STORAGE && container.store.getUsedCapacity() > 1000));
            const fromContainer = creep.pos.findClosestByPath(fromContainers);
            if (fromContainer) {
                // 从容器或存储中提取能量
                if (creep.withdraw(fromContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(fromContainer, { visualizePathStyle: { stroke: '#ff5100' } });
                    creep.say('Haul From');

                }
                return true;
            }

            //no enough energy in containerFromGroups
            return false;
        }

        //no withdraw , go haul to containerToGroup
        // creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        const toContainers = containerToGroupIDs.map(id => Game.getObjectById(id))
            .filter(container => (container && container.store.getFreeCapacity() > creep.store.getUsedCapacity()
                && container.store.getFreeCapacity() > container.store.getUsedCapacity()));
        const toContainer = creep.pos.findClosestByPath(toContainers);
        if (toContainer) {
            if (creep.transfer(toContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(toContainer, { visualizePathStyle: { stroke: '#ff5100' } });
                creep.say('Haul To');
                return true;
            }
            return true;
        }

        return false;
    },
    goWithdrawEnergy: function (creep) {
        if (creep.store[RESOURCE_ENERGY] >= 1) {
            //有能量，不需要去提取能量
            return false;
        }

        // 寻找最近的容器或存储
        const source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER
                    || structure.structureType == STRUCTURE_STORAGE
                    || structure.structureType == STRUCTURE_LINK) &&
                    structure.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity(RESOURCE_ENERGY) * 0.8;
            }
        });
        if (source) {
            // 从容器或存储中提取能量
            if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ff5100' } });
                creep.say('Get E');

            }
            return true;
        }
        return false;
    },

    goBuild: function (creep, range) {
        if (creep.store.getUsedCapacity() < 1) {
            return false;
        }
        if (typeof range === 'undefined') {
            range = 99;
        }

        const targets = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, range);
        const target = creep.pos.findClosestByPath(targets);
        if (!target) {
            return false;
        }

        this.dontBlockTheSource(creep, target);

        if (creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#b88114' } });
            creep.say('🛠️' + target.structureType);
        }
        return true;

    },
    goRepairBelowRate: function (creep,rate) {
        if (creep.store.getUsedCapacity() < 1) {
            return false;
        }
        const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_ROAD
                || s.structureType == STRUCTURE_CONTAINER
                || s.structureType == STRUCTURE_STORAGE
                || s.structureType == STRUCTURE_TOWER
                || s.structureType == STRUCTURE_STORAGE
                // || s.structureType == STRUCTURE_WALL
            ) && s.hits < s.hitsMax * rate
        });
        if (!target) {
            return false;
        }
        this.dontBlockTheSource(creep, target);
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#e63995' } });
            creep.say('Ring!');
            return true;
        }
        return true;
    },
    goRepairRanged: function (creep, range = 3) {
        if (creep.store.getUsedCapacity() < 1) {
            return false;
        }
        const targets = creep.pos.findInRange(FIND_STRUCTURES, range, {
            filter: (s) => (s.structureType == STRUCTURE_ROAD
                || s.structureType == STRUCTURE_CONTAINER
                || s.structureType == STRUCTURE_STORAGE
                || s.structureType == STRUCTURE_TOWER
                // || s.structureType == STRUCTURE_WALL
            ) && s.hits < s.hitsMax
        });

        const target = creep.pos.findClosestByPath(targets);
        // 寻找需要修理的

        if (!target) {
            return false;
        }

        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#e63995' } });
            creep.say('repair:' + range);
            return true;
        }
        creep.say('Ring!');
        // return true;

        return false;
    },
    goStoreImportant: function (creep, range) {
        if (creep.store[RESOURCE_ENERGY] < 1) {
            return false;
        }
        const storeTargets = creep.pos.findInRange(FIND_STRUCTURES, range,
            {
                filter: (structure) => {
                    return (
                        (structure.structureType == STRUCTURE_SPAWN
                            || structure.structureType == STRUCTURE_EXTENSION
                            || structure.structureType == STRUCTURE_TOWER
                        ) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
                }
            })
        if (storeTargets.length > 0) {
            const target = creep.pos.findClosestByPath(storeTargets);
            this.dontBlockTheSource(creep, target);
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#d174a8' } });
                creep.say('	🪕' + 'Store!')
                return true;
            }
            return true;
        }
        return false;
    },
    goStoreAny: function (creep, range) {
        if (creep.store.getUsedCapacity() < 1) {
            return false;
        }
        const storeTargets = creep.pos.findInRange(FIND_STRUCTURES, range, {
            filter: (structure) => {
                return ((
                    structure.structureType == STRUCTURE_CONTAINER
                    || structure.structureType == STRUCTURE_STORAGE
                    || structure.structureType == STRUCTURE_LINK
                    || structure.structureType == STRUCTURE_EXTENSION
                ) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
            }
        });

        if (storeTargets.length > 0) {
            const target = creep.pos.findClosestByPath(storeTargets);
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#d174a8' } });
                creep.say('Store!')
                return true;
            }
            return true;
        }
        return false;
    },
    goStoreStorage: function (creep, range) {
        if (creep.store.getUsedCapacity() < 1) {
            return false;
        }

        const storeTargets = creep.pos.findInRange(FIND_STRUCTURES, range, {
            filter: (structure) => {
                return ((
                    structure.structureType == STRUCTURE_STORAGE)
                    && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
            }
        });

        if (storeTargets.length > 0) {
            const target = creep.pos.findClosestByPath(storeTargets);
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#d174a8' } });
                creep.say('Store!');
                return true;
            }
            return true;
        }
        return false;
    },
    pickupByChance: function (creep) {
        if (creep.store.getFreeCapacity() < 10) {
            return false;
        }
        var droppedResources = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
        if (droppedResources.length > 0 && creep.store.getFreeCapacity() > 0) {
            if (creep.pickup(droppedResources[0]) == ERR_NOT_IN_RANGE) {
                // creep.say('NO PICKUP !');
                creep.moveTo(droppedResources[0]);
                return true;
            }
            creep.say('drops');
            // console.log('Picked up DROPPED_RESOURCES by chance :' + creep.name);
            return true;
        }
        const tombstones = creep.pos.findInRange(FIND_TOMBSTONES, 1, { filter: (t) => t.store[RESOURCE_ENERGY] > 0 });
        if (tombstones.length > 0) {
            if (creep.withdraw(tombstones[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(tombstones[0], { visualizePathStyle: { stroke: '#ff0000' } });
            }
            creep.say('tombstone!');
            return true;
        }
        return false;
    },
    goTakeResource: function (creep, range) {
        if (creep.store[RESOURCE_ENERGY] > creep.store.getCapacity() / 4) {
            return false;
        }
        var droppedResources = creep.pos.findInRange(FIND_DROPPED_RESOURCES, range, { filter: (drop) => drop.amount > 20 });

        if (droppedResources.length > 0) {
            if (creep.pickup(droppedResources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedResources[0], { visualizePathStyle: { stroke: '#ff0000' } });
            }
            creep.say('drops!');
            return true;
        }
        const tombstones = creep.pos.findInRange(FIND_TOMBSTONES, range, { filter: (t) => t.store[RESOURCE_ENERGY] > 20 });
        if (tombstones.length > 0) {
            if (creep.withdraw(tombstones[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(tombstones[0], { visualizePathStyle: { stroke: '#ff0000' } });
            }
            creep.say('tombstone!');
            return true;
        }

        var ruins = creep.pos.findInRange(FIND_RUINS, range, { filter: (ruin) => ruin.store[RESOURCE_ENERGY] > 20 });
        if (ruins.length > 0) {
            if (creep.withdraw(ruins[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(ruins[0], { visualizePathStyle: { stroke: '#ff0000' } });
            }
            creep.say('ruins!');
            return true;
        }

        return false;
    },
    goGenerateSafeMode: function (creep) {
        if (creep.room.controller.safeModeAvailable > constant.SAFE_MODE_COUNT) {
            return false;
        }
        if (creep.generateSafeMode(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
        }
        creep.say('🛐' + 'Safe Me!');
        return true;
    },
    goUpgrade: function (creep) {
        if (creep.store.getUsedCapacity() < 1) {
            return false;
        }
        ret = creep.upgradeController(creep.room.controller);
        if (ret == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            creep.say('Up');
            return true;
        } else if (ret == OK) {
            if (creep.pos.findInRange(creep.room.controller, 2).length == 0) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }

            this.dontBlockTheSource(creep, creep.room.controller);
            // this.dontBlockTheRoad(creep, creep.room.controller);
            return true;
        }

        console.log('Upgrade Failed ：' + creep.upgradeController(creep.room.controller));
        creep.say('Upgrade G!');
        return false;
    },
    goMove: function (creep, targetPos) {
        creep.moveTo(targetPos, {
            visualizePathStyle: { stroke: '#66cdaa' }
        });
        creep.say('➡️ ' + targetPos);
    },
    dontBlockTheSource: function (creep, target) {
        const distance = creep.pos.findInRange(FIND_SOURCES, 1);
        if (distance.length > 0) {
            creep.moveTo(target);
        }
    },
    dontBlockTheRoad: function (creep, target, range) {
        // 检查 Creep 是否站在道路上
        const isOnRoad = creep.pos.lookFor(LOOK_STRUCTURES).some(s => s.structureType === STRUCTURE_ROAD);

        if (isOnRoad) {
            // 尝试找到一个周围的非道路位置来站立
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (dx === 0 && dy === 0) continue; // 跳过 Creep 当前的位置

                    const newPosX = creep.pos.x + dx;
                    const newPosY = creep.pos.y + dy;
                    const newPos = new RoomPosition(newPosX, newPosY, creep.room.name);

                    // 检查新位置是否适合站立（没有道路、墙壁等）
                    const isSuitable = newPos.look().every(obj => {
                        return obj.type !== 'structure' ||
                            (obj.structure.structureType !== STRUCTURE_ROAD && obj.structure.structureType !== STRUCTURE_WALL);
                    });
                    console.log('suit' + isSuitable);
                    // 如果找到了合适的位置，移动过去
                    if (isSuitable) {
                        creep.moveTo(newPos, { visualizePathStyle: { stroke: '#ffaa00' } });
                        return true;
                    }
                }
            }
        }
        return false;
    },
    // countWorkBodyNum:function(creep){
    //     return creep.body.filter(part => part.type === WORK).length;
    // },
    iAmLazyDog: function (creep) {
        creep.say('⚠️');
        this.dontBlockTheRoad(creep);
        return true;
    }
};