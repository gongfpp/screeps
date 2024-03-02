/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('createCreeps');
 * mod.thing == 'a thing'; // true
 */
var constant = require('constant');
const common = require('common');
const SOURCE_1_ID = '5bbcacc19099fc012e636253';
const SOURCE_2_ID = '5bbcacc19099fc012e636254';
const SOURCE_1_MAX_HARVEST_NUM = 3;
const SOURCE_2_MAX_HARVEST_NUM = 1;
const BASEHARVESTER_MAX_NUM = SOURCE_1_MAX_HARVEST_NUM + SOURCE_2_MAX_HARVEST_NUM;

const HARVESTER_BODYPART_300 = [WORK, WORK, CARRY, MOVE];
const HAULER_BODYPART_300 = [WORK, CARRY, CARRY, MOVE, MOVE];

const HARVESTER_BODYPART_550 = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
const HAULER_BODYPART_550 = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];

const HARVESTER_BODYPART_800 = [
  WORK, WORK, WORK, WORK, WORK, WORK,
  CARRY,
  MOVE, MOVE, MOVE
];
const HAULER_BODYPART_800 = [
  WORK, CARRY, MOVE,
  WORK, CARRY, MOVE,
  WORK, CARRY, MOVE,
  WORK, CARRY, MOVE
];


