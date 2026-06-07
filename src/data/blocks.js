export const DEFAULT_BLOCKS = [
  { id: "wake",   label: "Wake up + drink",    kind: "drink", target: 10, floor: 5,  reward: false, scored: true,  giveBackPriority: 1 },
  { id: "dress",  label: "Get dressed",        kind: "shirt", target: 10, floor: 5,  reward: false, scored: true,  giveBackPriority: 4 },
  { id: "groom",  label: "Teeth + vitamins",   kind: "tooth", target: 10, floor: 6,  reward: false, scored: true,  giveBackPriority: 3 },
  { id: "reward", label: "Prize time",         kind: "prize", target: 15, floor: 2,  reward: true,  scored: false, giveBackPriority: 99 },
  { id: "shoes",  label: "Shoes + to the car", kind: "shoe",  target: 5,  floor: 3,  reward: false, scored: false, giveBackPriority: 5 },
];
