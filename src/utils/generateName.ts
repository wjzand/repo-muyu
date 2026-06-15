const PREFIXES = [
  '智障', '代码', '算法', '数据', '全栈', '赛博', '电子',
  '通宵', '加班', '摸鱼', 'Debug', '重构', '部署', '测试',
  '需求', '产品', 'BUG', '996', '奶茶', '键盘',
];

const SUFFIXES = [
  '禅师', '上人', '大师', '菩萨', '佛陀', '罗汉', '比丘',
  '小沙弥', '金刚', '达摩', '仙人', '王者', '狂魔', '战士',
  '判官', '行者', '使徒', '终结者', '粉碎机', '官',
];

export function generateCyberName(): string {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
  return prefix + suffix;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
