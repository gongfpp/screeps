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

module.exports = {
    creepsDo: function () {
        //creeps do
        for (const idx in Game.creeps) {
            const creep = Game.creeps[idx];
            if (creep.memory.role == 'harvester') {
                did = this.harvesterDo(creep);
            }
            else if (creep.memory.role == 'supporter') {
                did = this.supporterDo(creep);
            }
            else if (creep.memory.role == 'upgrader') {
                this.upgraderDo(creep);
            }
            else if (creep.memory.role == 'builder') {
                this.builderDo(creep);
            }
            else if (creep.memory.role == 'xiangzi') {
                did = this.xiangziDo(creep);
                console.log(`${creep.name} do ${did}`);
            }
            else if (creep.memory.role == 'attacker') {
                this.attackerDo(creep);

            }
        }
    },
    harvesterDo: function (creep) {
        if (this.pickupByChance(creep)) {
            return 'pickupByChance';
        }
        if (this.goHarvest(creep)) {
            return 'goHarvest';
        }

        if (this.goStoreContainers(creep, 3)) {
            return 'goStoreContainers';
        }
        if (this.goUpgrade(creep)) {
            return 'goUpgrade';
        }

        this.iAmLazyDog(creep);
        return false;
    },
    supporterDo: function (creep) {
        if (this.pickupByChance(creep)) {
            return 'pickupByChance';
        }
        if (this.goTakeResource(creep, 20)) {
            return 'goTakeResource';
        }
        if (this.goWithdrawEnergy(creep)) {
            return 'goWithdrawEnergy';
        }
        if (this.goRepairRanged(creep, 3)) {
            return 'goRepairRanged';
        }
        if (this.goStoreExtensions(creep, 20)) {
            return 'goStoreExtensions';
        }
        // if (this.goBuild(creep, 5)) {
        //     return 'goBuild';
        // }
        if (this.goRepair(creep)) {
            return 'goRepair';
        }
        if (this.goGenerateSafeMode(creep)) {
            return 'goGenerateSafeMode';
        }
        if (this.goUpgrade(creep)) {
            return 'goUpgrade';
        }

        this.iAmLazyDog(creep);
        return false;
    },
    upgraderDo: function (creep) {

        if (this.goWithdrawEnergy(creep)) {
            return 'goWithdrawEnergy';
        }
        if (this.goStoreExtensions(creep, 2)) {
            return 'goStoreExtensions';
        }
        if (this.goUpgrade(creep)) {
            return 'goUpgrade';
        }

        this.iAmLazyDog(creep);
        return false;
    },
    builderDo: function (creep) {
        if (this.goWithdrawEnergy(creep)) {
            return true;
        }
        if (this.goBuild(creep)) {
            return true;
        }
        if (this.goUpgrade(creep)) {
            return true;
        }
        this.iAmLazyDog(creep);
        return false;
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
        this.goFlagRally(creep, 'attackPos');

        //patrol if no target to fight

        return false;
    },
    xiangziDo: function (creep) {
        if (this.goTakeResource(creep, 20)) {
            return 'goTakeResource';
        }
        if (this.goWithdrawFromStorage(creep)) {
            return 'goWithdrawFromStorage';

        }
        if (this.goFillLink(creep)) {
            return 'goFillLink';
        }
        if (this.goStoreExtensions(creep, 6)) {
            return 'goStoreExtensions';
        }

        if (this.goBuild(creep, 5)) {
            return 'goBuild';
        }
        if (this.goRepairRanged(creep, 6)) {
            return 'goRepairRanged';
        }

        if (this.goFlagRally(creep, 'xiangziRally')) {
            return 'goFlagRally';
        }
        // this.iAmLazyDog(creep);
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
        creep.moveTo(flag, { visualizePathStyle: { stroke: '#ffffff' } });
        creep.say('Go:' + flagName);
    },
    goFillLink: function (creep) {
        const sourceLink = Game.getObjectById(constant.SOURCE_LINK);
        if (!sourceLink || sourceLink.store[RESOURCE_ENERGY] == sourceLink.store.getCapacity(RESOURCE_ENERGY)) {
            return false;
        }

        if (creep.transfer(sourceLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sourceLink, { visualizePathStyle: { stroke: '#d174a8' } });
            creep.say('	🪕' + 'Link!');
            return true;
        }

        // creep.say('Link but '+)
        return true;
        // return 'transfer failed :'+creep.transfer(sourceLink, RESOURCE_ENERGY);
    },
    goWithdrawFromTargetLink: function (creep) {
        // 检查 Creep 的能量状态   TODO put it swap goHarvest();
        if (creep.store[RESOURCE_ENERGY] == 0) {
            const source = Game.getObjectById(constant.TARGET_LINK);
            if (source && source.store[RESOURCE_ENERGY] > 0) {
                // 从容器或存储中提取能量
                if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, { visualizePathStyle: { stroke: '#ff5100' } });
                    creep.say('Get E');

                }
                return true;
            }
            creep.say('No E');

            return true;
        }

        //有能量，不需要去提取能量
        return false;
    },
    goWithdrawFromStorage: function (creep) {
        // 检查 Creep 的能量状态   TODO put it swap goHarvest();
        if (creep.store[RESOURCE_ENERGY] == 0) {
            const source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_STORAGE
                        && structure.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity(RESOURCE_ENERGY));
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
            creep.say('No E');

            return true;
        }

        //有能量，不需要去提取能量
        return false;
    },
    goWithdrawEnergy: function (creep) {
        // 检查 Creep 的能量状态   TODO put it swap goHarvest();
        if (creep.store[RESOURCE_ENERGY] == 0) {
            // 寻找最近的容器或存储
            const source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER
                        || structure.structureType == STRUCTURE_STORAGE
                        || structure.structureType == STRUCTURE_LINK) &&
                        structure.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity(RESOURCE_ENERGY);
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
            creep.say('No E');

            return true;
        }

        //有能量，不需要去提取能量
        return false;
    },
    goHarvest: function (creep) {

        //收集资源满了
        if (creep.memory.isHarvesting && creep.store.getFreeCapacity() == 0) {
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
        const target = creep.pos.findClosestByPath(FIND_SOURCES, {
            filter: (s) => {
                return s.energy > 0;
            }
        });

        if (!target) {
            creep.say('NO⛏️！');
            return true;
        }
        if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } })
            // let path = creep.pos.findPathTo(target);
            // creep.move(path[0].direction,{visualizePathStyle:{stroke:'#ffaa00'}});
            creep.say('⛏️' + 'Minecraft!');
            return true;
        }

        return true;
    },
    goBuild: function (creep, range) {
        if (typeof range === 'undefined') {
            // 如果没有提供 range 参数，执行不带 range 的逻辑
            const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (!target) {
                return false;
            }

            this.dontBlockTheSource(creep, target);

            if (creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#b88114' } });
                creep.say('🛠️');
            }
            return true;
        } else {
            // 如果提供了 range 参数，执行带 range 的逻辑
            const targets = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, range);
            const target = creep.pos.findClosestByPath(targets);
            if (!target) {
                return false;
            }

            this.dontBlockTheSource(creep, target);

            if (creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#b88114' } });
                creep.say('🛠️');
            }
            return true;
        }
    },
    goRepair: function (creep) {

        const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_ROAD
                || s.structureType == STRUCTURE_CONTAINER
                || s.structureType == STRUCTURE_STORAGE
                || s.structureType == STRUCTURE_TOWER
                || s.structureType == STRUCTURE_STORAGE
                // || s.structureType == STRUCTURE_WALL
            ) && s.hits < s.hitsMax
        });
        if (!target) {
            return false;
        }

        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#e63995' } });
            creep.say('Repairing!');
            return true;
        }
        return true;
        //根据优先级排序
        // var damagedStructures = creep.room.find(FIND_STRUCTURES, {
        //     filter: (structure) => structure.hits < structure.hitsMax
        // });
        // damagedStructures.sort((a, b) => {
        //     let priorityA = repairPriority[a.structureType] || 99;
        //     let priorityB = repairPriority[b.structureType] || 99;
        //     if (priorityA === priorityB) {
        //         // 如果优先级相同，进一步按照损伤程度排序（百分比损伤最高的优先）
        //         return (a.hits / a.hitsMax) - (b.hits / b.hitsMax);
        //     }
        //     return priorityA - priorityB;
        // });

    },
    goRepairRanged: function (creep, range) {
        const targets = creep.pos.findInRange(FIND_STRUCTURES, range, {
            filter: (s) => (s.structureType == STRUCTURE_ROAD
                || s.structureType == STRUCTURE_CONTAINER
                || s.structureType == STRUCTURE_STORAGE
                || s.structureType == STRUCTURE_TOWER
                // || s.structureType == STRUCTURE_WALL
            ) && s.hits < s.hitsMax
        })

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
        return true;
    },
    goStoreExtensions: function (creep, range) {
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
    goStoreContainers: function (creep, range) {
        const storeTargets = creep.pos.findInRange(FIND_STRUCTURES, range,
            {
                filter: (structure) => {
                    return ((
                        structure.structureType == STRUCTURE_CONTAINER
                        || structure.structureType == STRUCTURE_STORAGE
                        || structure.structureType == STRUCTURE_LINK
                        || structure.structureType == STRUCTURE_EXTENSION
                    ) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
                }
            })
        if (storeTargets.length > 0) {
            const target = creep.pos.findClosestByPath(storeTargets);
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#d174a8' } });
                creep.say('	🪕' + 'Store!')
                return true;
            }
            return true;
        }
        console.log(JSON.stringify(creep.pos));
        creep.say('No Store');
        return false;
    },
    // 如果当前所在的pos有resource在地上，就顺便pickup
    pickupByChance: function (creep) {
        var droppedResources = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
        if (droppedResources.length > 0 && creep.store.getFreeCapacity() > 20) {
            if (creep.pickup(droppedResources[0]) == ERR_NOT_IN_RANGE) {
                // creep.say('NO PICKUP !');
                creep.moveTo(droppedResources[0]);
                return true;
            }
            creep.say('Picked');
            // console.log('Picked up DROPPED_RESOURCES by chance :' + creep.name);
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
        this.dontBlockTheSource(creep, creep.room.controller);
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            creep.say('Up');
            return true;
        }

        if (creep.upgradeController(creep.room.controller) == OK) {
            if (creep.pos.findInRange(creep.room.controller, 2).length == 0) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
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
    iAmLazyDog: function (creep) {
        creep.say('⚠️' + ' No Work');
        return true;
    }
};