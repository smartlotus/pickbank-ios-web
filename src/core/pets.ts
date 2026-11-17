import type { HabitatPeriod, PetSpeciesId } from './types';

export interface PetSpeciesSpec {
  id: PetSpeciesId;
  zhName: string;
  enName: string;
  defaultNickZh: string;
  defaultNickEn: string;
  habitatTitleZh: string;
  habitatTitleEn: string;
  dayRoom: string;
  nightRoom: string;
  portraitBase: string;
  portraitAction: string;
  dayFrames: string[];
  nightFrames: string[];
  dayAnchor: [number, number];
  nightAnchor: [number, number];
  spriteSizePct: number;
  lifespanDays: number;
}

const frameList = (prefix: string): string[] =>
  [0, 1, 2, 3, 4, 5].map((i) => `/assets/pets/frames/${prefix}_0${i}.png`);

export const PET_SPECIES_LIST: PetSpeciesSpec[] = [
  {
    id: 'cat',
    zhName: '小猫',
    enName: 'Cat',
    defaultNickZh: '拾念小橘',
    defaultNickEn: 'Tangerine',
    habitatTitleZh: '暖灯客厅',
    habitatTitleEn: 'Warm Lamp Living Room',
    dayRoom: '/assets/pets/rooms/cat_day.jpg',
    nightRoom: '/assets/pets/rooms/cat_night.jpg',
    portraitBase: '/assets/pets/portraits/cat_base.png',
    portraitAction: '/assets/pets/portraits/cat_action.png',
    dayFrames: frameList('pet_stage_young_cat_ball_play'),
    nightFrames: frameList('pet_stage_young_cat_sofa_sleep'),
    dayAnchor: [0.60, 0.56],
    nightAnchor: [0.34, 0.48],
    spriteSizePct: 28,
    lifespanDays: 360,
  },
  {
    id: 'dog',
    zhName: '小狗',
    enName: 'Dog',
    defaultNickZh: '阿柴',
    defaultNickEn: 'Shiba',
    habitatTitleZh: '向阳庭院',
    habitatTitleEn: 'Sunlit Courtyard',
    dayRoom: '/assets/pets/rooms/dog_day.jpg',
    nightRoom: '/assets/pets/rooms/dog_night.jpg',
    portraitBase: '/assets/pets/portraits/dog_base.png',
    portraitAction: '/assets/pets/portraits/dog_action.png',
    dayFrames: frameList('pet_stage_young_dog_dog_tail_wag_sit'),
    nightFrames: frameList('pet_stage_young_dog_dog_tail_wag_sit'),
    dayAnchor: [0.46, 0.56],
    nightAnchor: [0.46, 0.56],
    spriteSizePct: 24,
    lifespanDays: 330,
  },
  {
    id: 'panda',
    zhName: '熊猫',
    enName: 'Panda',
    defaultNickZh: '竹影',
    defaultNickEn: 'Bamboo',
    habitatTitleZh: '翠竹小院',
    habitatTitleEn: 'Jade Bamboo Garden',
    dayRoom: '/assets/pets/rooms/panda_day.jpg',
    nightRoom: '/assets/pets/rooms/panda_night.jpg',
    portraitBase: '/assets/pets/portraits/panda_base.png',
    portraitAction: '/assets/pets/portraits/panda_action.png',
    dayFrames: frameList('pet_stage_young_panda_panda_bamboo_eat'),
    nightFrames: frameList('pet_stage_young_panda_panda_bamboo_eat'),
    dayAnchor: [0.62, 0.50],
    nightAnchor: [0.62, 0.50],
    spriteSizePct: 27,
    lifespanDays: 390,
  },
  {
    id: 'rabbit',
    zhName: '小兔',
    enName: 'Rabbit',
    defaultNickZh: '绒绒',
    defaultNickEn: 'Velvet',
    habitatTitleZh: '花圃木洞',
    habitatTitleEn: 'Floral Hollow',
    dayRoom: '/assets/pets/rooms/rabbit_day.jpg',
    nightRoom: '/assets/pets/rooms/rabbit_night.jpg',
    portraitBase: '/assets/pets/portraits/rabbit_base.png',
    portraitAction: '/assets/pets/portraits/rabbit_action.png',
    dayFrames: frameList('pet_stage_young_rabbit_rabbit_gate_watch'),
    nightFrames: frameList('pet_stage_young_rabbit_rabbit_gate_watch'),
    dayAnchor: [0.50, 0.72],
    nightAnchor: [0.50, 0.72],
    spriteSizePct: 24,
    lifespanDays: 270,
  },
  {
    id: 'lamb',
    zhName: '小羊',
    enName: 'Lamb',
    defaultNickZh: '云团',
    defaultNickEn: 'Cloudlet',
    habitatTitleZh: '云朵草坡',
    habitatTitleEn: 'Cloud Meadow',
    dayRoom: '/assets/pets/rooms/lamb_day.jpg',
    nightRoom: '/assets/pets/rooms/lamb_night.jpg',
    portraitBase: '/assets/pets/portraits/lamb_base.png',
    portraitAction: '/assets/pets/portraits/lamb_action.png',
    dayFrames: frameList('pet_stage_young_lamb_lamb_meadow_play'),
    nightFrames: frameList('pet_stage_young_lamb_lamb_meadow_play'),
    dayAnchor: [0.50, 0.58],
    nightAnchor: [0.50, 0.58],
    spriteSizePct: 25,
    lifespanDays: 300,
  },
  {
    id: 'fish',
    zhName: '小鱼',
    enName: 'Fish',
    defaultNickZh: '泡芙鱼',
    defaultNickEn: 'Bubblefin',
    habitatTitleZh: '珊瑚水境',
    habitatTitleEn: 'Coral Lagoon',
    dayRoom: '/assets/pets/rooms/fish_day.jpg',
    nightRoom: '/assets/pets/rooms/fish_night.jpg',
    portraitBase: '/assets/pets/portraits/fish_base.png',
    portraitAction: '/assets/pets/portraits/fish_action.png',
    dayFrames: frameList('pet_stage_young_fish_fish_bubbles_play'),
    nightFrames: frameList('pet_stage_young_fish_fish_bubbles_play'),
    dayAnchor: [0.36, 0.56],
    nightAnchor: [0.36, 0.56],
    spriteSizePct: 23,
    lifespanDays: 240,
  },
  {
    id: 'calf',
    zhName: '小牛',
    enName: 'Calf',
    defaultNickZh: '奶糖',
    defaultNickEn: 'Toffee',
    habitatTitleZh: '木质谷仓',
    habitatTitleEn: 'Timber Barn',
    dayRoom: '/assets/pets/rooms/calf_day.jpg',
    nightRoom: '/assets/pets/rooms/calf_night.jpg',
    portraitBase: '/assets/pets/portraits/calf_base.png',
    portraitAction: '/assets/pets/portraits/calf_action.png',
    dayFrames: frameList('pet_stage_young_calf_calf_yard_play'),
    nightFrames: frameList('pet_stage_young_calf_calf_yard_play'),
    dayAnchor: [0.54, 0.54],
    nightAnchor: [0.54, 0.54],
    spriteSizePct: 27,
    lifespanDays: 340,
  },
  {
    id: 'horse',
    zhName: '小马',
    enName: 'Horse',
    defaultNickZh: '追风',
    defaultNickEn: 'Zephyr',
    habitatTitleZh: '微风牧场',
    habitatTitleEn: 'Breezy Paddock',
    dayRoom: '/assets/pets/rooms/horse_day.jpg',
    nightRoom: '/assets/pets/rooms/horse_night.jpg',
    portraitBase: '/assets/pets/portraits/horse_base.png',
    portraitAction: '/assets/pets/portraits/horse_action.png',
    dayFrames: frameList('pet_stage_young_horse_horse_track_run'),
    nightFrames: frameList('pet_stage_young_horse_horse_track_run'),
    dayAnchor: [0.52, 0.58],
    nightAnchor: [0.52, 0.58],
    spriteSizePct: 30,
    lifespanDays: 420,
  },
];

export const PET_SPECIES_MAP: Record<PetSpeciesId, PetSpeciesSpec> = Object.fromEntries(
  PET_SPECIES_LIST.map((s) => [s.id, s])
) as Record<PetSpeciesId, PetSpeciesSpec>;

export const MAX_DAILY_PET_INTERACTIONS = 3;

export function getPetInteractionKey(species: PetSpeciesId, date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${species}:${y}-${m}-${d}`;
}

export function getRoomImageForPeriod(spec: PetSpeciesSpec, period: HabitatPeriod): string {
  return period === 'DAY' ? spec.dayRoom : spec.nightRoom;
}
