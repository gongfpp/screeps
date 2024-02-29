/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('battlefield');
 * mod.thing == 'a thing'; // true
 */
var constant = require('constant');

module.exports = {
    isFight: false,
    attackFlagName: 'A',
    defenderFlagName: 'D',
    healerFlagName: 'H',
    tankFlagName: 'T',
    attackerNum: 2,
    defenderNum: 2,
    healerNum: 2,
    tankNum: 1,
    autoActivateSafeMode: false,

    battleDo: function () {

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
        if (this.autoActivateSafeMode && (
            Game.spawns[constant.SPAWN_HOME].hits < Game.spawns[constant.SPAWN_HOME].hitsMax / 2
            || Game.spawns[constant.SPAWN_HOME].room.find(FIND_MY_CREEPS).length < 2
            || Game.spawns[constant.SPAWN_HOME].room.controller.hits < Game.spawns[constant.SPAWN_HOME].room.controller.hitsMax / 2
        )) {
            Game.spawns[constant.SPAWN_HOME].room.controller.activateSafeMode();
            constant.IS_HOME_PEACE = false;
            this.autoActivateSafeMode = false;
            console.log(`[SafeMode Activated] TICK:${Game.time}`);
        }




    },
    generateBattleCreeps: function () {
        if (!this.isFight) {
            return false;
        }

        attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
        if (attackers.length < this.attackerNum) {

        }
    },
    goAttackerFlag: function (creep, flagName) {
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

};