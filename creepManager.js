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

const SOURCE_3_ID = '5bbcacb39099fc012e6360cb'
const SOURCE_1_MAX_HARVEST_NUM = 3;
const SOURCE_2_MAX_HARVEST_NUM = 1;

const SOURCE_ID_GROUP = [SOURCE_1_ID, SOURCE_2_ID, SOURCE_3_ID];

const BASEHARVESTER_MAX_NUM = SOURCE_1_MAX_HARVEST_NUM + SOURCE_2_MAX_HARVEST_NUM;

const HARVESTER_BODYPART_300 = [WORK, WORK, CARRY, MOVE];
const HARVESTER_BODYPART_550 = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
const HARVESTER_BODYPART_800 = [
  WORK, WORK, WORK, WORK, WORK, WORK,
  CARRY,
  MOVE, MOVE, MOVE
];
const HARVESTER_BODYPART_KING = [
  //1300
  WORK, WORK, WORK, WORK, WORK, WORK,
  CARRY, CARRY,
  MOVE, MOVE, MOVE
];
const HARVESTER_BODYPART = [[]
  , HARVESTER_BODYPART_300, HARVESTER_BODYPART_550, HARVESTER_BODYPART_800
  , HARVESTER_BODYPART_KING, HARVESTER_BODYPART_KING, HARVESTER_BODYPART_KING];

const HAULER_BODYPART_300 = [WORK, CARRY, CARRY, MOVE, MOVE];
const HAULER_BODYPART_550 = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
const HAULER_BODYPART_800 = [
  WORK, CARRY, MOVE,
  WORK, CARRY, MOVE,
  CARRY, CARRY, MOVE,
  CARRY, CARRY, MOVE
];
const UPGRADER_BODYPART_1300 = [
  WORK, WORK, CARRY, MOVE, MOVE,
  WORK, WORK, CARRY, MOVE, MOVE,
  WORK, CARRY, CARRY, MOVE,
  WORK, CARRY, CARRY, MOVE
];
const UPGRADER_BODYPART_1600 = [
  WORK, WORK, WORK, CARRY, MOVE,
  WORK, WORK, WORK, CARRY, MOVE,
  WORK, WORK, WORK, CARRY, MOVE,
  WORK, WORK, WORK, CARRY
];

const UPGRADER_BODYPART_2200 = [
  WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE,
  WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE,
  WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE,
  WORK, WORK, WORK, WORK, CARRY
];
const UPGRADER_BODYPART = [
  [], HAULER_BODYPART_300
  , HAULER_BODYPART_550
  , HAULER_BODYPART_800
  , UPGRADER_BODYPART_1300
  , UPGRADER_BODYPART_1600
  , UPGRADER_BODYPART_2200];

const SUPPORTER_KING = [
  //800
  WORK, CARRY, MOVE,
  WORK, CARRY, MOVE,
  WORK, CARRY, MOVE,
  WORK, CARRY, MOVE];

const SUPPORTER_BODYPART = [
  [], HAULER_BODYPART_300
  , HAULER_BODYPART_550
  , HAULER_BODYPART_800
  , SUPPORTER_KING
  , SUPPORTER_KING
  , SUPPORTER_KING];

