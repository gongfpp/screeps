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
const HARVESTER_BODYPART_550 = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
const HARVESTER_BODYPART_800 = [
  WORK, WORK, WORK, WORK, WORK, WORK,
  CARRY,
  MOVE, MOVE, MOVE
];
const HARVESTER_BODYPART_1300 = [
  WORK, WORK, WORK, WORK, WORK, WORK,
  CARRY, CARRY,
  MOVE, MOVE, MOVE
];
const HARVESTER_BODYPART = [[], HARVESTER_BODYPART_300, HARVESTER_BODYPART_550, HARVESTER_BODYPART_800, HARVESTER_BODYPART_1300];

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
const UPGRADER_BODYPART = [[], HAULER_BODYPART_300, HAULER_BODYPART_550, HAULER_BODYPART_800, UPGRADER_BODYPART_1300, UPGRADER_BODYPART_1600];

module.exports = {
  isStartUp: false,
  // baseHarvestersMaxNum: 9,
  // baseSupporterMaxNum: 8,
  baseBuilderMaxNum: 0,
  upgraderMaxNum: 0,
  xiangziMaxNum:1,
  upgraderFixIfNoBuilderExist: 1,
  creepLevel: 5,
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
      ret = this.createHarvesterCreep(HARVESTER_BODYPART[4], 'harvester');
      return ret == OK ? 'harvester' : false;
    }

    //supporter
    const supporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'supporter');
    if (supporters.length < constant.SUPPORTER_MAX_NUM) {
      this.createCreep('supporter', HAULER_BODYPART_800);
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
        && builders.length < 1
      )
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
    console.log(`create ${roleName} failed , ret = ${ret}`);
    return false;
  },
  createHarvesterCreep: function (bodyParts, harvesterRole) {
    if (!bodyParts) {
      console.log('createHarvesterCreep Failed ,no bodyParts!');
      return false;
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