module.exports = {
  isStartUp: false,
  // baseHarvestersMaxNum: 9,
  baseSupporterMaxNum: 8,
  baseBuilderMaxNum: 1,
  midUpgraderMaxNum:3,
  generateCreeps: function () {

    const creeps = _.filter(Game.creeps);

    //自動灾后重建的harvester
    if (!constant.IS_HOME_PEACE
      && _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length < 1
      || creeps.length < 2) {
      this.createHarvesterCreep([WORK, CARRY, MOVE], 'baseHarvester');
      return true;
    }

    //creeps by type
    const baseHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'baseHarvester');
    if (this.isStartUp && baseHarvesters.length < BASEHARVESTER_MAX_NUM) {
      const room = Game.rooms[constant.TARGET_ROOM_ID];
      if (room.energyCapacityAvailable > 900) {
        this.isStartUp = false;
      }
      ret = this.createHarvesterCreep([WORK, WORK, CARRY, MOVE], 'baseHarvester');
      return ret == OK ? 'baseHarvester' : false;
    }

    const baseSupporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'baseSupporter');
    if (this.isStartUp && baseSupporters.length < this.baseSupporterMaxNum) {
      const room = Game.rooms[constant.TARGET_ROOM_ID];
      if (room.energyCapacityAvailable > 900) {
        this.isStartUp = false;
      }
      ret = this.createLittleWorker('baseSupporter', [WORK, WORK, CARRY, CARRY, MOVE, MOVE]);
      return ret == OK ? 'baseSupporter' : false;
    }

    const baseBuilders = _.filter(Game.creeps, (creep) => creep.memory.role == 'baseBuilder');
    if (this.isStartUp && baseBuilders.length < this.baseBuilderMaxNum) {
      const room = Game.rooms[constant.TARGET_ROOM_ID];
      if (room.energyCapacityAvailable > 900) {
        this.isStartUp = false;
      }
      ret = this.createLittleWorker('baseBuilder', [WORK, WORK, CARRY, CARRY, MOVE, MOVE]);
      return ret == OK ? 'baseBuilder' : false;
    }



    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    const supporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'supporter');
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    const repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    const xiangzis = _.filter(Game.creeps, (creep) => creep.memory.role == 'xiangzi');

    const constructionSites = Game.rooms[constant.TARGET_ROOM_ID].find(FIND_MY_CONSTRUCTION_SITES);



    if (harvesters.length < constant.HAVERSTER_MAX_NUM) {
      ret = this.createHarvesterCreep([
        WORK, WORK, WORK, WORK, WORK, WORK,
        CARRY,
        MOVE, MOVE, MOVE
        //cost 800
      ], 'harvester');
      return ret == OK ? 'harvester' : false;
    }

    if (xiangzis.length < constant.XIANGZI_MAX_NUM && constant.IS_HOME_PEACE) {
      this.createLittleWorker('xiangzi');
      return 'xiangzi';
    }

    if (supporters.length < constant.SUPPORTER_MAX_NUM) {
      this.createGeneralCarryer('supporter');
      return 'supporter';
    }

    if (upgraders.length < this.midUpgraderMaxNum) {
      this.createStandWorker('upgrader', HAULER_BODYPART_800);
      return 'upgrader';
    }

    if (constructionSites.length > 0 && builders.length < constant.BUILDER_MAX_NUM) {
      this.createGeneralCarryer('builder');
      return 'builder';
    }

    if (constant.IsUnderAttack == 0) {
      constant.IS_HOME_PEACE = true;
    }
    return false;
  },
  createLittleWorker: function (roleName, bodyParts) {
    if (typeof bodyParts === 'undefined') {
      bodyParts = [
        WORK, CARRY, MOVE,
        WORK, CARRY, MOVE
        //sum = 400
      ];
    }
    ret = Game.spawns[constant.SPAWN_HOME].spawnCreep(bodyParts
      , roleName + Game.time
      , { memory: { role: roleName, targetRoomId: constant.TARGET_ROOM_ID } });
    if (ret == OK) {
      return true;
    }
    return false;
  },
  createStandWorker: function (roleName, bodyParts) {
    if (typeof bodyParts === 'undefined') {
      bodyParts = [
        WORK, WORK, CARRY, MOVE,
        WORK, WORK, CARRY, MOVE,
        WORK, WORK, CARRY, MOVE,
        WORK, WORK, CARRY, MOVE
        //cost :1200
      ]
    }
    Game.spawns[constant.SPAWN_HOME].spawnCreep(
      bodyParts
      , roleName + Game.time
      , {
        memory: {
          role: roleName, targetRoomId: constant.TARGET_ROOM_ID
        }
      });
  },
  createGeneralCarryer: function (roleName, bodyParts) {
    if (typeof bodyParts === 'undefined') {
      bodyParts = [
        WORK, CARRY, MOVE,
        WORK, CARRY, MOVE,
        WORK, CARRY, MOVE,
        WORK, CARRY, MOVE
        //cost : 800
      ]
    }
    Game.spawns[constant.SPAWN_HOME].spawnCreep(
      bodyParts, roleName + Game.time
      , { memory: { role: roleName, targetRoomId: constant.TARGET_ROOM_ID } });
  },
  // 通用单位
  createGeneralWorker: function (roleName, bodyParts) {
    Game.spawns[constant.SPAWN_HOME].spawnCreep(
      bodyParts, roleName + Game.time
      , {
        memory: {
          role: roleName
          , targetRoomId: constant.TARGET_ROOM_ID
        }
      });
  },

  createHarvesterCreep: function (bodyParts, harvesterRole) {
    if (!bodyParts) {
      bodyParts = [
        WORK, WORK, WORK, WORK, WORK, WORK,
        CARRY, CARRY, CARRY,
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

    if (harvesterRole == 'baseHarvester') {
      if (harvestersPerSource[SOURCE_1_ID] < SOURCE_1_MAX_HARVEST_NUM) {
        targetSourceId = SOURCE_1_ID;
      } else if (harvestersPerSource[SOURCE_2_ID] < SOURCE_2_MAX_HARVEST_NUM) {
        targetSourceId = SOURCE_2_ID;
      }
    }

    let ret = Game.spawns[constant.SPAWN_HOME].spawnCreep(bodyParts
      , harvesterRole + Game.time
      , { memory: { role: harvesterRole, targetRoomId: constant.TARGET_ROOM_ID, targetSourceId: targetSourceId } });

    if (OK == ret) {
      console.log('[generateHarvest]:harvester source target:', targetSourceId);
      return true;
    }

    return false;
  },
  clearDeadMemory: function () {
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log('Clearing non-existing creep memory:', name);
      }
    }
  },
};