module.exports = {
  sourcesIdGroup: SOURCE_ID_GROUP,
  isStartUp: false,
  // baseHarvestersMaxNum: 9,
  // baseSupporterMaxNum: 8,
  baseBuilderMaxNum: 0,
  upgraderMaxNum: 0,
  xiangziMaxNum: 1,
  minerMaxNum: 0,
  // claimerMaxNum: 0,
  claimerMaxNum: constant.ROOM_GROUPS_ID.length,
  upgraderFixIfNoBuilderExist: 1,
  upgraderFixIfStorageHalfFull: 0,
  creepLevel: 6,
  isStartUpEnergyThreshold: 800,

  generateCreeps: function () {

    const creeps = _.filter(Game.creeps);

    //自動灾后重建的harvester
    if (!constant.IS_HOME_PEACE
      && _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length < 1
      || creeps.length < 2) {
      this.createCreep('baseHarvester', [WORK, CARRY, MOVE]);
      return 'baseHarvester';
    }

    //baseHarvester
    const baseHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'baseHarvester');
    if (this.isStartUp && baseHarvesters.length < BASEHARVESTER_MAX_NUM) {
      const room = Game.rooms[constant.TARGET_ROOM_ID];
      if (room.energyCapacityAvailable >= isStartUpThreshold) {
        this.isStartUp = false;
      }
      ret = this.createHarvesterCreep([WORK, WORK, CARRY, MOVE], 'baseHarvester');
      return ret == OK ? 'baseHarvester' : false;
    }

    //baseSupporter
    const baseSupporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'baseSupporter');
    if (this.isStartUp && baseSupporters.length < this.baseSupporterMaxNum) {
      const room = Game.rooms[constant.TARGET_ROOM_ID];
      if (room.energyCapacityAvailable >= isStartUpThreshold) {
        this.isStartUp = false;
      }
      ret = this.createCreep('baseSupporter', HAULER_BODYPART_550);
      return ret == OK ? 'baseSupporter' : false;
    }

    //baseBuilder
    const baseBuilders = _.filter(Game.creeps, (creep) => creep.memory.role == 'baseBuilder');
    if (this.isStartUp && baseBuilders.length < this.baseBuilderMaxNum) {
      const room = Game.rooms[constant.TARGET_ROOM_ID];
      if (room.energyCapacityAvailable >= isStartUpThreshold) {
        this.isStartUp = false;
      }
      ret = this.createCreep('baseBuilder', HAULER_BODYPART_550);
      return ret == OK ? 'baseBuilder' : false;
    }

    //harvester
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    if (harvesters.length < constant.HAVERSTER_MAX_NUM) {
      ret = this.createHarvesterCreep(HARVESTER_BODYPART[this.creepLevel], 'harvester');
      return ret == OK ? 'harvester' : false;
    }

    //supporter
    const supporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'supporter');
    if (supporters.length < constant.SUPPORTER_MAX_NUM) {
      this.createCreep('supporter', SUPPORTER_BODYPART[this.creepLevel]);
      return 'supporter';
    }

    const constructionSites = Game.rooms[constant.TARGET_ROOM_ID].find(FIND_MY_CONSTRUCTION_SITES);
    //builder
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    if (constructionSites.length > 1 && builders.length < constant.BUILDER_MAX_NUM) {
      this.createCreep('builder', HAULER_BODYPART_800);
      return 'builder';
    }

    //upgrader
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    if (upgraders.length < this.upgraderMaxNum
      || (
        (upgraders.length < this.upgraderMaxNum + this.upgraderFixIfNoBuilderExist)
        && builders.length < 1)
      // || (upgraders.length < this.upgraderMaxNum + this.upgraderFixIfStorageHalfFull)
      // && (Gam))
    ) {
      this.createCreep('upgrader', UPGRADER_BODYPART[this.creepLevel]);
      return 'upgrader';
    }



    //xiangzi
    const xiangzis = _.filter(Game.creeps, (creep) => creep.memory.role == 'xiangzi');
    if (xiangzis.length < this.xiangziMaxNum && constant.IS_HOME_PEACE) {
      this.createCreep('xiangzi', HAULER_BODYPART_800);
      return 'xiangzi';
    }

    if (constant.IsUnderAttack == 0) {
      constant.IS_HOME_PEACE = true;
    }


    //miner
    const miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
    if (miners.length < this.minerMaxNum && constant.IS_HOME_PEACE) {
      //todo 
    }


    const claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
    if (claimers.length < this.claimerMaxNum && constant.IS_HOME_PEACE) {
      this.createClaimerCreep('claimer', [CLAIM, CLAIM, MOVE, MOVE]);
      return 'claimer';
    }

    return false;
  },
  createCreep(roleName, bodyParts) {
    ret = Game.spawns[constant.SPAWN_HOME].spawnCreep(
      bodyParts
      , roleName + Game.time
      , { memory: { role: roleName } });
    if (ret == OK) {
      return true;
    }
    // console.log(`create ${roleName} failed , ret = ${ret}`);
    return false;
  },
  createClaimerCreep: function (roleName, bodyParts) {
    // let claimerPerRoom = {};

    // const rooms = constant.ROOM_GROUPS_ID.map(id => Game.rooms[id]);
    // console.log(JSON.stringify(rooms));
    // for (let room of rooms) {
    //   claimerPerRoom[room.id] = _.filter(Game.creeps, c => c.memory.targetClaimRoomId == room.id).length;
    // }
    // let targetClaimRoomId = rooms[0].id;
    // let targetRoomClaimerNum = Infinity;

    // for (let roomId in claimerPerRoom) {
    //   if (claimerPerRoom[roomId] < targetRoomClaimerNum) {
    //     targetRoomClaimerNum = claimerPerRoom[roomId];
    //     targetClaimRoomId = roomId;
    //   }
    // }

    ret = Game.spawns[constant.SPAWN_HOME].spawnCreep(
      bodyParts
      , roleName + Game.time
      , { memory: { role: roleName } });
    if (ret == OK) {
      return true;
    }
    // console.log(`create ${roleName} failed , ret = ${ret}`);
    return false;
  },
  createHarvesterCreep: function (bodyParts, harvesterRole) {
    if (!bodyParts) {
      console.log('createHarvesterCreep Failed ,no bodyParts!');
      return false;
    }
    let harvestersPerSource = {};
    // let sources = this.sourcesIdGroup;
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
  createMinerCreep: function (bodyParts) {
    //todo

    // let harvestersPerSource = {};
    // const rooms = constant.ROOM_GROUPS_ID.map()
    // let sources = Game.spawns[constant.SPAWN_HOME].room.find(FIND_SOURCES);
    // for (let s of sources) {
    //   harvestersPerSource[s.id] = _.filter(Game.creeps, (c) => {
    //     return c.memory.targetSourceId == s.id
    //   }).length;
    // }
    // let targetSourceId = sources[0].id;
    // let targetSourceWorkerNum = Infinity;

    // for (let sourceId in harvestersPerSource) {
    //   if (harvestersPerSource[sourceId] < targetSourceWorkerNum) {
    //     targetSourceWorkerNum = harvestersPerSource[sourceId];
    //     targetSourceId = sourceId;
    //   }
    // }

    // if (harvesterRole == 'baseHarvester') {
    //   if (harvestersPerSource[SOURCE_1_ID] < SOURCE_1_MAX_HARVEST_NUM) {
    //     targetSourceId = SOURCE_1_ID;
    //   } else if (harvestersPerSource[SOURCE_2_ID] < SOURCE_2_MAX_HARVEST_NUM) {
    //     targetSourceId = SOURCE_2_ID;
    //   }
    // }

    // let ret = Game.spawns[constant.SPAWN_HOME].spawnCreep(bodyParts
    //   , harvesterRole + Game.time
    //   , { memory: { role: harvesterRole, targetRoomId: constant.TARGET_ROOM_ID, targetSourceId: targetSourceId } });

    // if (OK == ret) {
    //   console.log('[generateHarvest]:harvester source target:', targetSourceId);
    //   return true;
    // }

    // return false;
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