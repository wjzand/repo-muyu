import { Scripture } from '@/types';

export const SCRIPTURES: Scripture[] = [
  { id: 's1', text: '愿代码无bug', category: 'work' },
  { id: 's2', text: '早日实现财务自由', category: 'life' },
  { id: 's3', text: '加班远离我', category: 'work' },
  { id: 's4', text: '需求一次过', category: 'work' },
  { id: 's5', text: '福报+1', category: 'meme' },
  { id: 's6', text: '早日上岸', category: 'life' },
  { id: 's7', text: '远离996', category: 'work' },
  { id: 's8', text: '发量浓密', category: 'life' },
  { id: 's9', text: '甲方不瞎改', category: 'work' },
  { id: 's10', text: '工资翻倍', category: 'life' },
  { id: 's11', text: '准时下班', category: 'work' },
  { id: 's12', text: '代码自动通过', category: 'work' },
  { id: 's13', text: '服务器永不宕机', category: 'work' },
  { id: 's14', text: '奶茶自由', category: 'life' },
  { id: 's15', text: '睡到自然醒', category: 'life' },
  { id: 's16', text: '脱离单身', category: 'life' },
  { id: 's17', text: '产品经理懂技术', category: 'meme' },
  { id: 's18', text: '周报随便写', category: 'meme' },
  { id: 's19', text: '一键部署成功', category: 'work' },
  { id: 's20', text: '老板不加需求', category: 'work' },
  { id: 's21', text: '赛博功德+1', category: 'meme' },
  { id: 's22', text: '电子木鱼显灵', category: 'meme' },
  { id: 's23', text: '算力永充足', category: 'work' },
  { id: 's24', text: '模型训练不崩', category: 'work' },
  { id: 's25', text: '身体健康', category: 'life' },
];

export const SCRIPTURE_COLORS = [
  '#a855f7',
  '#22d3ee',
  '#ec4899',
  '#00ff88',
  '#ffd700',
  '#ff3366',
];

export function getRandomScripture(): Scripture {
  return SCRIPTURES[Math.floor(Math.random() * SCRIPTURES.length)];
}
