/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('structure');
 * mod.thing == 'a thing'; // true
 */
var constant = require('constant');
module.exports = {
    structuresDo: function () {
        this.linkDo();

        // 找到所有的tower
        towers = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_TOWER);
        towers.forEach(tower => {this.towerAttack(tower)});

        // //individual structures
        // for (let idx in Game.structures) {
        //     let stru = Game.structures[idx];
        //     if (stru.structureType == STRUCTURE_TOWER) {
        //         this.towerAttack(stru);
        //         continue;
        //     }
        // }
    },
    linkDo: function () {
        const sourceLink = Game.getObjectById(constant.SOURCE_LINK);
        const targetLink = Game.getObjectById(constant.TARGET_LINK);
        const targetLink2 = Game.getObjectById(constant.TARGET_LINK_2);

        if (!sourceLink
            || sourceLink.store.getUsedCapacity(RESOURCE_ENERGY) == 0
            || sourceLink.store.getUsedCapacity(RESOURCE_ENERGY) < sourceLink.store.getFreeCapacity(RESOURCE_ENERGY)) {
            return false;
        }



        if (targetLink
            && targetLink.store.getUsedCapacity(RESOURCE_ENERGY) < targetLink.store.getFreeCapacity(RESOURCE_ENERGY)) {
            sourceLink.transferEnergy(targetLink);
            return true;
        }

        if (targetLink2
            && targetLink2.store.getUsedCapacity(RESOURCE_ENERGY) < targetLink2.store.getFreeCapacity(RESOURCE_ENERGY)) {
            sourceLink.transferEnergy(targetLink2);
            return true;
        }

    },
    towerAttack: function (tower) {
        // console.log(tower.room.name);
        let hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            console.log(`User ${username} spotted in room `);
            // var towers = Game.rooms[roomName].find(
            //     FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            // towers.forEach(tower => tower.attack(hostiles[0]));
            tower.attack(hostiles[0]);
        }
    }
};