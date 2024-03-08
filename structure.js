/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('structure');
 * mod.thing == 'a thing'; // true
 */
var constant = require('constant');
// const LINK_FROM_GROUP = ['65e4ad60713cf6bcb156fe37', '65e9eceeee764b8102cda64c'];
// const LINK_TO_GROUP = ['65e4c94b9cf7c411b7596d24'];

module.exports = {
    isTowerAttack: true,
    towerAttackRange: 25,
    LINK_FROM_1: '65e4ad60713cf6bcb156fe37',
    LINK_FROM_2: '65e9eceeee764b8102cda64c',
    LINK_TO_1: '65e4c94b9cf7c411b7596d24',
    LINK_TO_2: '',
    LINK_FROM_GROUP: ['65e4ad60713cf6bcb156fe37', '65e9eceeee764b8102cda64c'],
    LINK_TO_GROUP: ['65e4c94b9cf7c411b7596d24'],
    structuresDo: function () {
        this.linkDo();

        // 找到所有的tower
        towers = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_TOWER);
        towers.forEach(tower => { this.towerAttack(tower) });

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
        this.LINK_FROM_GROUP.map(sourceLinkName => {
            sourceLink = Game.getObjectById(sourceLinkName);
            if (sourceLink.store.getUsedCapacity(RESOURCE_ENERGY) > sourceLink.store.getFreeCapacity(RESOURCE_ENERGY)) {
                this.LINK_TO_GROUP.map(targetLinkName => {
                    targetLink = Game.getObjectById(targetLinkName);
                    if (targetLink.store.getUsedCapacity(RESOURCE_ENERGY) < 400) {
                        sourceLink.transferEnergy(targetLink);
                        return true;
                    }
                })
            }
        });

        return false;
    },
    towerAttack: function (tower) {
        if (!this.isTowerAttack) {
            return false;
        }
        let hostiles = tower.pos.findInRange(FIND_HOSTILE_CREEPS, this.towerAttackRange);
        const hostile = tower.pos.findClosestByRange(hostiles);
        if (hostile) {
            var username = hostile.owner.username;
            console.log(`User ${username} spotted in room `);
            tower.attack(hostile);
        }
    }
};